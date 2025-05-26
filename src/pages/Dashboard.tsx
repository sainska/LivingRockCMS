
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import DonationChart from "@/components/dashboard/DonationChart";
import RecentDonations from "@/components/dashboard/RecentDonations";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import SystemMetrics from "@/components/dashboard/SystemMetrics";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-xiracom-blue to-xiracom-darkblue text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome to Living Rock Church Management</h1>
        <p className="opacity-90">Manage your congregation, events, and ministry with ease</p>
      </div>

      {/* System Metrics */}
      <SystemMetrics />

      {/* Quick Actions */}
      <QuickActions />

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatsCard />
          <DonationChart />
        </div>
        
        <div className="space-y-6">
          <RecentDonations />
          <UpcomingEvents />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-xiracom-blue">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">New member registered</p>
                <p className="text-sm text-muted-foreground">Sarah Johnson joined the congregation</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Donation received</p>
                <p className="text-sm text-muted-foreground">KSh 15,000 offering from Mark Wilson</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Event scheduled</p>
                <p className="text-sm text-muted-foreground">Youth Conference added for next Saturday</p>
              </div>
              <span className="text-xs text-muted-foreground">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
