
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, CreditCard, Calendar, Target } from "lucide-react";

const GivingDonationsModule = () => {
  const givingHistory = [
    { id: 1, type: "Tithe", amount: 500, date: "2025-01-01", method: "Mobile Money" },
    { id: 2, type: "Offering", amount: 100, date: "2024-12-25", method: "Bank Transfer" },
    { id: 3, type: "Building Fund", amount: 1000, date: "2024-12-15", method: "Credit Card" }
  ];

  const pledges = [
    { id: 1, campaign: "Building Fund 2025", pledged: 12000, paid: 5000, deadline: "2025-12-31" },
    { id: 2, campaign: "Youth Ministry", pledged: 2400, paid: 2400, deadline: "2024-12-31" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Giving & Donations</h2>
        <Button className="bg-xiracom-orange hover:bg-xiracom-lightorange">
          <DollarSign className="h-4 w-4 mr-2" />
          Make Donation
        </Button>
      </div>

      {/* Giving Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Year</p>
                <p className="text-2xl font-bold">$6,500</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Month</p>
                <p className="text-2xl font-bold">$600</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Pledges</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Target className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Give Options */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Give</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Tithe
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Offering
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Building Fund
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Missions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Giving History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Giving History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Statement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {givingHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${transaction.amount}</p>
                  <p className="text-sm text-muted-foreground">{transaction.method}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pledges & Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>My Pledges & Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pledges.map((pledge) => (
              <div key={pledge.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{pledge.campaign}</h4>
                  <Badge variant={pledge.paid >= pledge.pledged ? "default" : "secondary"}>
                    {pledge.paid >= pledge.pledged ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: ${pledge.paid} / ${pledge.pledged}</span>
                    <span>{Math.round((pledge.paid / pledge.pledged) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-xiracom-blue h-2 rounded-full" 
                      style={{ width: `${(pledge.paid / pledge.pledged) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Deadline: {pledge.deadline}</p>
                </div>
                {pledge.paid < pledge.pledged && (
                  <Button size="sm" className="mt-3 bg-xiracom-orange hover:bg-xiracom-lightorange">
                    Make Payment
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recurring Giving */}
      <Card>
        <CardHeader>
          <CardTitle>Set Up Recurring Giving</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Automate your giving with recurring donations</p>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              Set Up Recurring Giving
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GivingDonationsModule;
