
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const usePDFExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportFinancialReport = async (data) => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Living Rock Church - Financial Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Summary section
      let yPos = 50;
      doc.setFontSize(16);
      doc.text('Financial Summary', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.text(`Total Donations: KSH ${data.totalDonations?.toLocaleString() || '0'}`, 20, yPos);
      yPos += 8;
      doc.text(`Monthly Donations: KSH ${data.monthlyDonations?.toLocaleString() || '0'}`, 20, yPos);
      yPos += 8;
      doc.text(`Total Expenses: KSH ${data.totalExpenses?.toLocaleString() || '0'}`, 20, yPos);
      yPos += 8;
      doc.text(`Monthly Expenses: KSH ${data.monthlyExpenses?.toLocaleString() || '0'}`, 20, yPos);
      yPos += 15;
      
      // Donations table
      if (data.donationTrends && data.donationTrends.length > 0) {
        doc.autoTable({
          startY: yPos,
          head: [['Date', 'Type', 'Amount (KSH)']],
          body: data.donationTrends.slice(0, 10).map(donation => [
            new Date(donation.donation_date).toLocaleDateString(),
            donation.donation_type,
            `KSH ${Number(donation.amount).toLocaleString()}`
          ]),
          title: 'Recent Donations'
        });
      }
      
      doc.save('financial-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportSecurityReport = async (logs) => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Living Rock Church - Security Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      if (logs && logs.length > 0) {
        doc.autoTable({
          startY: 50,
          head: [['Timestamp', 'Event', 'User', 'Severity', 'Result']],
          body: logs.slice(0, 20).map(log => [
            new Date(log.timestamp).toLocaleString(),
            log.event,
            log.user || 'System',
            log.severity,
            log.result
          ]),
          title: 'Security Events Log'
        });
      }
      
      doc.save('security-report.pdf');
    } catch (error) {
      console.error('Error exporting security PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const exportMembershipReport = async (members) => {
    try {
      setIsExporting(true);
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Living Rock Church - Membership Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      if (members && members.length > 0) {
        doc.autoTable({
          startY: 50,
          head: [['Name', 'Email', 'Phone', 'Join Date']],
          body: members.map(member => [
            `${member.first_name} ${member.last_name}`,
            member.email,
            member.phone || 'N/A',
            member.created_at ? new Date(member.created_at).toLocaleDateString() : 'N/A'
          ]),
          title: 'Church Members'
        });
      }
      
      doc.save('membership-report.pdf');
    } catch (error) {
      console.error('Error exporting membership PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportFinancialReport,
    exportSecurityReport,
    exportMembershipReport
  };
};
