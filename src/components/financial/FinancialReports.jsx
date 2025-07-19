import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, FileText } from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const FinancialReports = () => {
  const { donations } = useDonations();
  const { expenses, budgetCategories } = useFinancialData();
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState(new Date(new Date().getFullYear(), 0, 1));
  const [dateTo, setDateTo] = useState(new Date());
  const [reportType, setReportType] = useState('summary');

  // Filter data by date range
  const filterByDateRange = (data, dateField) => {
    return data?.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= dateFrom && itemDate <= dateTo;
    }) || [];
  };

  const filteredDonations = filterByDateRange(donations, 'donation_date');
  const filteredExpenses = filterByDateRange(expenses, 'expense_date');

  // Calculate summary statistics
  const totalDonations = filteredDonations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const netIncome = totalDonations - totalExpenses;

  // Donation breakdown by type
  const donationsByType = filteredDonations.reduce((acc, donation) => {
    const type = donation.donation_type || 'other';
    acc[type] = (acc[type] || 0) + parseFloat(donation.amount || 0);
    return acc;
  }, {});

  // Expenses breakdown by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount || 0);
    return acc;
  }, {});

  // Monthly trends
  const getMonthlyTrends = () => {
    const months = {};
    
    filteredDonations.forEach(donation => {
      const month = new Date(donation.donation_date).toISOString().slice(0, 7);
      if (!months[month]) months[month] = { donations: 0, expenses: 0 };
      months[month].donations += parseFloat(donation.amount || 0);
    });
    
    filteredExpenses.forEach(expense => {
      const month = new Date(expense.expense_date).toISOString().slice(0, 7);
      if (!months[month]) months[month] = { donations: 0, expenses: 0 };
      months[month].expenses += parseFloat(expense.amount || 0);
    });
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
      net: data.donations - data.expenses
    })).sort();
  };

  const monthlyTrends = getMonthlyTrends();

  const handleExportReport = (format) => {
    toast({
      title: "Export Started",
      description: `Exporting ${reportType} report in ${format.toUpperCase()} format...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate comprehensive financial reports for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                  <SelectItem value="budget">Budget vs Actual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportReport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportReport('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredDonations.length} transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredExpenses.length} transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              KES {netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24))} days
            </div>
            <p className="text-xs text-muted-foreground">
              {format(dateFrom, "MMM dd")} - {format(dateTo, "MMM dd")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Content */}
      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Income Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Income Breakdown</CardTitle>
                <CardDescription>Donations by type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(donationsByType).map(([type, amount]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <Badge variant="secondary">KES {amount.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(expensesByCategory).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                    <Badge variant="outline">KES {amount.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Donations</CardTitle>
                <CardDescription>Latest donation transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredDonations.slice(0, 10).map(donation => (
                    <div key={donation.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium">{donation.donor_name || 'Anonymous'}</div>
                        <div className="text-muted-foreground">{donation.donation_type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">KES {parseFloat(donation.amount || 0).toLocaleString()}</div>
                        <div className="text-muted-foreground">
                          {new Date(donation.donation_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Expenses</CardTitle>
                <CardDescription>Latest expense transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredExpenses.slice(0, 10).map(expense => (
                    <div key={expense.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-muted-foreground">{expense.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-red-600">KES {parseFloat(expense.amount || 0).toLocaleString()}</div>
                        <div className="text-muted-foreground">
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Trends</CardTitle>
              <CardDescription>Income and expense trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrends.map(trend => (
                  <div key={trend.month} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="font-medium">
                      {new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-green-600">Income: KES {trend.donations.toLocaleString()}</div>
                      <div className="text-red-600">Expenses: KES {trend.expenses.toLocaleString()}</div>
                      <div className={`font-medium ${trend.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Net: KES {trend.net.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget vs Actual</CardTitle>
              <CardDescription>Compare budgeted amounts with actual expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetCategories?.filter(b => b.is_active).map(budget => {
                  const actualSpent = parseFloat(budget.spent_amount || 0);
                  const budgeted = parseFloat(budget.allocated_amount || 0);
                  const variance = budgeted - actualSpent;
                  const percentage = budgeted > 0 ? (actualSpent / budgeted) * 100 : 0;
                  
                  return (
                    <div key={budget.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{budget.name}</div>
                          <div className="text-sm text-muted-foreground">{budget.description}</div>
                        </div>
                        <Badge variant={variance >= 0 ? 'default' : 'destructive'}>
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Budgeted</div>
                          <div className="font-medium">KES {budgeted.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Actual</div>
                          <div className="font-medium">KES {actualSpent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Variance</div>
                          <div className={`font-medium ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            KES {variance.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;