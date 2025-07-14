import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, DollarSign, TrendingUp, TrendingDown, PieChart, Receipt, CreditCard, Banknote, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function TreasurerDashboard() {
  const role = useUserRole();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tithes, setTithes] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    if (role === "treasurer") fetchAll();
    // eslint-disable-next-line
  }, [role]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const { data: tithesData } = await supabase.from("tithes").select("id, donor, amount, date, method");
      setTithes(tithesData || []);
      const { data: pledgesData } = await supabase.from("pledges").select("id, campaign, goal, pledged, fulfilled");
      setPledges(pledgesData || []);
      const { data: expensesData } = await supabase.from("expenses").select("id, category, amount, date, notes");
      setExpenses(expensesData || []);
      const { data: budgetData } = await supabase.from("budget").select("id, category, planned, spent");
      setBudget(budgetData || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function openModal(type, initial = {}) {
    setModalType(type);
    setForm(initial);
    setShowModal(true);
  }

  async function handleAddOrEdit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (modalType === "tithe") {
        await supabase.from("tithes").insert([{ ...form }]);
      } else if (modalType === "pledge") {
        await supabase.from("pledges").insert([{ ...form }]);
      } else if (modalType === "expense") {
        await supabase.from("expenses").insert([{ ...form }]);
      } else if (modalType === "budget") {
        await supabase.from("budget").insert([{ ...form }]);
      }
      setShowModal(false);
      fetchAll();
    } catch (e) {
      setError(e.message);
    }
  }

  if (role !== "treasurer") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#F7941D]">Treasurer Dashboard</h1>
          <p className="text-[#0071BC]">Living Rock Church - Financial Management</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white" onClick={() => openModal("tithe")}>Add Tithe/Offering</Button>
          <Button className="bg-[#F7941D] hover:bg-[#0071BC] text-white" onClick={() => openModal("pledge")}>Add Pledge</Button>
          <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white" onClick={() => openModal("expense")}>Add Expense</Button>
          <Button className="bg-[#F7941D] hover:bg-[#0071BC] text-white" onClick={() => openModal("budget")}>Add Budget</Button>
        </div>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <>
          {/* Tithes/Offerings Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#0071BC] mb-2">Tithes & Offerings</h2>
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="text-[#0071BC] border-b">
                    <th className="py-2">Donor</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {tithes.map(t => (
                    <tr key={t.id} className="border-b hover:bg-[#F7941D]/10">
                      <td className="py-2 font-medium">{t.donor}</td>
                      <td className="py-2">{t.amount}</td>
                      <td className="py-2">{t.date}</td>
                      <td className="py-2">{t.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* Pledges & Campaigns Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#0071BC] mb-2">Pledges & Campaigns</h2>
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="text-[#0071BC] border-b">
                    <th className="py-2">Campaign</th>
                    <th className="py-2">Goal</th>
                    <th className="py-2">Pledged</th>
                    <th className="py-2">Fulfilled</th>
                  </tr>
                </thead>
                <tbody>
                  {pledges.map(p => (
                    <tr key={p.id} className="border-b hover:bg-[#F7941D]/10">
                      <td className="py-2 font-medium">{p.campaign}</td>
                      <td className="py-2">{p.goal}</td>
                      <td className="py-2">{p.pledged}</td>
                      <td className="py-2">{p.fulfilled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* Expenses Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#0071BC] mb-2">Expenses</h2>
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="text-[#0071BC] border-b">
                    <th className="py-2">Category</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} className="border-b hover:bg-[#F7941D]/10">
                      <td className="py-2 font-medium">{e.category}</td>
                      <td className="py-2">{e.amount}</td>
                      <td className="py-2">{e.date}</td>
                      <td className="py-2">{e.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* Budget Table */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#0071BC] mb-2">Budget Planning</h2>
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="text-[#0071BC] border-b">
                    <th className="py-2">Category</th>
                    <th className="py-2">Planned</th>
                    <th className="py-2">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map(b => (
                    <tr key={b.id} className="border-b hover:bg-[#F7941D]/10">
                      <td className="py-2 font-medium">{b.category}</td>
                      <td className="py-2">{b.planned}</td>
                      <td className="py-2">{b.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* Financial Reports Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#F7941D] mb-2">Financial Reports</h2>
              <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mb-2" onClick={() => alert("Export to CSV/PDF coming soon!")}>Export (CSV, PDF)</Button>
              <div className="text-[#0071BC]">Trends, demographic breakdown, and analytics coming soon!</div>
            </CardContent>
          </Card>
          {/* Integrations Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-[#F7941D] mb-2">Integrations</h2>
              <div className="flex gap-4">
                <Button className="bg-[#0071BC] text-white" onClick={() => alert("Stripe integration coming soon!")}>Connect Stripe</Button>
                <Button className="bg-[#F7941D] text-white" onClick={() => alert("PayPal integration coming soon!")}>Connect PayPal</Button>
                <Button className="bg-[#0071BC] text-white" onClick={() => alert("QuickBooks integration coming soon!")}>Connect QuickBooks</Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#0071BC]">Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
            <form onSubmit={handleAddOrEdit} className="space-y-4">
              {modalType === "tithe" && (
                <>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Donor</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.donor || ""} onChange={e => setForm(f => ({ ...f, donor: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Amount</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Date</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Method</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.method || ""} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} required />
                  </div>
                </>
              )}
              {modalType === "pledge" && (
                <>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Campaign</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.campaign || ""} onChange={e => setForm(f => ({ ...f, campaign: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Goal</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.goal || ""} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Pledged</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.pledged || ""} onChange={e => setForm(f => ({ ...f, pledged: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Fulfilled</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.fulfilled || ""} onChange={e => setForm(f => ({ ...f, fulfilled: e.target.value }))} required />
                  </div>
                </>
              )}
              {modalType === "expense" && (
                <>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Category</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.category || ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Amount</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.amount || ""} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Date</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Notes</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </>
              )}
              {modalType === "budget" && (
                <>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Category</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.category || ""} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Planned</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.planned || ""} onChange={e => setForm(f => ({ ...f, planned: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-[#0071BC] font-medium mb-1">Spent</label>
                    <input type="number" className="w-full border rounded px-3 py-2" value={form.spent || ""} onChange={e => setForm(f => ({ ...f, spent: e.target.value }))} required />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="border-[#F7941D] text-[#F7941D]" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#0071BC] text-white">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
