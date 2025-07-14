import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SystemEvents() {
  const role = useUserRole();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "", user: "", time: "" });

  useEffect(() => {
    if (role === "admin") fetchEvents();
    // eslint-disable-next-line
  }, [role]);

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("system_events")
      .select("id, type, user, time")
      .order("time", { ascending: false });
    if (error) setError(error.message);
    else setEvents(data);
    setLoading(false);
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    setError(null);
    if (!form.type || !form.user || !form.time) return setError("All fields required");
    const { error } = await supabase
      .from("system_events")
      .insert([{ type: form.type, user: form.user, time: form.time }]);
    if (!error) setShowModal(false);
    else setError(error.message);
    setForm({ type: "", user: "", time: "" });
    fetchEvents();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    const { error } = await supabase.from("system_events").delete().eq("id", id);
    if (error) setError(error.message);
    fetchEvents();
  }

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">System Events</h1>
      <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mb-4" onClick={() => { setShowModal(true); setForm({ type: "", user: "", time: "" }); }}>
        <ClipboardList className="h-4 w-4 mr-2" /> Add Event
      </Button>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div>Loading events...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#0071BC] border-b">
                  <th className="py-2">Event</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-[#F7941D]/10">
                    <td className="py-2 font-medium">{event.type}</td>
                    <td className="py-2">{event.user}</td>
                    <td className="py-2">{event.time}</td>
                    <td className="py-2">
                      <Button size="sm" variant="outline" className="border-[#F7941D] text-[#F7941D]" onClick={() => handleDelete(event.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal for Add Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#0071BC]">Add Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Event Type</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">User</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.user} onChange={e => setForm(f => ({ ...f, user: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Time</label>
                <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
              </div>
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