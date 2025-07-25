import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDonations({ userId, search = '', filter = {}, page = 1, pageSize = 10 } = {}) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    let query = supabase.from('donations').select('*', { count: 'exact' }).eq('donor_id', userId);
    // Apply search
    if (search) {
      query = query.or(`donation_type.ilike.%${search}%,amount.eq.${search},campaign_name.ilike.%${search}%,payment_method.ilike.%${search}%,reference_number.ilike.%${search}%`);
    }
    // Apply filters
    Object.entries(filter).forEach(([key, value]) => {
      if (value) query = query.eq(key, value);
    });
    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    query.then(({ data, error, count }) => {
      if (error) setError(error.message);
      setDonations(data || []);
      setTotal(count || 0);
      setLoading(false);
    });
  }, [userId, search, JSON.stringify(filter), page, pageSize]);

  return { donations, loading, error, total };
}
