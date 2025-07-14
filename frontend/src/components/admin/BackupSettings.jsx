import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function BackupSettings() {
  const role = useUserRole();
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Placeholder for backup status
  const [lastBackup, setLastBackup] = React.useState("2024-06-10 02:00");

  // Placeholder for backup logic
  const handleBackup = () => {
    alert("Backup Now (implement backup logic)");
    setLastBackup(new Date().toLocaleString());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">Backup & Data Integration</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-semibold text-[#F7941D]">Last Backup:</span> {lastBackup}
          </div>
          <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mt-4" onClick={handleBackup}>
            <Database className="h-4 w-4 mr-2" /> Backup Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 