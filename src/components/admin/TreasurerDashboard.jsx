
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  Target,
  FileText,
  Download,
  Wallet,
  BarChart3
} from "lucide-react";
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics';
import { useDonations } from '@/hooks/useDonations';
import { usePDFExport } from '@/hooks/usePDFExport';
import { format } from 'date-fns';
import { toast } from 'sonner';

const TreasurerDashboard = () => {
  const navigate = useNavigate();
  const { analytics, loading: analyticsLoading } = useFinancialAnalytics();
  const { donations, loading: donationsLoading } = useDonations();
  const { exportFinancialReport, isExporting } = usePDFExport();

  const recentDonations = donations.slice(0, 10);
  const netIncome = analytics.totalDonations - analytics.totalExpenses;
  const monthlyNet = analytics.monthlyDonations - analytics.monthlyExpenses;

  const financialMetrics = [
    {
      title: "Total Donations",
      value: `KES ${analytics.totalDonations.toLocaleString()}`,
      change: `+KES ${analytics.monthlyDonations.toLocaleString()} this month`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Total Expenses",
      value: `KES ${analytics.totalExpenses.toLocaleString()}`,
      change: `KES ${analytics.monthlyExpenses.toLocaleString()} this month`,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: "up"
    },
    {
      title: "Net Income",
      value: `KES ${netIncome.toLocaleString()}`,
      change: `KES ${monthlyNet.toLocaleString()} this month`,
      icon: netIncome >= 0 ? TrendingUp : TrendingDown,
      color: netIncome >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netIncome >= 0 ? "bg-green-50" : "bg-red-50",
      trend: netIncome >= 0 ? "up" : "down"
    },
    {
      title: "Active Campaigns",
      value: analytics.activeCampaigns,
      change: `KES ${analytics.totalPledges.toLocaleString()} pledged`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "neutral"
    }
  ];

  const handleExportReport = async () => {
    try {
      await exportFinancialReport(analytics);
      toast.success('Financial report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (analyticsLoading || donationsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Financial Management Portal</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/finances')}>
            <DollarSign className="h-4 w-4 mr-2" />
            Record Transaction
          </Button>
          <Button variant="outline" onClick={handleExportReport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Budget Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.budgetCategories.length > 0 ? (
                analytics.budgetCategories.map((category) => {
                  const percentage = category.allocated_amount > 0 
                    ? (category.spent_amount / category.allocated_amount) * 100 
                    : 0;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            KES {Number(category.spent_amount).toLocaleString()} / 
                            KES {Number(category.allocated_amount).toLocaleString()}
                          </span>
                          <Badge variant={percentage > 90 ? "destructive" : percentage > 70 ? "default" : "secondary"}>
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No budget categories configured
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {donation.is_anonymous ? 'Anonymous' : 
                         donation.profiles ? `${donation.profiles.first_name} ${donation.profiles.last_name}` : 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {donation.donation_type} • {donation.purpose || 'General'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        KES {Number(donation.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(donation.donation_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No donations recorded yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-green-600">Total Income</h3>
              <p className="text-2xl font-bold">KES {analytics.totalDonations.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">All time</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-red-600">Total Expenses</h3>
              <p className="text-2xl font-bold">KES {analytics.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">All time</p>
            </div>
            <div className={`text-center p-4 border rounded-lg ${netIncome >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className={`text-lg font-semibold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Net Balance
              </h3>
              <p className="text-2xl font-bold">KES {netIncome.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Current balance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Financial Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Financial Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/finances')}
            >
              <DollarSign className="h-5 w-5" />
              Record Donation
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/expenses')}
            >
              <CreditCard className="h-5 w-5" />
              Record Expense
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/budget')}
            >
              <PieChart className="h-5 w-5" />
              Manage Budget
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={handleExportReport}
              disabled={isExporting}
            >
              <FileText className="h-5 w-5" />
              {isExporting ? 'Exporting...' : 'Generate Report'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerDashboard;
