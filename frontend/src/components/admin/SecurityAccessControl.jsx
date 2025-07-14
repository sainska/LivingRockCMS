import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SecurityAccessControl() {
  const role = useUserRole();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const { data, error } = await supabase.from("access_logs").select("*").order("time", { ascending: false });
      if (error) setError(error.message);
      else setLogs(data);
      setLoading(false);
    }
    if (role === "system_admin") fetchLogs();
  }, [role]);

  if (role !== "admin" && role !== "system_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) return <div>Loading access logs...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">Security & Access Logs</h1>
      {logs.length === 0 ? (
        <div>No access logs found.</div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="border-[#0071BC]/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{log.user}</div>
                  <div className="text-sm text-gray-500">{log.action} • {new Date(log.time).toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Status: {log.status}</div>
                </div>
                <Shield className="h-6 w-6 text-[#0071BC]" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 