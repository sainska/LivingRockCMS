import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const validRoles = ["admin", "clergy", "treasurer", "secretary", "member"];

export default function UserManagement() {
  const role = useUserRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "member" });
  const [editingId, setEditingId] = useState(null);
  const [roleChangeLoading, setRoleChangeLoading] = useState(null);
  const [roleChangeMsg, setRoleChangeMsg] = useState("");

  useEffect(() => {
    if (role === "admin") fetchUsers();
    // eslint-disable-next-line
  }, [role]);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, user_roles(role, id)");
    if (error) setError(error.message);
    else setUsers(data.map(u => ({
      id: u.id,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      role: u.user_roles?.[0]?.role || "member",
      userRoleId: u.user_roles?.[0]?.id || null
    })));
    setLoading(false);
  }

  async function handleRoleChange(userId, userRoleId, newRole) {
    setRoleChangeLoading(userId);
    setRoleChangeMsg("");
    if (!validRoles.includes(newRole)) {
      setRoleChangeMsg("Invalid role selected.");
      setRoleChangeLoading(null);
      return;
    }
    try {
      if (userRoleId) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("id", userRoleId);
        if (error) setRoleChangeMsg(error.message);
        else setRoleChangeMsg("Role updated successfully.");
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert([{ user_id: userId, role: newRole, is_active: true }]);
        if (error) setRoleChangeMsg(error.message);
        else setRoleChangeMsg("Role assigned successfully.");
      }
      fetchUsers();
    } catch (e) {
      setRoleChangeMsg(e.message);
    }
    setRoleChangeLoading(null);
  }

  async function handleAddOrEditUser(e) {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.role) return setError("All fields required");
    const [first_name, ...lastArr] = form.name.split(" ");
    const last_name = lastArr.join(" ");
    if (editingId) {
      // Update user
      const { error } = await supabase
        .from("users")
        .update({ first_name, last_name, email: form.email })
        .eq("id", editingId);
      if (!error) setShowModal(false);
      else setError(error.message);
    } else {
      // Insert user
      const { error } = await supabase
        .from("users")
        .insert([{ first_name, last_name, email: form.email }]);
      if (!error) setShowModal(false);
      else setError(error.message);
    }
    setForm({ name: "", email: "", role: "member" });
    setEditingId(null);
    fetchUsers();
  }

  function handleEdit(user) {
    setForm({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
    setShowModal(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) setError(error.message);
    fetchUsers();
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
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">User Management</h1>
      <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mb-4" onClick={() => { setShowModal(true); setEditingId(null); setForm({ name: "", email: "", role: "member" }); }}>
        <Users className="h-4 w-4 mr-2" /> Add User
      </Button>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {roleChangeMsg && <div className="text-green-600 mb-2">{roleChangeMsg}</div>}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#0071BC] border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-[#F7941D]/10">
                    <td className="py-2 font-medium">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2 text-[#F7941D]">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, user.userRoleId, e.target.value)}
                        disabled={roleChangeLoading === user.id}
                        className="border rounded px-2 py-1 bg-white"
                      >
                        {validRoles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="py-2">
                      <Button size="sm" className="mr-2 bg-[#0071BC] text-white" onClick={() => handleEdit(user)}>Edit</Button>
                      <Button size="sm" variant="outline" className="border-[#F7941D] text-[#F7941D]" onClick={() => handleDelete(user.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#0071BC]">{editingId ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleAddOrEditUser} className="space-y-4">
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Full Name</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-[#0071BC] font-medium mb-1">Role</label>
                <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required>
                  {validRoles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
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