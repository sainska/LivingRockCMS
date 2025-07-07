
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Receipt,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useDonations } from '@/hooks/useDonations';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';

const TreasurerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { donations, campaigns, loading: donationsLoading } = useDonations();
  const { transactions, budgetCategories, loading: financialLoading } = useFinancialData();

  const loading = donationsLoading || financialLoading;

  // Calculate financial metrics from real data
  const calculateMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyDonations = donations.filter(donation => {
      const donationDate = new Date(donation.created_at);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    });

    const monthlyIncome = monthlyDonations.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0);
    
    const monthlyExpenses = transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.transaction_type === 'expense';
      })
      .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);

    const netBalance = monthlyIncome - monthlyExpenses;
    
    const pendingDonations = donations.filter(donation => 
      donation.receipt_issued === false
    );

    return {
      monthlyIncome,
      monthlyExpenses,
      netBalance,
      pendingDonations: pendingDonations.length
    };
  };

  const metrics = calculateMetrics();

  const handleQuickAction = (action) => {
    switch (action) {
      case 'record-donation':
        toast({
          title: "Record Donation",
          description: "Opening donation recording form...",
        });
        break;
      case 'generate-receipt':
        toast({
          title: "Generate Receipt",
          description: "Opening receipt generator...",
        });
        break;
      case 'financial-report':
        handleGenerateReport();
        break;
      case 'pending-approvals':
        toast({
          title: "Pending Approvals",
          description: "Opening pending approvals...",
        });
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Financial Report",
      description: "Generating comprehensive financial report...",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Exporting financial data...",
    });
  };

  const getStatusColor = (status) => {
    return status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Treasurer Portal</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport}>
            <Receipt className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income (This Month)</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyIncome)}</p>
                <p className="text-xs text-muted-foreground">+18.2%</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses (This Month)</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.monthlyExpenses)}</p>
                <p className="text-xs text-muted-foreground">+12.5%</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.netBalance)}</p>
                <p className="text-xs text-muted-foreground">+45.8%</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Receipts</p>
                <p className="text-2xl font-bold">{metrics.pendingDonations}</p>
                <p className="text-xs text-muted-foreground">Items pending</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Receipt className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString()} • {transaction.transaction_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                    <Badge className={getStatusColor(transaction.approval_status)}>
                      {transaction.approval_status}
                    </Badge>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No transactions found</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category) => {
                const percentage = Math.round((category.spent_amount / category.allocated_amount) * 100);
                return (
                  <div key={category.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{category.name}</span>
                      <span>{formatCurrency(category.spent_amount)} / {formatCurrency(category.allocated_amount)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage}% of budget used
                    </p>
                  </div>
                );
              })}
              {budgetCategories.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No budget categories found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Financial Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Financial Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('record-donation')}
            >
              <Banknote className="h-5 w-5" />
              Record Donation
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('generate-receipt')}
            >
              <Receipt className="h-5 w-5" />
              Generate Receipt
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('financial-report')}
            >
              <BarChart3 className="h-5 w-5" />
              Financial Report
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => handleQuickAction('pending-approvals')}
            >
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              const percentage = Math.round((campaign.current_amount / campaign.target_amount) * 100);
              return (
                <Card key={campaign.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>{formatCurrency(campaign.current_amount)}</span>
                        <span>{formatCurrency(campaign.target_amount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {campaigns.length === 0 && (
              <p className="text-center text-muted-foreground py-4 col-span-3">No active campaigns found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerDashboard;
