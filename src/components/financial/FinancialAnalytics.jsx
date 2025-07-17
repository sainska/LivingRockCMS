
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Download,
  Target,
  CreditCard,
  Wallet
} from 'lucide-react';
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics';
import { usePDFExport } from '@/hooks/usePDFExport';
import { toast } from 'sonner';

const FinancialAnalytics = () => {
  const { analytics, loading, error } = useFinancialAnalytics();
  const { exportFinancialReport, isExporting } = usePDFExport();

  const handleExportPDF = async () => {
    try {
      await exportFinancialReport(analytics);
      toast.success('Financial report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading financial analytics: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const netIncome = analytics.totalDonations - analytics.totalExpenses;
  const monthlyNet = analytics.monthlyDonations - analytics.monthlyExpenses;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Analytics</h1>
          <p className="text-muted-foreground">Real-time financial insights and reports</p>
        </div>
        <Button onClick={handleExportPDF} disabled={isExporting}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              KSH {analytics.totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month: KSH {analytics.monthlyDonations.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              KSH {analytics.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month: KSH {analytics.monthlyExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            {netIncome >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              KSH {netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly: KSH {monthlyNet.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pledges</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              KSH {analytics.totalPledges.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeCampaigns} active campaigns
            </p>
          </CardContent>
        </Card>
      </div>

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
            {analytics.budgetCategories.map((category) => {
              const percentage = category.allocated_amount > 0 
                ? (category.spent_amount / category.allocated_amount) * 100 
                : 0;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        KSH {Number(category.spent_amount).toLocaleString()} / 
                        KSH {Number(category.allocated_amount).toLocaleString()}
                      </span>
                      <Badge variant={percentage > 90 ? "destructive" : percentage > 70 ? "default" : "secondary"}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                </div>
              );
            })}
            
            {analytics.budgetCategories.length === 0 && (
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
          <div className="space-y-3">
            {analytics.donationTrends.slice(0, 10).map((donation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{donation.donation_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    KSH {Number(donation.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {analytics.donationTrends.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No donations recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAnalytics;
