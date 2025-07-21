import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const fetchSurveys = async () => {
  const { data, error } = await supabase.from('surveys').select('*').eq('status', 'active').order('start_date', { ascending: false });
  if (error) throw error;
  return data;
};
const fetchResponses = async (userId) => {
  const { data, error } = await supabase.from('survey_responses').select('id, survey_id, response, submitted_at, surveys(title)').eq('user_id', userId).order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
};

const MemberSurveys = ({ userId }) => {
  const queryClient = useQueryClient();
  const { data: surveys, isLoading: loadingSurveys } = useQuery(['member_surveys'], fetchSurveys);
  const { data: responses, isLoading: loadingResponses } = useQuery(['member_survey_responses', userId], () => fetchResponses(userId), { enabled: !!userId });
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [response, setResponse] = useState('');

  const submitMutation = useMutation(async ({ survey_id, response }) => {
    const { data, error } = await supabase.from('survey_responses').insert([{ survey_id, user_id: userId, response }]);
    if (error) throw error;
    return data;
  }, {
    onSuccess: () => { setShowDialog(false); setResponse(''); queryClient.invalidateQueries(['member_survey_responses', userId]); }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Surveys & Feedback</h2>
      <Card>
        <CardHeader><CardTitle>Active Surveys</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSurveys ? <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow> :
                surveys?.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.title}</TableCell>
                    <TableCell>
                      <Dialog open={showDialog && selectedSurvey === s.id} onOpenChange={open => { setShowDialog(open); if (!open) setSelectedSurvey(null); }}>
                        <DialogTrigger asChild>
                          <Button onClick={() => { setSelectedSurvey(s.id); }}>Respond</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Respond to Survey</DialogTitle></DialogHeader>
                          <form onSubmit={e => { e.preventDefault(); submitMutation.mutate({ survey_id: s.id, response }); }} className="space-y-4">
                            <Label>Response</Label>
                            <Textarea value={response} onChange={e => setResponse(e.target.value)} required />
                            <Button type="submit" className="w-full">Submit</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>My Survey Responses</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingResponses ? <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow> :
                responses?.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.surveys?.title}</TableCell>
                    <TableCell>{r.response}</TableCell>
                    <TableCell>{r.submitted_at}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberSurveys; 