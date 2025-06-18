
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

const TreasurerDashboard = () => {
  const financialMetrics = [
    {
      title: "Total Income (This Month)",
      value: "KSh 2,450,000",
      change: "+18.2%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Expenses (This Month)",
      value: "KSh 1,850,000",
      change: "+12.5%",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Net Balance",
      value: "KSh 600,000",
      change: "+45.8%",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Donations",
      value: "KSh 125,000",
      change: "5 pending",
      icon: Receipt,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "Tithe",
      amount: "KSh 45,000",
      date: "2024-06-09",
      status: "Completed",
      method: "Bank Transfer"
    },
    {
      id: 2,
      type: "Offering",
      amount: "KSh 23,500",
      date: "2024-06-09",
      status: "Completed",
      method: "Cash"
    },
    {
      id: 3,
      type: "Building Fund",
      amount: "KSh 150,000",
      date: "2024-06-08",
      status: "Pending",
      method: "Mobile Money"
    },
    {
      id: 4,
      type: "Ministry Support",
      amount: "KSh 35,000",
      date: "2024-06-08",
      status: "Completed",
      method: "Bank Transfer"
    }
  ];

  const budgetCategories = [
    { name: "Ministry Operations", budget: 800000, spent: 650000, percentage: 81 },
    { name: "Building Maintenance", budget: 500000, spent: 320000, percentage: 64 },
    { name: "Outreach Programs", budget: 300000, spent: 180000, percentage: 60 },
    { name: "Staff Salaries", budget: 600000, spent: 600000, percentage: 100 }
  ];

  const getStatusColor = (status: string) => {
    return status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Living Rock Church - Treasurer Portal</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Receipt className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Data
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
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date} • {transaction.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{transaction.amount}</p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
              {budgetCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">
                      KSh {category.spent.toLocaleString()} / KSh {category.budget.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{category.percentage}% used</span>
                    <span>KSh {(category.budget - category.spent).toLocaleString()} remaining</span>
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
          <CardTitle>Quick Financial Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2">
              <Banknote className="h-5 w-5" />
              Record Donation
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Receipt className="h-5 w-5" />
              Generate Receipt
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              Financial Report
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerDashboard;
