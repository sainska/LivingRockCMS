
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus, Filter, Trash2, FileText } from "lucide-react";
import DonationChart from "@/components/dashboard/DonationChart";
import RecentDonations from "@/components/dashboard/RecentDonations";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Sample data for expenses
const expenses = [
  { id: "EXP-1234", category: "Utilities", description: "Electricity Bill", amount: "$450.00", date: "2025-05-15", approvedBy: "Sarah Johnson" },
  { id: "EXP-1235", category: "Salaries", description: "Staff Salaries - May", amount: "$12,500.00", date: "2025-05-10", approvedBy: "Robert Miller" },
  { id: "EXP-1236", category: "Supplies", description: "Office Supplies", amount: "$275.50", date: "2025-05-08", approvedBy: "Sarah Johnson" },
  { id: "EXP-1237", category: "Maintenance", description: "AC Repair", amount: "$850.00", date: "2025-05-05", approvedBy: "John Smith" },
  { id: "EXP-1238", category: "Events", description: "Youth Camp Deposit", amount: "$2,000.00", date: "2025-05-03", approvedBy: "Robert Miller" },
];

// Sample data for pledges
const pledges = [
  { id: "PLG-1234", campaign: "Building Fund", name: "John Smith", pledged: "$5,000.00", fulfilled: "$2,500.00", status: "In Progress", endDate: "2025-12-31" },
  { id: "PLG-1235", campaign: "Building Fund", name: "Jane Cooper", pledged: "$10,000.00", fulfilled: "$10,000.00", status: "Completed", endDate: "2025-12-31" },
  { id: "PLG-1236", campaign: "Mission Trip", name: "Robert Johnson", pledged: "$2,500.00", fulfilled: "$500.00", status: "In Progress", endDate: "2025-08-15" },
  { id: "PLG-1237", campaign: "Mission Trip", name: "Sarah Williams", pledged: "$1,500.00", fulfilled: "$0.00", status: "Not Started", endDate: "2025-08-15" },
  { id: "PLG-1238", campaign: "Building Fund", name: "Michael Brown", pledged: "$7,500.00", fulfilled: "$5,000.00", status: "In Progress", endDate: "2025-12-31" },
];

// Sample data for budget
const budgetCategories = [
  { id: 1, name: "Staff Salaries", budgeted: "$150,000.00", spent: "$62,500.00", remaining: "$87,500.00", percentUsed: 42 },
  { id: 2, name: "Utilities", budgeted: "$24,000.00", spent: "$10,250.00", remaining: "$13,750.00", percentUsed: 43 },
  { id: 3, name: "Maintenance", budgeted: "$30,000.00", spent: "$15,750.00", remaining: "$14,250.00", percentUsed: 53 },
  { id: 4, name: "Ministry Programs", budgeted: "$45,000.00", spent: "$18,500.00", remaining: "$26,500.00", percentUsed: 41 },
  { id: 5, name: "Outreach & Missions", budgeted: "$60,000.00", spent: "$22,800.00", remaining: "$37,200.00", percentUsed: 38 },
];

const getPledgeStatusBadge = (status) => {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "In Progress":
      return <Badge className="bg-xiracom-blue">In Progress</Badge>;
    case "Not Started":
      return <Badge variant="outline" className="text-gray-500">Not Started</Badge>;
    default:
      return null;
  }
};

