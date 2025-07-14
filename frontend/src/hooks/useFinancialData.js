import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFinancialData = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('financial_accounts')
        .select('*')
        .eq('is_active', true)
        .order('account_name');

      if (accountsError) {
        console.error('Error fetching financial accounts:', accountsError);
        setError(accountsError.message);
        return;
      }

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          accounts:account_id (
            account_name,
            account_type
          ),
          donor:donor_id (
            first_name,
            last_name
          ),
          recorder:recorded_by (
            first_name,
            last_name
          )
        `)
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (transactionsError) {
        console.error('Error fetching financial transactions:', transactionsError);
        setError(transactionsError.message);
        return;
      }

      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error('Error in fetchFinancialData:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: insertError } = await supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          recorded_by: user?.id
        });

      if (insertError) {
        console.error('Error adding transaction:', insertError);
        throw insertError;
      }

      await fetchFinancialData();
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('financial_transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
        throw updateError;
      }

      await fetchFinancialData();
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  const addAccount = async (accountData) => {
    try {
      const { error: insertError } = await supabase
        .from('financial_accounts')
        .insert(accountData);

      if (insertError) {
        console.error('Error adding account:', insertError);
        throw insertError;
      }

      await fetchFinancialData();
    } catch (err) {
      console.error('Error adding account:', err);
      throw err;
    }
  };

  const updateAccount = async (id, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('financial_accounts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating account:', updateError);
        throw updateError;
      }

      await fetchFinancialData();
    } catch (err) {
      console.error('Error updating account:', err);
      throw err;
    }
  };

  const getAccountBalance = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? parseFloat(account.balance) : 0;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance), 0);
  };

  const getTransactionsByAccount = (accountId) => {
    return transactions.filter(transaction => transaction.account_id === accountId);
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  return {
    accounts,
    transactions,
    loading,
    error,
    refreshData: fetchFinancialData,
    addTransaction,
    updateTransaction,
    addAccount,
    updateAccount,
    getAccountBalance,
    getTotalBalance,
    getTransactionsByAccount,
    getTransactionsByDateRange
  };
}; 