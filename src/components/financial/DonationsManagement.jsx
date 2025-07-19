import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, Download, Receipt } from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';
import { useToast } from '@/hooks/use-toast';

const DonationsManagement = () => {
  const { donations, loading, addDonation, updateDonation } = useDonations();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
    donation_type: 'tithe',
    payment_method: 'cash',
    purpose: '',
    is_anonymous: false,
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDonation) {
        await updateDonation(selectedDonation.id, formData);
        toast({
          title: "Success",
          description: "Donation updated successfully",
        });
      } else {
        await addDonation(formData);
        toast({
          title: "Success", 
          description: "Donation recorded successfully",
        });
      }
      setIsAddDialogOpen(false);
      setSelectedDonation(null);
      setFormData({
        donor_name: '',
        amount: '',
        donation_type: 'tithe',
        payment_method: 'cash',
        purpose: '',
        is_anonymous: false,
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save donation",
        variant: "destructive",
      });
    }
  };

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch = donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'receipted' && donation.receipt_issued) ||
                         (statusFilter === 'pending' && !donation.receipt_issued);
    return matchesSearch && matchesStatus;
  }) || [];

  const totalDonations = donations?.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0) || 0;
  const monthlyDonations = donations?.filter(d => {
    const donationDate = new Date(d.donation_date);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
  }).reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0) || 0;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading donations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {totalDonations.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {monthlyDonations.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Donations Management</CardTitle>
              <CardDescription>Track and manage church donations</CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="receipted">Receipted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedDonation(null);
                    setFormData({
                      donor_name: '',
                      amount: '',
                      donation_type: 'tithe',
                      payment_method: 'cash',
                      purpose: '',
                      is_anonymous: false,
                      notes: ''
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Donation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedDonation ? 'Edit Donation' : 'Record New Donation'}</DialogTitle>
                    <DialogDescription>
                      {selectedDonation ? 'Update donation details' : 'Add a new donation record to the system'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donor_name">Donor Name</Label>
                        <Input
                          id="donor_name"
                          value={formData.donor_name}
                          onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                          placeholder="Enter donor name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (KES)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donation_type">Donation Type</Label>
                        <Select value={formData.donation_type} onValueChange={(value) => setFormData({...formData, donation_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tithe">Tithe</SelectItem>
                            <SelectItem value="offering">Offering</SelectItem>
                            <SelectItem value="special_offering">Special Offering</SelectItem>
                            <SelectItem value="building_fund">Building Fund</SelectItem>
                            <SelectItem value="missions">Missions</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment_method">Payment Method</Label>
                        <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose (Optional)</Label>
                      <Input
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        placeholder="Specific purpose for this donation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Additional notes"
                        rows={3}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedDonation ? 'Update' : 'Record'} Donation
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    {new Date(donation.donation_date || donation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-medium">
                    KES {parseFloat(donation.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {donation.donation_type?.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {donation.payment_method?.replace('_', ' ').toUpperCase()}
                  </TableCell>
                  <TableCell>{donation.purpose || '-'}</TableCell>
                  <TableCell>
                    {donation.receipt_issued ? (
                      <Badge variant="default">Issued</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setFormData({
                            donor_name: donation.donor_name || '',
                            amount: donation.amount || '',
                            donation_type: donation.donation_type || 'tithe',
                            payment_method: donation.payment_method || 'cash',
                            purpose: donation.purpose || '',
                            is_anonymous: donation.is_anonymous || false,
                            notes: donation.notes || ''
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredDonations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No donations found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Record your first donation to get started.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsManagement;