import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialDashboard = () => {
  const [financialData, setFinancialData] = useState({
    accounts: [],
    transactions: [],
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netAmount: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      monthlyNet: 0
    },
    recentTransactions: [],
    accountBalances: [],
    monthlyTrends: [],
    topDonors: [],
    expenseCategories: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching financial dashboard data...');

      // Fetch financial accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (accountsError) {
        console.error('Accounts fetch error:', accountsError);
      }

      // Fetch all transactions with related data
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          financial_accounts(name, account_type),
          profiles(first_name, last_name)
        `)
        .order('date', { ascending: false })
        .limit(100);

      if (transactionsError) {
        console.error('Transactions fetch error:', transactionsError);
      }

      // Fetch financial summary using the database function
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_financial_summary');

      if (summaryError) {
        console.warn('Financial summary fetch warning:', summaryError);
      }

      // Calculate additional statistics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyTransactions = transactionsData?.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      }) || [];

      const monthlyIncome = monthlyTransactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const monthlyExpenses = monthlyTransactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate account balances
      const accountBalances = accountsData?.map(account => {
        const accountTransactions = transactionsData?.filter(t => t.account_id === account.id) || [];
        const income = accountTransactions
          .filter(t => t.transaction_type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const expenses = accountTransactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          accountId: account.id,
          accountName: account.name,
          accountType: account.account_type,
          balance: income - expenses,
          transactionCount: accountTransactions.length
        };
      }) || [];

      // Get top donors (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentDonations = transactionsData?.filter(t => 
        t.transaction_type === 'income' && 
        new Date(t.date) >= thirtyDaysAgo &&
        t.user_id // Only include donations with user_id (not anonymous)
      ) || [];

      const topDonors = recentDonations
        .reduce((acc, transaction) => {
          const userId = transaction.user_id;
          const existing = acc.find(d => d.userId === userId);
          
          if (existing) {
            existing.totalAmount += Number(transaction.amount);
            existing.donationCount += 1;
          } else {
            acc.push({
              userId,
              userName: transaction.profiles ? 
                `${transaction.profiles.first_name} ${transaction.profiles.last_name}` : 
                'Unknown',
              totalAmount: Number(transaction.amount),
              donationCount: 1
            });
          }
          return acc;
        }, [])
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 10);

      // Calculate expense categories
      const expenseCategories = transactionsData
        ?.filter(t => t.transaction_type === 'expense')
        ?.reduce((acc, transaction) => {
          const category = transaction.financial_accounts?.account_type || 'Other';
          const existing = acc.find(c => c.category === category);
          
          if (existing) {
            existing.amount += Number(transaction.amount);
            existing.count += 1;
          } else {
            acc.push({
              category,
              amount: Number(transaction.amount),
              count: 1
            });
          }
          return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount) || [];

      // Calculate monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const monthTransactions = transactionsData?.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === month.getMonth() && 
                 transactionDate.getFullYear() === month.getFullYear();
        }) || [];

        const monthIncome = monthTransactions
          .filter(t => t.transaction_type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const monthExpenses = monthTransactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        monthlyTrends.push({
          month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          income: monthIncome,
          expenses: monthExpenses,
          net: monthIncome - monthExpenses
        });
      }

      setFinancialData({
        accounts: accountsData || [],
        transactions: transactionsData || [],
        summary: {
          totalIncome: summaryData?.total_income || 0,
          totalExpenses: summaryData?.total_expenses || 0,
          netAmount: summaryData?.net_amount || 0,
          monthlyIncome,
          monthlyExpenses,
          monthlyNet: monthlyIncome - monthlyExpenses,
          transactionCount: summaryData?.transaction_count || 0
        },
        recentTransactions: transactionsData?.slice(0, 20) || [],
        accountBalances,
        monthlyTrends,
        topDonors,
        expenseCategories
      });

      console.log('✅ Financial dashboard data loaded:', {
        accounts: accountsData?.length,
        transactions: transactionsData?.length,
        monthlyIncome,
        monthlyExpenses,
        topDonors: topDonors.length
      });

    } catch (err) {
      console.error('❌ Error fetching financial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();

    // Set up real-time subscriptions
    const subscriptions = [
      supabase
        .channel('financial-accounts-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'financial_accounts' },
          () => {
            console.log('🔄 Financial accounts changed, refreshing...');
            fetchFinancialData();
          }
        )
        .subscribe(),
      
      supabase
        .channel('financial-transactions-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'financial_transactions' },
          () => {
            console.log('🔄 Financial transactions changed, refreshing...');
            fetchFinancialData();
          }
        )
        .subscribe()
    ];

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, []);

  return { financialData, loading, error, refetch: fetchFinancialData };
}; 