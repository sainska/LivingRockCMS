import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  Calendar, 
  User, 
  MessageSquare, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

const MemberPastoralCare = () => {
  const { user } = useAuth();
  const [pastoralVisits, setPastoralVisits] = useState([]);
  const [counselingSessions, setCounselingSessions] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Pastoral Visits
      const { data: visitsData } = await supabase
        .from('pastoral_visits')
        .select('id, visit_date, status, notes, visitor_id, profiles:visitor_id(first_name, last_name)')
        .eq('member_id', user.id)
        .order('visit_date', { ascending: false });
      setPastoralVisits((visitsData || []).map(v => ({
        ...v,
        pastor_name: v.profiles ? `${v.profiles.first_name} ${v.profiles.last_name}` : 'Pastor'
      })));

      // Counseling Sessions
      const { data: counselingData } = await supabase
        .from('counseling_sessions')
        .select('id, session_date, status, notes, counselor_id, profiles:counselor_id(first_name, last_name)')
        .eq('member_id', user.id)
        .order('session_date', { ascending: false });
      setCounselingSessions((counselingData || []).map(s => ({
        ...s,
        counselor_name: s.profiles ? `${s.profiles.first_name} ${s.profiles.last_name}` : 'Counselor'
      })));

      // Support Requests
      const { data: requestsData } = await supabase
        .from('support_requests')
        .select('id, request_type, details, status, requested_at')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });
      setSupportRequests(requestsData || []);
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user]);

  const handleSupportRequest = async (requestData) => {
    if (!user?.id) return;
    setShowRequestDialog(false);
    await supabase.from('support_requests').insert({
      user_id: user.id,
      ...requestData,
      status: 'pending',
      requested_at: new Date().toISOString()
    });
    fetchData();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeColor = (type) => {
    switch (type) {
      case 'prayer': return 'bg-purple-100 text-purple-800';
      case 'counseling': return 'bg-blue-100 text-blue-800';
      case 'visit': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pastoral Care</h2>
          <p className="text-muted-foreground">Access pastoral support and counseling services</p>
        </div>
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Pastoral Support</DialogTitle>
            </DialogHeader>
            <SupportRequestForm onSubmit={handleSupportRequest} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="visits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visits">Pastoral Visits</TabsTrigger>
          <TabsTrigger value="counseling">Counseling Sessions</TabsTrigger>
          <TabsTrigger value="requests">Support Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Pastoral Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Pastor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastoralVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(visit.visit_date), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {visit.pastor_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(visit.status)}
                          <Badge className={getStatusColor(visit.status)}>
                            {visit.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{visit.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counseling">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Counseling Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Counselor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {counselingSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(session.session_date), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {session.counselor_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(session.status)}
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{session.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Support Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge className={getRequestTypeColor(request.request_type)}>
                          {request.request_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.details}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.requested_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Support Request Form Component
const SupportRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    request_type: '',
    details: '',
    urgency: 'normal'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="request_type">Type of Support</Label>
        <Select 
          value={formData.request_type} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, request_type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type of support" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prayer">Prayer Request</SelectItem>
            <SelectItem value="counseling">Counseling</SelectItem>
            <SelectItem value="visit">Pastoral Visit</SelectItem>
            <SelectItem value="guidance">Spiritual Guidance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select 
          value={formData.urgency} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          value={formData.details}
          onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
          placeholder="Please describe your need for pastoral support..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">
          Submit Request
        </Button>
      </div>
    </form>
  );
};

export default MemberPastoralCare; 