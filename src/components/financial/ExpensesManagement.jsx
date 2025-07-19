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
import { Plus, Search, Filter, Download, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';

const ExpensesManagement = () => {
  const { expenses, loading, addExpense, updateExpense } = useFinancialData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'operations',
    expense_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const expenseCategories = [
    'operations',
    'utilities',
    'maintenance',
    'supplies',
    'events',
    'missions',
    'salaries',
    'other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, formData);
        toast({
          title: "Success",
          description: "Expense updated successfully",
        });
      } else {
        await addExpense(formData);
        toast({
          title: "Success",
          description: "Expense recorded successfully",
        });
      }
      setIsAddDialogOpen(false);
      setSelectedExpense(null);
      setFormData({
        description: '',
        amount: '',
        category: 'operations',
        expense_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive",
      });
    }
  };

  const filteredExpenses = expenses?.filter(expense => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const totalExpenses = expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) || 0;
  const monthlyExpenses = expenses?.filter(e => {
    const expenseDate = new Date(e.expense_date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) || 0;

  const categoryTotals = expenseCategories.map(category => ({
    category,
    total: expenses?.filter(e => e.category === category)
      .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0) || 0
  })).sort((a, b) => b.total - a.total);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">KES {monthlyExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {categoryTotals[0]?.category || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              KES {categoryTotals[0]?.total.toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryTotals.slice(0, 8).map(({ category, total }) => (
              <div key={category} className="text-center p-4 border rounded-lg">
                <div className="text-lg font-semibold">KES {total.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground capitalize">{category.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle>Expenses Management</CardTitle>
              <CardDescription>Track and manage church expenses</CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </SelectItem>
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
                    setSelectedExpense(null);
                    setFormData({
                      description: '',
                      amount: '',
                      category: 'operations',
                      expense_date: new Date().toISOString().split('T')[0],
                      notes: ''
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Record New Expense'}</DialogTitle>
                    <DialogDescription>
                      {selectedExpense ? 'Update expense details' : 'Add a new expense record to the system'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe the expense"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="expense_date">Date</Label>
                        <Input
                          id="expense_date"
                          type="date"
                          value={formData.expense_date}
                          onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        {selectedExpense ? 'Update' : 'Record'} Expense
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
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {expense.category?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-red-600">
                    KES {parseFloat(expense.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {expense.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedExpense(expense);
                          setFormData({
                            description: expense.description || '',
                            amount: expense.amount || '',
                            category: expense.category || 'operations',
                            expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
                            notes: expense.notes || ''
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
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found. {searchTerm || categoryFilter !== 'all' ? 'Try adjusting your filters.' : 'Record your first expense to get started.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesManagement;