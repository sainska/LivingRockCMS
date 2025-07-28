import React, { useState } from 'react';
import { useVolunteers } from '@/hooks/useVolunteers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

const VolunteerOpportunities = () => {
  const { opportunities, signups, loading, error } = useVolunteers();
  const { role, profile } = useUserRole();
  const [newOpp, setNewOpp] = useState({ event_title: '', role_needed: '', description: '' });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const handleSignup = async (opportunityId) => {
    await supabase.from('volunteer_signups').insert({
      opportunity_id: opportunityId,
      user_id: profile?.id
    });
    window.location.reload();
  };

  const handleAddOpportunity = async () => {
    setAdding(true);
    setAddError(null);
    try {
      await supabase.from('volunteer_opportunities').insert({
        event_title: newOpp.event_title,
        role_needed: newOpp.role_needed,
        description: newOpp.description,
        is_open: true
      });
      setNewOpp({ event_title: '', role_needed: '', description: '' });
      window.location.reload();
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Volunteer Opportunities</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {role === 'admin' || role === 'secretary' ? (
        <Card className="mb-4">
          <CardHeader><CardTitle>Add New Opportunity</CardTitle></CardHeader>
          <CardContent>
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Event Title"
              value={newOpp.event_title}
              onChange={e => setNewOpp({ ...newOpp, event_title: e.target.value })}
            />
            <input
              className="border p-2 mb-2 w-full"
              placeholder="Role Needed"
              value={newOpp.role_needed}
              onChange={e => setNewOpp({ ...newOpp, role_needed: e.target.value })}
            />
            <textarea
              className="border p-2 mb-2 w-full"
              placeholder="Description"
              value={newOpp.description}
              onChange={e => setNewOpp({ ...newOpp, description: e.target.value })}
            />
            <Button onClick={handleAddOpportunity} disabled={adding}>
              {adding ? 'Adding...' : 'Add Opportunity'}
            </Button>
            {addError && <div className="text-red-600">{addError}</div>}
          </CardContent>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map(opp => (
          <Card key={opp.id}>
            <CardHeader>
              <CardTitle>{opp.event_title} - {opp.role_needed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{opp.description}</p>
              {opp.is_open ? (
                signups.some(s => s.opportunity_id === opp.id && s.user_id === profile?.id) ? (
                  <Button disabled>Signed Up</Button>
                ) : (
                  <Button onClick={() => handleSignup(opp.id)}>Sign Up</Button>
                )
              ) : (
                <span className="text-gray-500">Closed</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VolunteerOpportunities; 