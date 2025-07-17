
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFinancialAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    monthlyDonations: 0,
    totalExpenses: 0,
    monthlyExpenses: 0,
    totalPledges: 0,
    activeCampaigns: 0,
    budgetCategories: [],
    donationTrends: [],
    expenseBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch donations analytics
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, donation_date, donation_type');

      // Fetch expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, expense_date, category');

      // Fetch pledges
      const { data: pledges } = await supabase
        .from('pledges')
        .select('amount, status');

      // Fetch campaigns
      const { data: campaigns } = await supabase
        .from('donation_campaigns')
        .select('*')
        .eq('is_active', true);

      // Fetch budget categories
      const { data: budgetCategories } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('is_active', true);

      // Calculate analytics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
      const monthlyDonations = donations?.filter(d => {
        const date = new Date(d.donation_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const monthlyExpenses = expenses?.filter(e => {
        const date = new Date(e.expense_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      const totalPledges = pledges?.filter(p => p.status === 'active')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setAnalytics({
        totalDonations,
        monthlyDonations,
        totalExpenses,
        monthlyExpenses,
        totalPledges,
        activeCampaigns: campaigns?.length || 0,
        budgetCategories: budgetCategories || [],
        donationTrends: donations || [],
        expenseBreakdown: expenses || []
      });

    } catch (err) {
      console.error('Error fetching financial analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      
      // Set up real-time subscription for donations
      const donationsSubscription = supabase
        .channel('financial-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'donations'
        }, () => {
          fetchAnalytics();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'expenses'
        }, () => {
          fetchAnalytics();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(donationsSubscription);
      };
    }
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
