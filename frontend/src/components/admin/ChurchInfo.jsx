import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useChurchInfo } from "@/hooks/useChurchInfo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ChurchInfo() {
  const role = useUserRole();
  const { churchInfo, loading, error, updateChurchInfo } = useChurchInfo();
  const [editMode, setEditMode] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (churchInfo) {
      setForm({
        name: churchInfo.name || "",
        address: churchInfo.address || "",
        phone: churchInfo.phone || "",
        email: churchInfo.email || "",
        website: churchInfo.website || ""
      });
    }
  }, [churchInfo]);

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) return <div>Loading church info...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    try {
      await updateChurchInfo(form);
      setSuccess(true);
      setEditMode(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">Church Information</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="font-semibold text-[#F7941D] block mb-1">Name:</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="font-semibold text-[#F7941D] block mb-1">Address:</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="font-semibold text-[#F7941D] block mb-1">Phone:</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="font-semibold text-[#F7941D] block mb-1">Email:</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="font-semibold text-[#F7941D] block mb-1">Website:</label>
                <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              {saveError && <div className="text-red-600">{saveError}</div>}
              {success && <div className="text-green-600">Saved successfully!</div>}
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#0071BC] text-white" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <span className="font-semibold text-[#F7941D]">Name:</span> {form.name}
              </div>
              <div>
                <span className="font-semibold text-[#F7941D]">Address:</span> {form.address}
              </div>
              <div>
                <span className="font-semibold text-[#F7941D]">Phone:</span> {form.phone}
              </div>
              <div>
                <span className="font-semibold text-[#F7941D]">Email:</span> {form.email}
              </div>
              <div>
                <span className="font-semibold text-[#F7941D]">Website:</span> <a href={form.website} className="text-[#0071BC] underline">{form.website}</a>
              </div>
              <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mt-4" onClick={() => setEditMode(true)}>
                Edit Church Info
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 