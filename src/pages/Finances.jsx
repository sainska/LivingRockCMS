
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserRole } from '@/hooks/useUserRole';
import FinancialAnalytics from '@/components/financial/FinancialAnalytics';

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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Donations Management</h2>
            <p className="text-muted-foreground">Donation management features coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Expenses Management</h2>
            <p className="text-muted-foreground">Expense management features coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="budget">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Budget Management</h2>
            <p className="text-muted-foreground">Budget management features coming soon...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Financial Reports</h2>
            <p className="text-muted-foreground">Financial reporting features coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