const Finances = () => {
  const [year, setYear] = useState("2025");
  const { toast } = useToast();

  const generateFinancialPDF = (type, data) => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Header
      doc.setFontSize(20);
      doc.text('Living Rock Church', 20, 20);
      doc.setFontSize(16);
      doc.text(`${type} Report`, 20, 30);
      doc.setFontSize(12);
      doc.text(`Generated on: ${currentDate}`, 20, 40);
      
      // Content
      doc.setFontSize(12);
      let yPos = 60;
      
      if (type === 'Expenses') {
        doc.text('Expense Details:', 20, yPos);
        yPos += 15;
        expenses.forEach((expense, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${expense.description} - ${expense.amount} (${expense.date})`, 20, yPos);
          yPos += 10;
        });
      } else if (type === 'Pledges') {
        doc.text('Pledge Details:', 20, yPos);
        yPos += 15;
        pledges.forEach((pledge, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${pledge.name} - ${pledge.pledged} for ${pledge.campaign}`, 20, yPos);
          yPos += 10;
        });
      } else if (type === 'Budget') {
        doc.text('Budget Categories:', 20, yPos);
        yPos += 15;
        budgetCategories.forEach((category, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${index + 1}. ${category.name}: ${category.spent} / ${category.budgeted} (${category.percentUsed}%)`, 20, yPos);
          yPos += 10;
        });
      }
      
      // Footer
      doc.setFontSize(8);
      doc.text('Living Rock Church Management System © 2025 | Powered by Xiracom', 20, 280);
      
      doc.save(`${type}_Report_${currentDate.replace(/\//g, '-')}.pdf`);
      
      toast({
        title: "Export Complete",
        description: `${type} report has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = (type) => {
    toast({
      title: `Add New ${type}`,
      description: `Opening form to add new ${type.toLowerCase()}...`,
    });
  };

  const handleDelete = (type, id) => {
    toast({
      title: `Delete ${type}`,
      description: `${type} ${id} would be deleted (feature in development)`,
    });
  };

  const handleFilter = (type) => {
    toast({
      title: `Filter ${type}`,
      description: `Opening ${type.toLowerCase()} filters...`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <div className="flex gap-2">
          <Select defaultValue={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" onClick={() => handleAddNew("Transaction")}>
            <Plus className="mr-2 h-4 w-4" /> New Transaction
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="donations">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        
        <TabsContent value="donations" className="space-y-6 pt-4">
          <DonationChart />
          <RecentDonations />
        </TabsContent>
        
        <TabsContent value="expenses" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>Manage and track church expenses</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleFilter("Expenses")}>
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" onClick={() => generateFinancialPDF("Expenses", expenses)}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" onClick={() => handleAddNew("Expense")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.amount}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.approvedBy}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete("Expense", expense.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pledges" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campaign Pledges</CardTitle>
                <CardDescription>Track pledge campaigns and fulfillment</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleFilter("Pledges")}>
                  <Filter className="mr-2 h-4 w-4" /> Filter by Campaign
                </Button>
                <Button variant="outline" onClick={() => generateFinancialPDF("Pledges", pledges)}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" onClick={() => handleAddNew("Campaign")}>
                  <Plus className="mr-2 h-4 w-4" /> New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Pledged</TableHead>
                      <TableHead>Fulfilled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pledges.map((pledge) => (
                      <TableRow key={pledge.id}>
                        <TableCell className="font-medium">{pledge.id}</TableCell>
                        <TableCell>{pledge.campaign}</TableCell>
                        <TableCell>{pledge.name}</TableCell>
                        <TableCell>{pledge.pledged}</TableCell>
                        <TableCell>{pledge.fulfilled}</TableCell>
                        <TableCell>{getPledgeStatusBadge(pledge.status)}</TableCell>
                        <TableCell>{pledge.endDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete("Pledge", pledge.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Planning</CardTitle>
                <CardDescription>Yearly budget allocation and tracking</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => generateFinancialPDF("Budget", budgetCategories)}>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue" onClick={() => handleAddNew("Budget Category")}>
                  <Plus className="mr-2 h-4 w-4" /> Update Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Budgeted</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>% Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.budgeted}</TableCell>
                        <TableCell>{category.spent}</TableCell>
                        <TableCell>{category.remaining}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-xiracom-blue h-2 rounded-full"
                                style={{ width: `${category.percentUsed}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{category.percentUsed}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">Details</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete("Budget Category", category.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
