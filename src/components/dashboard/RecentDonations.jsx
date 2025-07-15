
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus } from "lucide-react";
import { useChurchData } from "@/hooks/useChurchData";
import { useNavigate } from "react-router-dom";

const RecentDonations = () => {
  const { stats, loading, error } = useChurchData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading donations: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Recent Donations</CardTitle>
        <Button 
          size="sm" 
          onClick={() => navigate('/finances')}
          className="bg-xiracom-blue hover:bg-xiracom-darkblue"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Donation
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.recentDonations.length > 0 ? (
            stats.recentDonations.slice(0, 5).map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">KSh {parseFloat(donation.amount).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {donation.purpose || 'General Donation'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No donations recorded yet</p>
              <Button 
                className="mt-4 bg-xiracom-blue hover:bg-xiracom-darkblue"
                onClick={() => navigate('/finances')}
              >
                Record First Donation
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDonations;
