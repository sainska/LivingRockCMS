import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useChat({ userId, recipientId, groupId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('sent_at', { ascending: true });
    if (recipientId) {
      query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`);
    } else if (groupId) {
      query = query.eq('group_id', groupId);
    }
    query.then(({ data, error }) => {
      if (error) setError(error.message);
      else setMessages(data || []);
      setLoading(false);
    });
  }, [userId, recipientId, groupId]);

  const sendMessage = async (message) => {
    try {
      const { data, error } = await supabase.from('chat_messages').insert({
        sender_id: userId,
        recipient_id: recipientId,
        group_id: groupId,
        message
      });
      if (error) throw error;
      setMessages(prev => [...prev, data[0]]);
      return { data: data[0], error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  return { messages, loading, error, sendMessage };
} 