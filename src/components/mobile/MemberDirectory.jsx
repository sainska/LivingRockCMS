import React from 'react';
import { useMemberDirectory } from '@/hooks/useMemberDirectory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MemberDirectory = () => {
  const { members, loading, error } = useMemberDirectory();

  if (loading) return <div>Loading members...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Member Directory</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map(member => {
          const privacy = member.privacy_settings || {};
          return (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle>{member.first_name} {member.last_name}</CardTitle>
              </CardHeader>
              <CardContent>
                {member.photo_url && <img src={member.photo_url} alt="Profile" className="w-16 h-16 rounded-full mb-2" />}
                {(!privacy.hideEmail && member.email) && <div>Email: {member.email}</div>}
                {(!privacy.hidePhone && member.phone) && <div>Phone: {member.phone}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MemberDirectory; 