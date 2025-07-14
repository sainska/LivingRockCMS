import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemSettings() {
  const role = useUserRole();
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Placeholder for settings state
  const [settings, setSettings] = React.useState({
    theme: "Light",
    notifications: true,
    dataRetention: "1 year",
    maintenanceMode: false,
  });

  // Placeholder for save logic
  const handleSave = () => {
    alert("Save System Settings (implement save logic)");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">System Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-semibold text-[#F7941D]">Theme:</span> {settings.theme}
          </div>
          <div>
            <span className="font-semibold text-[#F7941D]">Notifications:</span> {settings.notifications ? "Enabled" : "Disabled"}
          </div>
          <div>
            <span className="font-semibold text-[#F7941D]">Data Retention:</span> {settings.dataRetention}
          </div>
          <div>
            <span className="font-semibold text-[#F7941D]">Maintenance Mode:</span> {settings.maintenanceMode ? "On" : "Off"}
          </div>
          <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mt-4" onClick={handleSave}>
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 