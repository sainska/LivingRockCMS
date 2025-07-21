import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const fetchDonations = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('*').eq('transaction_type', 'tithe').order('date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchOfferings = async () => {
  const { data, error } = await supabase.from('financial_transactions').select('*').eq('transaction_type', 'offering').order('date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchDonors = async () => {
  const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, email');
  if (error) throw error;
  return data;
};

const TreasurerDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .in('transaction_type', ['donation', 'tithe']);
      setDonations(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Donations & Tithes</h2>
      <Card>
        <CardHeader><CardTitle>Tithes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Donor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                donations?.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.amount}</TableCell>
                    <TableCell>{t.user_id}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Offerings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Donor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                donations?.map(o => (
                  <TableRow key={o.id}>
                    <TableCell>{o.date}</TableCell>
                    <TableCell>{o.amount}</TableCell>
                    <TableCell>{o.user_id}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Donor Records</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                donations?.map(d => (
                  <TableRow key={d.id}>
                    <TableCell>{d.first_name} {d.last_name}</TableCell>
                    <TableCell>{d.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasurerDonations; 