import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, XCircle, Paperclip, Trash2, CheckCircle2, MailCheck } from 'lucide-react';

const MemberMessages = () => {
  const { user } = useAuth();
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ recipientEmail: '', subject: '', content: '' });
  const [sending, setSending] = useState(false);
  const [composeError, setComposeError] = useState(null);
  const [composeSuccess, setComposeSuccess] = useState(null);
  const [tab, setTab] = useState('inbox');
  const [openMessage, setOpenMessage] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyData, setReplyData] = useState({ subject: '', content: '' });
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replySuccess, setReplySuccess] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [selected, setSelected] = useState([]); // for bulk actions
  const [attachment, setAttachment] = useState(null);
  const [replyAttachment, setReplyAttachment] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Toast state
  const [toast, setToast] = useState(null);
  // Group chat state
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupInput, setGroupInput] = useState('');
  const [groupSending, setGroupSending] = useState(false);
  const groupChatRef = useRef(null);

  // Soft delete: add deleted_by_recipient and deleted_by_sender boolean columns if not present
  // For now, filter out messages with deleted_by_recipient (inbox) or deleted_by_sender (sent)

  // Fetch messages with search/filter/pagination
  const fetchMessages = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    let inboxQuery = supabase
      .from('messages')
      .select('*, sender:sender_id(first_name, last_name, email), thread_id')
      .eq('recipient_id', user.id)
      .or('deleted_by_recipient.is.null,deleted_by_recipient.eq.false');
    let sentQuery = supabase
      .from('messages')
      .select('*, recipient:recipient_id(first_name, last_name, email), thread_id')
      .eq('sender_id', user.id)
      .or('deleted_by_sender.is.null,deleted_by_sender.eq.false');
    if (search) {
      inboxQuery = inboxQuery.ilike('subject', `%${search}%`);
      sentQuery = sentQuery.ilike('subject', `%${search}%`);
    }
    if (filter === 'read') inboxQuery = inboxQuery.eq('is_read', true);
    if (filter === 'unread') inboxQuery = inboxQuery.eq('is_read', false);
    inboxQuery = inboxQuery.order('created_at', { ascending: false }).range((page-1)*pageSize, page*pageSize-1);
    sentQuery = sentQuery.order('created_at', { ascending: false }).range((page-1)*pageSize, page*pageSize-1);
    const [{ data: inboxData, error: inboxError }, { data: sentData, error: sentError }] = await Promise.all([
      inboxQuery,
      sentQuery
    ]);
    if (inboxError || sentError) setError(inboxError?.message || sentError?.message);
    setInbox(inboxData || []);
    setSent(sentData || []);
    setUnreadCount((inboxData || []).filter(m => !m.is_read).length);
        setLoading(false);
  };

  // Fetch user's groups
  useEffect(() => {
    if (!user) return;
    supabase
      .from('message_group_members')
      .select('group_id, message_groups(id, name)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setGroups((data || []).map(g => g.message_groups));
        if (!selectedGroup && data && data.length > 0) setSelectedGroup(data[0].message_groups);
      });
  }, [user]);

  // Fetch group messages
  useEffect(() => {
    if (!selectedGroup) return;
    supabase
      .from('messages')
      .select('*, sender:sender_id(first_name, last_name, email)')
      .eq('group_id', selectedGroup.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => setGroupMessages(data || []));
    // Real-time updates
    const sub = supabase
      .channel('group-messages-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `group_id=eq.${selectedGroup.id}` }, payload => {
        supabase
          .from('messages')
          .select('*, sender:sender_id(first_name, last_name, email)')
          .eq('group_id', selectedGroup.id)
          .order('created_at', { ascending: true })
          .then(({ data }) => setGroupMessages(data || []));
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [selectedGroup]);

  // Scroll to bottom on new group message
  useEffect(() => {
    if (groupChatRef.current) groupChatRef.current.scrollTop = groupChatRef.current.scrollHeight;
  }, [groupMessages]);

  // Show toast for a few seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setComposeError(null);
    setComposeSuccess(null);
    // Look up recipient by email
    const { data: recipient, error: lookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', composeData.recipientEmail)
      .single();
    if (lookupError || !recipient) {
      setComposeError('Recipient not found.');
      setSending(false);
      return;
    }
    // Insert message
    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipient.id,
        subject: composeData.subject,
        content: composeData.content,
        message_type: 'general',
        is_read: false
      });
    if (sendError) {
      setComposeError('Failed to send message: ' + sendError.message);
    } else {
      setComposeSuccess('Message sent!');
      setComposeData({ recipientEmail: '', subject: '', content: '' });
      fetchMessages();
      setShowCompose(false);
      setTab('sent');
      setToast({ message: 'Message sent!', type: 'success' });
    }
    setSending(false);
  };

  // Send group message
  const handleGroupSend = async (e) => {
    e.preventDefault();
    if (!groupInput.trim() || !selectedGroup) return;
    setGroupSending(true);
    await supabase.from('messages').insert({
      sender_id: user.id,
      group_id: selectedGroup.id,
      content: groupInput,
      message_type: 'group',
      is_read: false
    });
    setGroupInput('');
    setGroupSending(false);
  };

  // Open message dialog and mark as read if needed
  const handleOpenMessage = async (msg, isInbox) => {
    setOpenMessage(msg);
    setShowDialog(true);
    setShowReply(false);
    setReplyData({ subject: '', content: '' });
    setReplyError(null);
    setReplySuccess(null);
    if (isInbox && !msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
      fetchMessages();
    }
  };

  // Reply to message
  const handleReply = async (e) => {
    e.preventDefault();
    setReplying(true);
    setReplyError(null);
    setReplySuccess(null);
    if (!openMessage?.sender?.email) {
      setReplyError('Cannot determine sender email.');
      setReplying(false);
      return;
    }
    // Insert reply message
    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: openMessage.sender_id,
        subject: replyData.subject || `Re: ${openMessage.subject}`,
        content: replyData.content,
        message_type: 'reply',
        is_read: false
      });
    if (sendError) {
      setReplyError('Failed to send reply: ' + sendError.message);
    } else {
      setReplySuccess('Reply sent!');
      setReplyData({ subject: '', content: '' });
      fetchMessages();
      setShowReply(false);
      setTab('sent');
      setToast({ message: 'Reply sent!', type: 'success' });
    }
    setReplying(false);
  };

  // Delete message (soft delete)
  const handleDelete = async (msg, isInbox) => {
    if (isInbox) {
      await supabase.from('messages').update({ deleted_by_recipient: true }).eq('id', msg.id);
    } else {
      await supabase.from('messages').update({ deleted_by_sender: true }).eq('id', msg.id);
    }
    fetchMessages();
    setShowDialog(false);
    setToast({ message: 'Message deleted.', type: 'success' });
  };

  // Mark as unread (single)
  const handleMarkUnread = async (msg) => {
    await supabase.from('messages').update({ is_read: false }).eq('id', msg.id);
    fetchMessages();
    setShowDialog(false);
    setToast({ message: 'Message marked as unread.', type: 'success' });
  };
  // Bulk mark as read/unread
  const handleBulkMark = async (read) => {
    await Promise.all(selected.map(id => supabase.from('messages').update({ is_read: read }).eq('id', id)));
    setSelected([]);
    fetchMessages();
    setToast({ message: `Messages ${read ? 'marked as read' : 'marked as unread'}.`, type: 'success' });
  };
  // Bulk delete
  const handleBulkDelete = async (isInbox) => {
    await Promise.all(selected.map(id => supabase.from('messages').update(isInbox ? { deleted_by_recipient: true } : { deleted_by_sender: true }).eq('id', id)));
    setSelected([]);
    fetchMessages();
    setToast({ message: `Messages ${isInbox ? 'deleted from inbox' : 'deleted from sent'} permanently.`, type: 'success' });
  };

  // Attachment upload (compose/reply)
  const handleAttachment = async (file, setFn) => {
    if (!file) return;
    const { data, error } = await supabase.storage.from('attachments').upload(`${user.id}/${Date.now()}`, file);
    if (error) {
      setToast({ message: `Failed to upload attachment: ${error.message}`, type: 'error' });
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(`${user.id}/${data.path}`);
    setFn(publicUrl);
    setToast({ message: 'Attachment uploaded!', type: 'success' });
  };

  // Group messages by thread (by subject if no thread_id)
  const groupByThread = (messages) => {
    const threads = {};
    messages.forEach(msg => {
      const key = msg.thread_id || msg.subject;
      if (!threads[key]) threads[key] = [];
      threads[key].push(msg);
    });
    return Object.values(threads);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle>My Messages {unreadCount > 0 && <span className="ml-2 inline-block bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}</CardTitle>
          <button className="btn btn-xs" onClick={() => setShowCompose(!showCompose)}>
            {showCompose ? 'Cancel' : 'Compose Message'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {showCompose && (
          <form onSubmit={handleSend} className="mb-4 space-y-4 p-4 border rounded bg-gray-50 animate-fade-in">
            <div>
              <label className="block text-sm font-medium mb-1">Recipient Email</label>
              <input
                type="email"
                required
                placeholder="Recipient Email"
                value={composeData.recipientEmail}
                onChange={e => setComposeData({ ...composeData, recipientEmail: e.target.value })}
                className="input input-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Subject"
                value={composeData.subject}
                onChange={e => setComposeData({ ...composeData, subject: e.target.value })}
                className="input input-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                required
                placeholder="Message..."
                value={composeData.content}
                onChange={e => setComposeData({ ...composeData, content: e.target.value })}
                className="textarea textarea-sm w-full"
                rows={4}
              />
            </div>
            {composeError && <div className="text-red-500 text-xs">{composeError}</div>}
            {composeSuccess && <div className="text-green-600 text-xs">{composeSuccess}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Attachment</label>
              <label className="btn btn-xs btn-secondary cursor-pointer inline-flex items-center gap-2">
                <input type="file" onChange={e => handleAttachment(e.target.files[0], setAttachment)} className="hidden" />
                {attachment ? attachment.name : 'Choose file'}
              </label>
              {attachment && (
                <button className="btn btn-xs btn-danger ml-2" onClick={() => setAttachment(null)}>Remove</button>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-secondary bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow hover:from-gray-400 hover:to-gray-500 transition-transform duration-150 active:scale-95 flex items-center gap-2" onClick={() => setShowCompose(false)}><XCircle className="h-4 w-4" /> Cancel</button>
              <button type="submit" className="btn btn-primary bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform duration-150 active:scale-95 flex items-center gap-2" disabled={sending}>
                {sending ? <Loader2 className="animate-spin h-4 w-4 inline-block mr-1" /> : <Send className="h-4 w-4" />} Send
              </button>
            </div>
          </form>
        )}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-4 w-full flex gap-2">
            <TabsTrigger value="inbox" className="flex-1">Inbox</TabsTrigger>
            <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
            <TabsTrigger value="group" className="flex-1">Group Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="inbox">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
            ) : inbox.length === 0 ? (
          <div>No messages found.</div>
        ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">From</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inbox.map((msg) => (
                      <tr key={msg.id} className={msg.is_read ? '' : 'bg-blue-50 font-semibold'} onClick={e => { if (e.target.tagName !== 'BUTTON') handleOpenMessage(msg, true); }} style={{ cursor: 'pointer' }}>
                        <td className="p-2">{msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Unknown'}</td>
                        <td className="p-2">{msg.subject}</td>
                        <td className="p-2">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</td>
                        <td className="p-2">
                          {msg.is_read ? (
                            <span className="text-green-600">Read</span>
                          ) : (
                            <span className="text-blue-600">Unread</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button className="btn btn-xs btn-danger transition-transform duration-100 active:scale-95 hover:bg-red-700" onClick={e => { e.stopPropagation(); handleDelete(msg, true); }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="sent">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : sent.length === 0 ? (
              <div>No sent messages found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">To</th>
                      <th className="p-2 text-left">Subject</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sent.map((msg) => (
                      <tr key={msg.id} onClick={e => { if (e.target.tagName !== 'BUTTON') handleOpenMessage(msg, false); }} style={{ cursor: 'pointer' }}>
                        <td className="p-2">{msg.recipient ? `${msg.recipient.first_name} ${msg.recipient.last_name}` : 'Unknown'}</td>
                        <td className="p-2">{msg.subject}</td>
                        <td className="p-2">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</td>
                        <td className="p-2">
                          {msg.is_read ? (
                            <span className="text-green-600">Read</span>
                          ) : (
                            <span className="text-blue-600">Unread</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button className="btn btn-xs btn-danger transition-transform duration-100 active:scale-95 hover:bg-red-700" onClick={e => { e.stopPropagation(); handleDelete(msg, false); }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="group">
            <div className="flex h-[400px] md:h-[500px] border rounded overflow-hidden animate-fade-in">
              <div className="w-48 bg-gray-100 border-r p-2 overflow-y-auto">
                {groups.map(g => (
                  <button key={g.id} className={`block w-full text-left px-2 py-1 rounded mb-1 ${selectedGroup && g.id === selectedGroup.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`} onClick={() => setSelectedGroup(g)}>{g.name}</button>
                ))}
              </div>
              <div className="flex-1 flex flex-col">
                <div ref={groupChatRef} className="flex-1 overflow-y-auto p-2 bg-white">
                  {groupMessages.length === 0 ? <div className="text-gray-400 text-center mt-8">No messages yet.</div> :
                    groupMessages.map(msg => (
                      <div key={msg.id} className={`mb-2 ${msg.sender_id === user.id ? 'text-right' : 'text-left'}`}> 
                        <span className="inline-block px-3 py-1 rounded shadow bg-gradient-to-r from-blue-100 to-blue-200 text-sm">{msg.content}</span>
                        <div className="text-xs text-gray-500">{msg.sender ? msg.sender.first_name : 'You'} &middot; {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}</div>
                      </div>
                    ))}
                </div>
                <form onSubmit={handleGroupSend} className="flex gap-2 p-2 border-t bg-gray-50">
                  <input type="text" value={groupInput} onChange={e => setGroupInput(e.target.value)} className="flex-1 input input-sm" placeholder="Type a message..." />
                  <button type="submit" className="btn btn-primary bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:from-blue-600 hover:to-blue-800 transition-transform duration-150 active:scale-95 flex items-center gap-2" disabled={groupSending}>Send</button>
                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {/* Message Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          {openMessage && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{openMessage.subject}</DialogTitle>
              </DialogHeader>
              <div className="mb-2 text-xs text-gray-500">
                {tab === 'inbox' ? (
                  <>
                    <span>From: {openMessage.sender ? `${openMessage.sender.first_name} ${openMessage.sender.last_name} (${openMessage.sender.email})` : 'Unknown'}</span>
                  </>
                ) : (
                  <>
                    <span>To: {openMessage.recipient ? `${openMessage.recipient.first_name} ${openMessage.recipient.last_name} (${openMessage.recipient.email})` : 'Unknown'}</span>
                  </>
                )}
                <br />
                <span>Date: {openMessage.created_at ? new Date(openMessage.created_at).toLocaleString() : ''}</span>
              </div>
              <div className="whitespace-pre-line text-sm mb-4">{openMessage.content}</div>
              {openMessage.attachment_url && (
                <div className="mt-4 text-sm text-gray-500">
                  <span>Attachment: </span>
                  <a href={openMessage.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Attachment</a>
                </div>
              )}
              {/* Reply and Delete buttons */}
              {tab === 'inbox' && !showReply && (
                <button className="btn btn-xs mr-2 transition-transform duration-100 active:scale-95" onClick={() => setShowReply(true)}>Reply</button>
              )}
              <button className="btn btn-xs btn-danger transition-transform duration-100 active:scale-95 hover:bg-red-700" onClick={() => handleDelete(openMessage, tab === 'inbox')}>Delete</button>
              {/* Reply form */}
              {showReply && (
                <form onSubmit={handleReply} className="mt-4 space-y-2 p-2 border rounded bg-gray-50">
                  <div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={replyData.subject || `Re: ${openMessage.subject}`}
                      onChange={e => setReplyData({ ...replyData, subject: e.target.value })}
                      className="input input-sm w-full"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      placeholder="Reply..."
                      value={replyData.content}
                      onChange={e => setReplyData({ ...replyData, content: e.target.value })}
                      className="textarea textarea-sm w-full"
                      rows={4}
                    />
                  </div>
                  {replyError && <div className="text-red-500 text-xs">{replyError}</div>}
                  {replySuccess && <div className="text-green-600 text-xs">{replySuccess}</div>}
                  <button type="submit" className="btn btn-xs transition-transform duration-100 active:scale-95" disabled={replying}>
                    {replying ? <Loader2 className="animate-spin h-4 w-4 inline-block mr-1" /> : null}
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                  <button type="button" className="btn btn-xs ml-2 transition-transform duration-100 active:scale-95" onClick={() => setShowReply(false)}>Cancel</button>
                  {replyAttachment && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span>Attachment: </span>
                      <a href={replyAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download Attachment</a>
                    </div>
                  )}
                  <input type="file" onChange={e => handleAttachment(e.target.files[0], setReplyAttachment)} className="input input-sm w-full" />
                </form>
              )}
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg flex items-center gap-2 transition-all duration-500 animate-fade-in ${toast.type==='success'?'bg-gradient-to-r from-green-500 to-green-700 text-white':toast.type==='delivered'?'bg-gradient-to-r from-blue-500 to-blue-700 text-white':'bg-gradient-to-r from-red-500 to-red-700 text-white'} ${toast ? 'opacity-100' : 'opacity-0'}`}>
          {toast.type==='success' && <CheckCircle2 className="h-5 w-5" />}
          {toast.type==='error' && <XCircle className="h-5 w-5" />}
          {toast.type==='delivered' && <MailCheck className="h-5 w-5" />}
          <span>{toast.message}</span>
        </div>
      )}
    </Card>
  );
};

export default MemberMessages; 