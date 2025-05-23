
import { DollarSign, Users, Calendar, BookOpen } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DonationChart from "@/components/dashboard/DonationChart";
import RecentDonations from "@/components/dashboard/RecentDonations";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Treasurer Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Giving"
          value="$24,780"
          icon={<DollarSign className="h-6 w-6 text-xiracom-blue" />}
          change="12.5%"
          isPositive={true}
        />
        <StatsCard
          title="Members"
          value="342"
          icon={<Users className="h-6 w-6 text-xiracom-orange" />}
          change="5.2%"
          isPositive={true}
        />
        <StatsCard
          title="Upcoming Events"
          value="12"
          icon={<Calendar className="h-6 w-6 text-xiracom-blue" />}
          change="3"
          isPositive={true}
        />
        <StatsCard
          title="Ministry Programs"
          value="8"
          icon={<BookOpen className="h-6 w-6 text-xiracom-orange" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DonationChart />
        <UpcomingEvents />
      </div>
      
      <RecentDonations />
    </div>
  );
};

export default Dashboard;
