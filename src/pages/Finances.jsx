
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import FinancialAnalytics from '@/components/financial/FinancialAnalytics';
import DonationsManagement from '@/components/financial/DonationsManagement';
import ExpensesManagement from '@/components/financial/ExpensesManagement';
import BudgetManagement from '@/components/financial/BudgetManagement';
import FinancialReports from '@/components/financial/FinancialReports';

const Finances = () => {
  const { role } = useUserRole();

  // Only treasurers and system admins can access finances
  if (role !== 'treasurer' && role !== 'system_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access financial data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <FinancialAnalytics />
        </TabsContent>
        
        <TabsContent value="donations">
          <DonationsManagement />
        </TabsContent>
        
        <TabsContent value="expenses">
          <ExpensesManagement />
        </TabsContent>
        
        <TabsContent value="budget">
          <BudgetManagement />
        </TabsContent>
        
        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
