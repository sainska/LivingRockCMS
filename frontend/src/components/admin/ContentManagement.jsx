import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ContentManagement() {
  const role = useUserRole();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Announcement", date: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (role === "admin") fetchContents();
    // eslint-disable-next-line
  }, [role]);

  async function fetchContents() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("content")
      .select("id, title, type, date");
    if (error) setError(error.message);
    else setContents(data);
    setLoading(false);
  }

  async function handleAddOrEditContent(e) {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.type || !form.date) return setError("All fields required");
    if (editingId) {
      const { error } = await supabase
        .from("content")
        .update({ title: form.title, type: form.type, date: form.date })
        .eq("id", editingId);
      if (!error) setShowModal(false);
      else setError(error.message);
    } else {
      const { error } = await supabase
        .from("content")
        .insert([{ title: form.title, type: form.type, date: form.date }]);
      if (!error) setShowModal(false);
      else setError(error.message);
    }
    setForm({ title: "", type: "Announcement", date: "" });
    setEditingId(null);
    fetchContents();
  }

  function handleEdit(content) {
    setForm({ title: content.title, type: content.type, date: content.date });
    setEditingId(content.id);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this content?")) return;
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) setError(error.message);
    fetchContents();
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
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">Content Management</h1>
      <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mb-4" onClick={() => { setShowModal(true); setEditingId(null); setForm({ title: "", type: "Announcement", date: "" }); }}>
        <FileText className="h-4 w-4 mr-2" /> Add Content
      </Button>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div>Loading content...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#0071BC] border-b">
                  <th className="py-2">Title</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.map((content) => (
                  <tr key={content.id} className="border-b hover:bg-[#F7941D]/10">
                    <td className="py-2 font-medium">{content.title}</td>
                    <td className="py-2">{content.type}</td>
                    <td className="py-2">{content.date}</td>
                    <td className="py-2">
                      <Button size="sm" className="mr-2 bg-[#0071BC] text-white" onClick={() => handleEdit(content)}>Edit</Button>
                      <Button size="sm" variant="outline" className="border-[#F7941D] text-[#F7941D]" onClick={() => handleDelete(content.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal for Add/Edit Content */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#0071BC]">{editingId ? "Edit Content" : "Add Content"}</h2>
            <form onSubmit={handleAddOrEditContent} className="space-y-4">
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Title</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Type</label>
                <select className="w-full border rounded px-3 py-2" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                  <option value="Announcement">Announcement</option>
                  <option value="Bulletin">Bulletin</option>
                  <option value="Media">Media</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Date</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" className="border-[#F7941D] text-[#F7941D]" onClick={() => { setShowModal(false); setEditingId(null); }}>Cancel</Button>
                <Button type="submit" className="bg-[#0071BC] text-white">{editingId ? "Update" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 