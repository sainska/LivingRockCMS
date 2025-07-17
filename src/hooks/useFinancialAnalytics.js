
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalDonations: 0,
    monthlyDonations: 0,
    totalExpenses: 0,
    monthlyExpenses: 0,
    totalPledges: 0,
    activeCampaigns: 0,
    budgetCategories: [],
    donationTrends: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);

        // Fetch donations data
        const { data: donations, error: donationsError } = await supabase
          .from('donations')
          .select('*');

        if (donationsError) throw donationsError;

        // Fetch budget categories
        const { data: budgetCategories, error: budgetError } = await supabase
          .from('budget_categories')
          .select('*')
          .eq('is_active', true);

        if (budgetError) throw budgetError;

        // Fetch financial transactions for expenses
        const { data: expenses, error: expensesError } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('transaction_type', 'expense');

        if (expensesError) throw expensesError;

        // Fetch active donation campaigns
        const { data: campaigns, error: campaignsError } = await supabase
          .from('donation_campaigns')
          .select('*')
          .eq('is_active', true);

        if (campaignsError) throw campaignsError;

        // Calculate analytics
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const totalDonations = donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
        const monthlyDonations = donations
          .filter(donation => {
            const donationDate = new Date(donation.donation_date);
            return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
          })
          .reduce((sum, donation) => sum + Number(donation.amount), 0);

        const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        const monthlyExpenses = expenses
          .filter(expense => {
            const expenseDate = new Date(expense.transaction_date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
          })
          .reduce((sum, expense) => sum + Number(expense.amount), 0);

        const totalPledges = campaigns.reduce((sum, campaign) => sum + Number(campaign.target_amount), 0);

        setAnalytics({
          totalDonations,
          monthlyDonations,
          totalExpenses,
          monthlyExpenses,
          totalPledges,
          activeCampaigns: campaigns.length,
          budgetCategories: budgetCategories || [],
          donationTrends: donations || []
        });

      } catch (err) {
        console.error('Error fetching financial analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();

    // Real-time subscriptions
    const donationsSubscription = supabase
      .channel('financial-donations-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        () => fetchFinancialData()
      )
      .subscribe();

    const expensesSubscription = supabase
      .channel('financial-expenses-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions' },
        () => fetchFinancialData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(donationsSubscription);
      supabase.removeChannel(expensesSubscription);
    };
  }, []);

  return { analytics, loading, error };
};
