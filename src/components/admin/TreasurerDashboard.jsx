
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Treasurer Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default TreasurerDashboard;
