import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import jsPDF from 'jspdf';
import { useDonations } from '@/hooks/useDonations';
// Add new imports for email, modals, etc. as needed

const MemberGiving = () => {
  const { user } = useAuth();
  const [giving, setGiving] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recurring, setRecurring] = useState([]);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [expanded, setExpanded] = useState({});
  const toggleExpand = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  // Add state for new features
  const [showGivingDetails, setShowGivingDetails] = useState(true); // privacy toggle
  const [pledges, setPledges] = useState([]);
  const [goals, setGoals] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [contactModal, setContactModal] = useState(false);
  const [showNewRecurring, setShowNewRecurring] = useState(false);
  const [showNewPledge, setShowNewPledge] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);

  // New Recurring Donation form state
  const [newRecurring, setNewRecurring] = useState({ amount: '', frequency: 'monthly', start_date: '', end_date: '' });
  // New Pledge form state
  const [newPledge, setNewPledge] = useState({ amount: '', purpose: '', start_date: '', end_date: '' });
  // New Goal form state
  const [newGoal, setNewGoal] = useState({ goal_amount: '', period: 'year', start_date: '', end_date: '' });

  // Use the new hook for donations
  const { donations, loading: loadingDonations, error: errorDonations, total: totalDonations } = useDonations({
    userId: user?.id,
    search,
    page,
    pageSize
  });

  // Update totalPages based on totalDonations
  const totalPages = Math.max(1, Math.ceil((totalDonations || 0) / pageSize));

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('donations')
      .select('*')
      .eq('donor_id', user.id)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setGiving(data || []);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingRecurring(true);
    supabase
      .from('recurring_donations')
      .select('*')
      .eq('donor_id', user.id)
      .then(({ data }) => {
        setRecurring(data || []);
        setLoadingRecurring(false);
      });
  }, [user]);

  // Fetch privacy toggle, pledges, goals
  useEffect(() => {
    if (!user) return;
    supabase.from('users').select('show_giving_details').eq('id', user.id).single().then(({ data }) => {
      if (data) setShowGivingDetails(data.show_giving_details);
    });
    supabase.from('pledges').select('*').eq('donor_id', user.id).then(({ data }) => setPledges(data || []));
    supabase.from('giving_goals').select('*').eq('donor_id', user.id).then(({ data }) => setGoals(data || []));
  }, [user]);

  const totalGiven = useMemo(() => giving.reduce((sum, g) => sum + Number(g.amount), 0), [giving]);
  const thisYear = new Date().getFullYear();
  const totalGivenThisYear = useMemo(() => giving.filter(g => new Date(g.transaction_date).getFullYear() === thisYear).reduce((sum, g) => sum + Number(g.amount), 0), [giving]);
  const thisMonth = new Date().getMonth();
  const totalGivenThisMonth = useMemo(() => giving.filter(g => new Date(g.transaction_date).getFullYear() === thisYear && new Date(g.transaction_date).getMonth() === thisMonth).reduce((sum, g) => sum + Number(g.amount), 0), [giving]);
  const givingByType = useMemo(() => {
    const map = {};
    giving.forEach(g => {
      map[g.donation_type] = (map[g.donation_type] || 0) + Number(g.amount);
    });
    return map;
  }, [giving]);
  const givingTrends = useMemo(() => {
    // Group by month (YYYY-MM)
    const map = {};
    giving.forEach(g => {
      const d = new Date(g.transaction_date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      map[key] = (map[key] || 0) + Number(g.amount);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [giving]);

  const campaigns = useMemo(() => {
    const map = {};
    giving.forEach(g => {
      if (g.campaign_id && g.campaign_id !== '') {
        map[g.campaign_id] = g.campaign_name || g.campaign_id;
      }
    });
    return map;
  }, [giving]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const givingFilteredByCampaign = useMemo(() => {
    if (!selectedCampaign) return giving;
    return giving.filter(g => g.campaign_id === selectedCampaign);
  }, [giving, selectedCampaign]);

  // Pagination logic
  const paginatedGiving = useMemo(() => {
    let filtered = givingFilteredByCampaign.filter(g =>
      (!search || g.donation_type?.toLowerCase().includes(search.toLowerCase()) ||
        g.amount?.toString().includes(search) ||
        g.campaign_name?.toLowerCase().includes(search.toLowerCase()) ||
        g.payment_method?.toLowerCase().includes(search.toLowerCase()) ||
        g.reference_number?.toLowerCase().includes(search.toLowerCase()))
    );
    return filtered.slice((page-1)*pageSize, page*pageSize);
  }, [givingFilteredByCampaign, search, page, pageSize]);

  const updateRecurringStatus = async (id, is_active) => {
    await supabase.from('recurring_donations').update({ is_active }).eq('id', id);
    setRecurring(r => r.map(rd => rd.id === id ? { ...rd, is_active } : rd));
  };

  // Update emailReceipt to call backend
  const emailReceipt = async (donation) => {
    try {
      const res = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject: 'Your Donation Receipt',
          text: `Thank you for your donation of KES ${donation.amount} on ${donation.transaction_date}. Reference: ${donation.reference_number || ''}`,
          html: `<p>Thank you for your donation of <b>KES ${donation.amount}</b> on <b>${donation.transaction_date}</b>.<br/>Reference: <b>${donation.reference_number || ''}</b></p>`
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Receipt emailed successfully!');
      } else {
        alert('Failed to send email: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to send email: ' + err.message);
    }
  };
  const [statementPeriod, setStatementPeriod] = useState('all');
  const filteredForStatement = useMemo(() => {
    if (statementPeriod === 'all') return giving;
    if (statementPeriod === 'year') return giving.filter(g => new Date(g.transaction_date).getFullYear() === thisYear);
    if (statementPeriod === 'month') return giving.filter(g => new Date(g.transaction_date).getFullYear() === thisYear && new Date(g.transaction_date).getMonth() === thisMonth);
    return giving;
  }, [giving, statementPeriod, thisYear, thisMonth]);
  const downloadStatement = () => {
    const doc = new jsPDF();
    doc.text('Giving Statement', 10, 10);
    doc.text(`Period: ${statementPeriod}`, 10, 20);
    let y = 30;
    filteredForStatement.forEach((g, i) => {
      doc.text(`${i+1}. ${g.transaction_date ? new Date(g.transaction_date).toLocaleDateString() : ''} - KES ${g.amount} - ${g.donation_type}`, 10, y);
      y += 10;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    doc.save(`giving_statement_${statementPeriod}.pdf`);
  };

  const significantGift = useMemo(() => giving.some(g => Number(g.amount) >= 10000), [giving]);
  const milestone = useMemo(() => totalGiven >= 100000, [totalGiven]);

  // Add new recurring donation
  const handleAddRecurring = async () => {
    if (!newRecurring.amount || !newRecurring.start_date) return alert('Fill all required fields');
    await supabase.from('recurring_donations').insert({
      donor_id: user.id,
      amount: newRecurring.amount,
      frequency: newRecurring.frequency,
      start_date: newRecurring.start_date,
      end_date: newRecurring.end_date || null,
      is_active: true
    });
    setShowNewRecurring(false);
    setNewRecurring({ amount: '', frequency: 'monthly', start_date: '', end_date: '' });
    // Refresh recurring list
    supabase.from('recurring_donations').select('*').eq('donor_id', user.id).then(({ data }) => setRecurring(data || []));
  };

  // Add new pledge
  const handleAddPledge = async () => {
    if (!newPledge.amount || !newPledge.purpose || !newPledge.start_date) return alert('Fill all required fields');
    await supabase.from('pledges').insert({
      donor_id: user.id,
      amount: newPledge.amount,
      purpose: newPledge.purpose,
      start_date: newPledge.start_date,
      end_date: newPledge.end_date || null,
      status: 'active'
    });
    setShowNewPledge(false);
    setNewPledge({ amount: '', purpose: '', start_date: '', end_date: '' });
    supabase.from('pledges').select('*').eq('donor_id', user.id).then(({ data }) => setPledges(data || []));
  };

  // Add new giving goal
  const handleAddGoal = async () => {
    if (!newGoal.goal_amount || !newGoal.period || !newGoal.start_date) return alert('Fill all required fields');
    await supabase.from('giving_goals').insert({
      donor_id: user.id,
      goal_amount: newGoal.goal_amount,
      period: newGoal.period,
      start_date: newGoal.start_date,
      end_date: newGoal.end_date || null
    });
    setShowNewGoal(false);
    setNewGoal({ goal_amount: '', period: 'year', start_date: '', end_date: '' });
    supabase.from('giving_goals').select('*').eq('donor_id', user.id).then(({ data }) => setGoals(data || []));
  };

  // Toggle anonymous giving for a donation (UI only, for new donations)
  // For demonstration, add a checkbox in the donation form (not shown here)

  // Privacy toggle
  const handlePrivacyToggle = async (checked) => {
    setShowGivingDetails(checked);
    await supabase.from('users').update({ show_giving_details: checked }).eq('id', user.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Giving</CardTitle>
      </CardHeader>
      <CardContent>
        {milestone && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            �� Thank you for your incredible generosity! You have given over KES 100,000. Your support makes a huge difference!
          </div>
        )}
        {!milestone && significantGift && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
            🙏 Thank you for your significant gift! Your generosity is greatly appreciated.
          </div>
        )}
        {/* UI for privacy toggle */}
        <div className="mb-4">
          <label>
            <input type="checkbox" checked={showGivingDetails} onChange={e => handlePrivacyToggle(e.target.checked)} />
            Show my giving details
          </label>
        </div>

        {/* Add anonymous indicator in table */}
        {!showGivingDetails ? <div>Your giving details are hidden for privacy.</div> : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold">Pledges</h2>
              <div className="flex justify-between items-center">
                <div>
                  {pledges.length === 0 ? <div>No active pledges.</div> : (
                    <ul>{pledges.map(p => <li key={p.id}>{p.purpose}: KES {p.fulfilled_amount} / {p.amount} ({p.status})</li>)}</ul>
                  )}
                </div>
                <button className="btn btn-xs" onClick={() => setShowNewPledge(true)}>Add Pledge</button>
              </div>
              {showNewPledge && (
                <div className="mb-2 p-2 border rounded">
                  <input type="number" placeholder="Amount" value={newPledge.amount} onChange={e => setNewPledge({ ...newPledge, amount: e.target.value })} />
                  <input type="text" placeholder="Purpose" value={newPledge.purpose} onChange={e => setNewPledge({ ...newPledge, purpose: e.target.value })} />
                  <input type="date" placeholder="Start Date" value={newPledge.start_date} onChange={e => setNewPledge({ ...newPledge, start_date: e.target.value })} />
                  <input type="date" placeholder="End Date (optional)" value={newPledge.end_date} onChange={e => setNewPledge({ ...newPledge, end_date: e.target.value })} />
                  <button className="btn btn-xs ml-2" onClick={handleAddPledge}>Save</button>
                  <button className="btn btn-xs ml-2" onClick={() => setShowNewPledge(false)}>Cancel</button>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold">Giving Goals</h2>
              <div className="flex justify-between items-center">
                <div>
                  {goals.length === 0 ? <div>No giving goals set.</div> : (
                    <ul>{goals.map(g => <li key={g.id}>{g.period}: KES {g.goal_amount} ({g.start_date} - {g.end_date || 'ongoing'})</li>)}</ul>
                  )}
                </div>
                <button className="btn btn-xs" onClick={() => setShowNewGoal(true)}>Add Goal</button>
              </div>
              {showNewGoal && (
                <div className="mb-2 p-2 border rounded">
                  <input type="number" placeholder="Goal Amount" value={newGoal.goal_amount} onChange={e => setNewGoal({ ...newGoal, goal_amount: e.target.value })} />
                  <select value={newGoal.period} onChange={e => setNewGoal({ ...newGoal, period: e.target.value })}>
                    <option value="year">Year</option>
                    <option value="month">Month</option>
                    <option value="custom">Custom</option>
                  </select>
                  <input type="date" placeholder="Start Date" value={newGoal.start_date} onChange={e => setNewGoal({ ...newGoal, start_date: e.target.value })} />
                  <input type="date" placeholder="End Date (optional)" value={newGoal.end_date} onChange={e => setNewGoal({ ...newGoal, end_date: e.target.value })} />
                  <button className="btn btn-xs ml-2" onClick={handleAddGoal}>Save</button>
                  <button className="btn btn-xs ml-2" onClick={() => setShowNewGoal(false)}>Cancel</button>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold">Recurring Donations</h2>
              <div className="flex justify-between items-center">
                <div>
                  {loadingRecurring ? <div>Loading...</div> : recurring.length === 0 ? <div>No recurring donations found.</div> : (
                    <table className="w-full text-xs mb-2">
                      <thead><tr><th>Amount</th><th>Frequency</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {recurring.map(rd => (
                          <tr key={rd.id}>
                            <td>KES {rd.amount}</td>
                            <td>{rd.frequency}</td>
                            <td>{rd.start_date}</td>
                            <td>{rd.end_date || '-'}</td>
                            <td>{rd.is_active ? 'Active' : 'Paused'}</td>
                            <td>
                              {rd.is_active ? (
                                <button className="btn btn-xs" onClick={() => updateRecurringStatus(rd.id, false)}>Pause</button>
                              ) : (
                                <button className="btn btn-xs" onClick={() => updateRecurringStatus(rd.id, true)}>Resume</button>
                              )}
                              <button className="btn btn-xs ml-2" onClick={() => updateRecurringStatus(rd.id, null)}>Cancel</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <button className="btn btn-xs" onClick={() => setShowNewRecurring(true)}>Add Recurring</button>
              </div>
              {showNewRecurring && (
                <div className="mb-2 p-2 border rounded">
                  <input type="number" placeholder="Amount" value={newRecurring.amount} onChange={e => setNewRecurring({ ...newRecurring, amount: e.target.value })} />
                  <select value={newRecurring.frequency} onChange={e => setNewRecurring({ ...newRecurring, frequency: e.target.value })}>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <input type="date" placeholder="Start Date" value={newRecurring.start_date} onChange={e => setNewRecurring({ ...newRecurring, start_date: e.target.value })} />
                  <input type="date" placeholder="End Date (optional)" value={newRecurring.end_date} onChange={e => setNewRecurring({ ...newRecurring, end_date: e.target.value })} />
                  <button className="btn btn-xs ml-2" onClick={handleAddRecurring}>Save</button>
                  <button className="btn btn-xs ml-2" onClick={() => setShowNewRecurring(false)}>Cancel</button>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-bold">Giving Summary</h2>
              <div className="flex flex-wrap gap-6 md:gap-4 sm:flex-col">
                <div><span className="font-semibold">Total Given:</span> KES {totalGiven.toLocaleString()}</div>
                <div><span className="font-semibold">This Year:</span> KES {totalGivenThisYear.toLocaleString()}</div>
                <div><span className="font-semibold">This Month:</span> KES {totalGivenThisMonth.toLocaleString()}</div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">By Type</h3>
                <ul className="flex flex-wrap gap-4 text-xs">
                  {Object.entries(givingByType).map(([type, amt]) => (
                    <li key={type}><span className="font-semibold">{type}:</span> KES {amt.toLocaleString()}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Giving Trend (KES/month)</h3>
                <div className="flex items-end gap-2 h-24">
                  {givingTrends.map(([month, amt]) => (
                    <div key={month} className="flex flex-col items-center">
                      <div style={{height: Math.max(amt/totalGiven*80, 4)}} className="w-6 bg-blue-500 rounded-t"></div>
                      <span className="text-xs mt-1">{month.slice(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {Object.keys(campaigns).length > 0 && (
              <div className="flex gap-2 mb-2">
                <label>Filter by Campaign:</label>
                <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
                  <option value="">All</option>
                  {Object.entries(campaigns).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Add search and pagination controls */}
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Search donations..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              <button disabled={page<=1} onClick={()=>setPage(page-1)}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page>=totalPages} onClick={()=>setPage(page+1)}>Next</button>
            </div>
            {/* Giving Table */}
            <Table className="w-full text-xs md:text-sm overflow-x-auto block md:table">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Anonymous</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingDonations ? (
                  <TableRow><TableCell colSpan={9}>Loading...</TableCell></TableRow>
                ) : errorDonations ? (
                  <TableRow><TableCell colSpan={9} className="text-red-500">{errorDonations}</TableCell></TableRow>
                ) : donations.length === 0 ? (
                  <TableRow><TableCell colSpan={9}>No giving records found.</TableCell></TableRow>
                ) : (
                  donations.map((g) => (
                    <React.Fragment key={g.id}>
                      <TableRow>
                        <TableCell>
                          <button className="btn btn-xs" onClick={() => toggleExpand(g.id)}>{expanded[g.id] ? '-' : '+'}</button>
                        </TableCell>
                        <TableCell>{g.transaction_date ? new Date(g.transaction_date).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{g.donation_type}</TableCell>
                        <TableCell>{g.amount}</TableCell>
                        <TableCell>
                          {g.payment_method}
                          {g.payment_method === 'mobile_money' && (
                            <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800 text-xs">M-Pesa</span>
                          )}
                          {g.reference_number && (
                            <div className="text-xs text-gray-500">Ref: {g.reference_number}</div>
                          )}
                        </TableCell>
                        <TableCell>{g.notes || '-'}</TableCell>
                        <TableCell>{g.campaign_name || g.campaign_id || '-'}</TableCell>
                        <TableCell>{g.is_anonymous ? 'Yes' : 'No'}</TableCell>
                        <TableCell>
                          <button className="btn btn-xs" onClick={() => emailReceipt(g)}>Email</button>
                          <button className="btn btn-xs ml-2" onClick={() => downloadReceipt(g)}>PDF</button>
                        </TableCell>
                      </TableRow>
                      {expanded[g.id] && (
                        <TableRow>
                          <TableCell colSpan={10} className="bg-gray-50 text-xs">
                            <div><b>Reference Number:</b> {g.reference_number || '-'}</div>
                            <div><b>Purpose:</b> {g.purpose || '-'}</div>
                            <div><b>Receipt Number:</b> {g.receipt_number || '-'}</div>
                            <div><b>Recorded By:</b> {g.recorded_by || '-'}</div>
                            <div><b>Currency:</b> {g.currency || '-'}</div>
                            <div><b>Created At:</b> {g.created_at ? new Date(g.created_at).toLocaleString() : '-'}</div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Add support/contact button */}
            <button className="btn btn-sm mt-2" onClick={() => setContactModal(true)}>Need help?</button>
            {contactModal && (
              <div className="modal bg-white p-4 rounded shadow">
                <div>Contact the finance/treasurer team at <a href="mailto:finance@example.com">finance@example.com</a></div>
                <button className="btn btn-xs mt-2" onClick={() => setContactModal(false)}>Close</button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGiving; 