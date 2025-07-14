import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function SystemCommunications() {
  const role = useUserRole();
  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-[#F7941D]">Access Denied</h2>
        <p className="text-[#0071BC]">You do not have permission to view this page.</p>
      </div>
    );
  }

  // Placeholder for communications list
  const communications = [
    { id: 1, title: "Service Reminder", type: "Email", date: "2024-06-10" },
    { id: 2, title: "Urgent Notice", type: "SMS", date: "2024-06-09" },
    { id: 3, title: "Newsletter", type: "Email", date: "2024-06-08" },
  ];

  // Placeholder for send logic
  const handleSend = () => {
    alert("Send Communication (implement send logic)");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0071BC] mb-6">System Communications</h1>
      <Button className="bg-[#0071BC] hover:bg-[#F7941D] text-white mb-4" onClick={handleSend}>
        <Bell className="h-4 w-4 mr-2" /> Send Communication
      </Button>
      <Card>
        <CardContent className="p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#0071BC] border-b">
                <th className="py-2">Title</th>
                <th className="py-2">Type</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((comm) => (
                <tr key={comm.id} className="border-b hover:bg-[#F7941D]/10">
                  <td className="py-2 font-medium">{comm.title}</td>
                  <td className="py-2">{comm.type}</td>
                  <td className="py-2">{comm.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
} 