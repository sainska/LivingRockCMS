import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  BarChart3,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity
} from 'lucide-react';
import { useFinancialDashboard } from '@/hooks/useFinancialDashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FinancialDashboard = () => {
  const { financialData, loading, error } = useFinancialDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading financial data: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { 
    accounts, 
    transactions, 
    summary, 
    recentTransactions, 
    accountBalances, 
    monthlyTrends, 
    topDonors, 
    expenseCategories 
  } = financialData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-green-100">
          Complete overview of church finances, donations, and expenses.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              KES {Number(summary.totalIncome).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              KES {Number(summary.monthlyIncome).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              KES {Number(summary.totalExpenses).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              KES {Number(summary.monthlyExpenses).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              KES {Number(summary.netAmount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              KES {Number(summary.monthlyNet).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.transactionCount}</div>
            <p className="text-xs text-muted-foreground">
              Total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Balances */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Account Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accountBalances.length > 0 ? (
              accountBalances.map((account) => (
                <div key={account.accountId} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{account.accountName}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {account.accountType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        KES {Number(account.balance).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {account.transactionCount} transactions
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No accounts found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 8).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.transaction_type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.transaction_type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description || transaction.financial_accounts?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.profiles ? 
                          `${transaction.profiles.first_name} ${transaction.profiles.last_name}` : 
                          'Anonymous'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${
                      transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'income' ? '+' : '-'} 
                      KES {Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent transactions</p>
            )}
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Donors (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topDonors.length > 0 ? (
              topDonors.map((donor, index) => (
                <div key={donor.userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{donor.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {donor.donationCount} donation{donor.donationCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      KES {Number(donor.totalAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No donor data available</p>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenseCategories.length > 0 ? (
              expenseCategories.map((category) => (
                <div key={category.category} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium capitalize">{category.category}</p>
                    <p className="font-bold text-red-600">
                      KES {Number(category.amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.count} transactions</span>
                    <span>{((category.amount / summary.totalExpenses) * 100).toFixed(1)}% of total</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No expense data available</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trends (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium">{trend.month}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="font-bold text-green-600">
                          KES {Number(trend.income).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-bold text-red-600">
                          KES {Number(trend.expenses).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Net</p>
                        <p className={`font-bold ${trend.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          KES {Number(trend.net).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/financial/transactions')}
            >
              <BarChart3 className="h-6 w-6" />
              <span>View All Transactions</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/financial/accounts')}
            >
              <Wallet className="h-6 w-6" />
              <span>Manage Accounts</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/financial/reports')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Generate Reports</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => navigate('/financial/settings')}
            >
              <Activity className="h-6 w-6" />
              <span>Financial Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard; 