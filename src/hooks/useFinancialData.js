
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialData = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchFinancialData = async () => {
      try {
        console.log('Fetching financial data...');
        
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('*')
          .order('transaction_date', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        } else {
          setTransactions(transactionsData || []);
        }

        const { data: accountsData, error: accountsError } = await supabase
          .from('financial_accounts')
          .select('*')
          .eq('is_active', true);

        if (accountsError) {
          console.error('Error fetching accounts:', accountsError);
        } else {
          setAccounts(accountsData || []);
        }

        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_categories')
          .select('*')
          .eq('is_active', true)
          .eq('budget_year', new Date().getFullYear());

        if (budgetError) {
          console.error('Error fetching budget:', budgetError);
        } else {
          setBudgetCategories(budgetData || []);
        }
      } catch (err) {
        console.error('Error in fetchFinancialData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [user]);

  const addTransaction = async (transactionData) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          ...transactionData,
          recorded_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setTransactions(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { data: null, error };
    }
  };

  return {
    transactions,
    accounts,
    budgetCategories,
    loading,
    error,
    addTransaction
  };
};
