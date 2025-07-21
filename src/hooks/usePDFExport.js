
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportFinancialReport = async (data) => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Living Rock Church - Financial Report', 20, 20);
      
      // Date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      
      // Summary
      doc.setFontSize(14);
      doc.text('Financial Summary', 20, 55);
      
      doc.setFontSize(10);
      doc.text(`Total Donations: KES ${data.totalDonations.toLocaleString()}`, 20, 70);
      doc.text(`Monthly Donations: KES ${data.monthlyDonations.toLocaleString()}`, 20, 80);
      doc.text(`Total Expenses: KES ${data.totalExpenses.toLocaleString()}`, 20, 90);
      doc.text(`Monthly Expenses: KES ${data.monthlyExpenses.toLocaleString()}`, 20, 100);
      doc.text(`Net Income: KES ${(data.totalDonations - data.totalExpenses).toLocaleString()}`, 20, 110);
      
      // Budget table
      if (data.budgetCategories && data.budgetCategories.length > 0) {
        doc.autoTable({
          head: [['Category', 'Allocated', 'Spent', 'Remaining']],
          body: data.budgetCategories.map(cat => [
            cat.name,
            `KES ${Number(cat.allocated_amount).toLocaleString()}`,
            `KES ${Number(cat.spent_amount).toLocaleString()}`,
            `KES ${(Number(cat.allocated_amount) - Number(cat.spent_amount)).toLocaleString()}`
          ]),
          startY: 130,
        });
      }
      
      doc.save('financial-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportMembershipReport = async (members) => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Living Rock Church - Membership Report', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
      doc.text(`Total Members: ${members.length}`, 20, 45);
      
      doc.autoTable({
        head: [['Name', 'Email', 'Phone', 'City', 'Role']],
        body: members.slice(0, 50).map(member => [
          `${member.first_name} ${member.last_name}`,
          member.email,
          member.phone || 'N/A',
          member.city || 'N/A',
          member.user_roles?.[0]?.role || 'member'
        ]),
        startY: 60,
      });
      
      doc.save('membership-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportFinancialReport, exportMembershipReport, isExporting };
};
