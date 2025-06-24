import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, DollarSign, TrendingUp, Wallet } from "lucide-react";

const FinancialReport = ({ period }) => {
  const financialSummary = [
    { category: "Tithes", amount: 650000, percentage: 76.5, change: "+12.3%" },
    { category: "Offerings", amount: 120000, percentage: 14.1, change: "+8.7%" },
    { category: "Special Gifts", amount: 45000, percentage: 5.3, change: "+15.2%" },
    { category: "Other", amount: 35000, percentage: 4.1, change: "-2.1%" }
  ];

  const expenses = [
    { category: "Staff Salaries", amount: 350000, percentage: 45.2 },
    { category: "Building Maintenance", amount: 125000, percentage: 16.1 },
    { category: "Utilities", amount: 85000, percentage: 11.0 },
    { category: "Ministry Programs", amount: 95000, percentage: 12.3 },
    { category: "Equipment", amount: 65000, percentage: 8.4 },
    { category: "Other", amount: 55000, percentage: 7.1 }
  ];

  const monthlyData = [
    { month: "January", income: 780000, expenses: 720000, net: 60000 },
    { month: "February", income: 820000, expenses: 750000, net: 70000 },
    { month: "March", income: 790000, expenses: 740000, net: 50000 },
    { month: "April", income: 850000, expenses: 775000, net: 75000 },
    { month: "May", income: 870000, expenses: 780000, net: 90000 },
    { month: "June", income: 850000, expenses: 775000, net: 75000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Report - {period}</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold">KSh 850,000</p>
                <p className="text-sm text-green-600">+12.3% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">KSh 775,000</p>
                <p className="text-sm text-red-600">+8.5% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold">KSh 75,000</p>
                <p className="text-sm text-green-600">+25.4% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount (KSh)</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialSummary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{item.amount.toLocaleString()}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                  <TableCell className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {item.change}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount (KSh)</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{expense.category}</TableCell>
                  <TableCell>{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{expense.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Financial Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Income (KSh)</TableHead>
                <TableHead>Expenses (KSh)</TableHead>
                <TableHead>Net (KSh)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((month, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{month.month}</TableCell>
                  <TableCell className="text-green-600">{month.income.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">{month.expenses.toLocaleString()}</TableCell>
                  <TableCell className={month.net > 0 ? 'text-green-600' : 'text-red-600'}>
                    {month.net.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
