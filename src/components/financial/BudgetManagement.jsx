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
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Filter, Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';

const BudgetManagement = () => {
  const { budgetCategories, loading, addBudgetCategory, updateBudgetCategory } = useFinancialData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    allocated_amount: '',
    budget_year: new Date().getFullYear()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBudget) {
        await updateBudgetCategory(selectedBudget.id, formData);
        toast({
          title: "Success",
          description: "Budget category updated successfully",
        });
      } else {
        await addBudgetCategory(formData);
        toast({
          title: "Success",
          description: "Budget category created successfully",
        });
      }
      setIsAddDialogOpen(false);
      setSelectedBudget(null);
      setFormData({
        name: '',
        description: '',
        allocated_amount: '',
        budget_year: new Date().getFullYear()
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save budget category",
        variant: "destructive",
      });
    }
  };

  const filteredBudgets = budgetCategories?.filter(budget => {
    const matchesSearch = budget.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = budget.budget_year === selectedYear;
    return matchesSearch && matchesYear && budget.is_active;
  }) || [];

  const totalAllocated = filteredBudgets.reduce((sum, budget) => sum + parseFloat(budget.allocated_amount || 0), 0);
  const totalSpent = filteredBudgets.reduce((sum, budget) => sum + parseFloat(budget.spent_amount || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;

  const getUtilizationColor = (percentage) => {
    if (percentage <= 50) return 'text-green-600';
    if (percentage <= 75) return 'text-yellow-600';
    if (percentage <= 100) return 'text-orange-600';
    return 'text-red-600';
  };

  const getUtilizationVariant = (percentage) => {
    if (percentage <= 50) return 'default';
    if (percentage <= 75) return 'secondary';
    if (percentage <= 100) return 'outline';
    return 'destructive';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading budget data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">KES {totalAllocated.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {totalRemaining.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Overall budget utilization for {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Budget Utilization</span>
              <span>{totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0}%</span>
            </div>
            <Progress 
              value={totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0} 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>KES 0</span>
              <span>KES {totalAllocated.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Manage budget allocations by category</CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026].map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
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
                    setSelectedBudget(null);
                    setFormData({
                      name: '',
                      description: '',
                      allocated_amount: '',
                      budget_year: selectedYear
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedBudget ? 'Edit Budget Category' : 'Create Budget Category'}</DialogTitle>
                    <DialogDescription>
                      {selectedBudget ? 'Update budget category details' : 'Add a new budget category for tracking expenses'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g., Operations, Utilities, Events"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe what this budget category covers"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="allocated_amount">Allocated Amount (KES)</Label>
                        <Input
                          id="allocated_amount"
                          type="number"
                          step="0.01"
                          value={formData.allocated_amount}
                          onChange={(e) => setFormData({...formData, allocated_amount: e.target.value})}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="budget_year">Budget Year</Label>
                        <Select value={formData.budget_year.toString()} onValueChange={(value) => setFormData({...formData, budget_year: parseInt(value)})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[2024, 2025, 2026].map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {selectedBudget ? 'Update' : 'Create'} Category
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
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => {
                const allocated = parseFloat(budget.allocated_amount || 0);
                const spent = parseFloat(budget.spent_amount || 0);
                const remaining = allocated - spent;
                const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{budget.description || '-'}</TableCell>
                    <TableCell className="font-medium">KES {allocated.toLocaleString()}</TableCell>
                    <TableCell className="font-medium text-red-600">KES {spent.toLocaleString()}</TableCell>
                    <TableCell className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      KES {remaining.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16">
                          <Progress value={Math.min(utilization, 100)} className="h-2" />
                        </div>
                        <Badge variant={getUtilizationVariant(utilization)} className={getUtilizationColor(utilization)}>
                          {utilization.toFixed(1)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBudget(budget);
                          setFormData({
                            name: budget.name || '',
                            description: budget.description || '',
                            allocated_amount: budget.allocated_amount || '',
                            budget_year: budget.budget_year || new Date().getFullYear()
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredBudgets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No budget categories found. {searchTerm ? 'Try adjusting your search.' : 'Create your first budget category to get started.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManagement;