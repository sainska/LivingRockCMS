import React, { useEffect, useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SystemReports() {
  const role = useUserRole();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const { data, error } = await supabase.from("reports").select("*").order("date", { ascending: false });
      if (error) setError(error.message);
      else setReports(data);
      setLoading(false);
    }
    if (role === "system_admin") fetchReports();
  }, [role]);

  if (role !== "system_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">System Reports</h1>
      {reports.length === 0 ? (
        <div>No reports found.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-[#0071BC]/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{report.title}</div>
                  <div className="text-sm text-gray-500">{report.type} • {new Date(report.date).toLocaleDateString()}</div>
                </div>
                <BarChart3 className="h-6 w-6 text-[#0071BC]" />
                <Button size="sm" onClick={() => window.open(report.url, '_blank')}>View</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 