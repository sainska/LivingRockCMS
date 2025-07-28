import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { supabase } from "./integrations/supabase/client";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import DashboardRedirect from "./components/auth/DashboardRedirect";
import Layout from "./components/layout/Layout";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import InvitationAccept from "./pages/InvitationAccept";
import EmailChangeConfirmation from "./pages/EmailChangeConfirmation";
import ReauthenticationConfirmation from "./pages/ReauthenticationConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import RoleBasedRegister from "./pages/RoleBasedRegister";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./components/admin/AdminDashboard";
import SystemDashboard from "./components/admin/SystemDashboard";
import TreasurerDashboard from "./components/admin/TreasurerDashboard";
import AccountActivation from "./components/admin/AccountActivation";
import UserManagement from "./components/admin/UserManagement";
import SecretaryDashboard from "./components/admin/SecretaryDashboard";
import ClergyDashboard from "./components/admin/ClergyDashboard";
import UserDashboard from "./components/admin/UserDashboard";
import ChurchSettings from "./components/settings/ChurchSettings";
import SystemSettings from "./components/settings/SystemSettings";
import BackupSettings from "./components/settings/BackupSettings";
import SecurityOverview from "./components/security/SecurityOverview";
import UserAccessControl from "./components/security/UserAccessControl";
import DataProtection from "./components/security/DataProtection";
import SecurityLogs from "./components/security/SecurityLogs";
import CheckInSecurity from "./components/security/CheckInSecurity";
import IntegrationSettings from "./components/settings/IntegrationSettings";
import UserProfile from "./components/user/UserProfile";
import NotificationCenter from "./components/notifications/NotificationCenter";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Finances from "./pages/Finances";
import Communication from "./pages/Communication";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import Ministry from "./pages/Ministry";
import NotFound from "./pages/NotFound";
import PrayerRequests from "./pages/PrayerRequests";
import MemberDashboard from "./components/admin/MemberDashboard";
import MemberMinistries from "./components/member/MemberMinistries";
import MemberAttendance from "./components/member/MemberAttendance";
import MemberGiving from "./components/member/MemberGiving";
import MemberPastoralCare from "./components/member/MemberPastoralCare";
import MemberMessages from "./components/member/MemberMessages";
import MemberSettings from "./components/member/MemberSettings";
import SecretaryMembers from "./components/secretary/SecretaryMembers";
import SecretaryEvents from "./components/secretary/SecretaryEvents";
import SecretaryMinistries from "./components/secretary/SecretaryMinistries";
import SecretaryCommunication from "./components/secretary/SecretaryCommunication";
import SecretaryPastoralCare from "./components/secretary/SecretaryPastoralCare";
import SecretaryReports from "./components/secretary/SecretaryReports";
import SecretaryTools from "./components/secretary/SecretaryTools";
import TreasurerAccounts from "./components/treasurer/TreasurerAccounts";
import TreasurerTransactions from "./components/treasurer/TreasurerTransactions";
import TreasurerDonations from "./components/treasurer/TreasurerDonations";
import TreasurerExpenses from "./components/treasurer/TreasurerExpenses";
import TreasurerReports from "./components/treasurer/TreasurerReports";
import TreasurerAudit from "./components/treasurer/TreasurerAudit";
import ClergyMembers from "./components/clergy/ClergyMembers";
import ClergyEvents from "./components/clergy/ClergyEvents";
import ClergyMinistries from "./components/clergy/ClergyMinistries";
import ClergyPastoralCare from "./components/clergy/ClergyPastoralCare";
import ClergyCommunication from "./components/clergy/ClergyCommunication";
import ClergyReports from "./components/clergy/ClergyReports";
import ClergySacraments from "./components/clergy/ClergySacraments";
import ClergyGroupAssignments from "./components/clergy/ClergyGroupAssignments";
import ClergySpiritualNotes from "./components/clergy/ClergySpiritualNotes";
import SecretaryAddMember from "./components/secretary/SecretaryAddMember";
import SecretaryStatusUpdates from "./components/secretary/SecretaryStatusUpdates";
import SecretarySacraments from "./components/secretary/SecretarySacraments";
import SecretaryAttendanceRecords from "./components/secretary/SecretaryAttendanceRecords";
import SecretaryManageEvents from "./components/secretary/SecretaryManageEvents";
import SecretaryRecurringEvents from "./components/secretary/SecretaryRecurringEvents";
import SecretaryAssignMembers from "./components/secretary/SecretaryAssignMembers";
import SecretaryMembershipCounts from "./components/secretary/SecretaryMembershipCounts";
import SecretaryInbox from "./components/secretary/SecretaryInbox";
import SecretaryOutbox from "./components/secretary/SecretaryOutbox";
import SecretaryBulkSend from "./components/secretary/SecretaryBulkSend";
import SecretaryCounselingSessions from "./components/secretary/SecretaryCounselingSessions";
import SecretaryFollowUps from "./components/secretary/SecretaryFollowUps";
import SecretaryMembershipReports from "./components/secretary/SecretaryMembershipReports";
import SecretaryEventAttendanceReports from "./components/secretary/SecretaryEventAttendanceReports";
import SecretaryGroupActivityReports from "./components/secretary/SecretaryGroupActivityReports";
import SecretaryFinancialOverview from "./components/secretary/SecretaryFinancialOverview";
import SecretaryDocumentTemplates from "./components/secretary/SecretaryDocumentTemplates";
import SecretarySettings from "./components/secretary/SecretarySettings";
import SecretaryProfileRoleManagement from "./components/secretary/SecretaryProfileRoleManagement";
import CreateEditAccount from "./components/treasurer/CreateEditAccount";
import AccountStatus from "./components/treasurer/AccountStatus";
import ViewTransactions from "./components/treasurer/ViewTransactions";
import EditReverse from "./components/treasurer/EditReverse";
import AttachReceipts from "./components/treasurer/AttachReceipts";
import Offerings from "./components/treasurer/Offerings";
import DonorRecords from "./components/treasurer/DonorRecords";
import Receipts from "./components/treasurer/Receipts";
import RecurringExpenses from "./components/treasurer/RecurringExpenses";
import Approvals from "./components/treasurer/Approvals";
import IncomeVsExpenseReport from './components/treasurer/IncomeVsExpenseReport';
import BalancesReport from './components/treasurer/BalancesReport';
import BudgetTrackingReport from './components/treasurer/BudgetTrackingReport';
import ExportReport from './components/treasurer/ExportReport';
import TransactionLogsReport from './components/treasurer/TransactionLogsReport';
import UserAccessReport from './components/treasurer/UserAccessReport';
import BackupRestoreReport from './components/treasurer/BackupRestoreReport';
import SettingsDashboard from './pages/SettingsDashboard';
import MemberGroups from "./components/member/MemberGroups";
import SecretaryAnnouncements from './components/secretary/SecretaryAnnouncements';
import SecretaryAlerts from './components/secretary/SecretaryAlerts';
import Volunteer from './pages/Volunteer';
import ChatPage from './pages/Chat';
import EventTicketsPage from './pages/EventTickets';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test database connection
    const testConnection = async () => {
      try {
        console.log('App: Testing database connection...');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('user_roles')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error('App: Database connection error:', error);
        } else {
          console.log('App: Database connection successful');
        }

        // Test auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('App: Current session:', session, 'Error:', sessionError);

        // Test if we can query user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .limit(5);
        
        console.log('App: User roles test:', { rolesData, rolesError });
        
      } catch (error) {
        console.error('App: Database connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/confirm-email-change" element={<EmailChangeConfirmation />} />
        <Route path="/auth/reauthenticate" element={<ReauthenticationConfirmation />} />
        <Route path="/invitation/accept" element={<InvitationAccept />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/role-based-register" element={<RoleBasedRegister />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Main Welcome Route */}
              <Route path="/" element={<Welcome />} />
              
              {/* Dashboard Route - Redirects based on role */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Member Dashboard Route */}
              <Route path="/dashboard/member" element={
                <RoleBasedRoute allowedRoles={['member', 'system_admin']}>
                  <Layout><MemberDashboard /></Layout>
                </RoleBasedRoute>
              }>
                <Route path="profile" element={<UserProfile />} />
                <Route path="ministries" element={<MemberMinistries />} />
                <Route path="attendance" element={<MemberAttendance />} />
                <Route path="giving" element={<MemberGiving />} />
                <Route path="pastoral" element={<MemberPastoralCare />} />
                <Route path="messages" element={<MemberMessages />} />
                <Route path="settings" element={<MemberSettings />} />
              </Route>
              
              {/* Member Groups Route */}
              <Route path="/member/groups" element={
                <RoleBasedRoute allowedRoles={['member', 'system_admin']}>
                  <Layout><MemberGroups /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Role-based Dashboard Routes */}
              <Route path="/admin-dashboard" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><AdminDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/account-activation" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><AccountActivation /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/admin/user-management" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserManagement /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/system-dashboard" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/treasurer-dashboard" element={
                <RoleBasedRoute allowedRoles={['treasurer', 'system_admin']}>
                  <Layout><TreasurerDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/dashboard/treasurer" element={
                <RoleBasedRoute allowedRoles={['treasurer', 'system_admin']}>
                  <Layout><TreasurerDashboard /></Layout>
                </RoleBasedRoute>
              }>
                <Route path="accounts" element={<TreasurerAccounts />} />
                <Route path="accounts/create" element={<CreateEditAccount />} />
                <Route path="accounts/status" element={<AccountStatus />} />

                <Route path="transactions" element={<TreasurerTransactions />} />
                <Route path="transactions/view" element={<ViewTransactions />} />
                <Route path="transactions/edit" element={<EditReverse />} />
                <Route path="transactions/receipts" element={<AttachReceipts />} />

                <Route path="donations" element={<TreasurerDonations />} />
                <Route path="donations/offerings" element={<Offerings />} />
                <Route path="donations/donors" element={<DonorRecords />} />
                <Route path="donations/receipts" element={<Receipts />} />

                <Route path="expenses" element={<TreasurerExpenses />} />
                <Route path="expenses/recurring" element={<RecurringExpenses />} />
                <Route path="expenses/approvals" element={<Approvals />} />

                <Route path="reports" element={<TreasurerReports />} />
                <Route path="reports/income-expense" element={<IncomeVsExpenseReport />} />
                <Route path="reports/income" element={<IncomeVsExpenseReport />} />
                <Route path="reports/balances" element={<BalancesReport />} />
                <Route path="reports/budget" element={<BudgetTrackingReport />} />
                <Route path="reports/export" element={<ExportReport />} />

                <Route path="audit" element={<TreasurerAudit />} />
                <Route path="audit/logs" element={<TransactionLogsReport />} />
                <Route path="audit/users" element={<UserAccessReport />} />
                <Route path="audit/backup" element={<BackupRestoreReport />} />
              </Route>
              <Route path="/secretary-dashboard" element={
                <RoleBasedRoute allowedRoles={['secretary', 'system_admin']}>
                  <Layout><SecretaryDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/dashboard/secretary" element={
                <RoleBasedRoute allowedRoles={['secretary', 'system_admin']}>
                  <Layout><SecretaryDashboard /></Layout>
                </RoleBasedRoute>
              }>
                {/* Members */}
                <Route path="members" element={<SecretaryMembers />} />
                <Route path="members/add" element={<SecretaryAddMember />} />
                <Route path="members/status" element={<SecretaryStatusUpdates />} />
                <Route path="members/sacraments" element={<SecretarySacraments />} />
                {/* Events & Scheduling */}
                <Route path="events" element={<SecretaryEvents />} />
                <Route path="events/manage" element={<SecretaryManageEvents />} />
                <Route path="events/attendance" element={<SecretaryAttendanceRecords />} />
                <Route path="events/recurring" element={<SecretaryRecurringEvents />} />
                {/* Ministries */}
                <Route path="ministries" element={<SecretaryMinistries />} />
                <Route path="ministries/assign" element={<SecretaryAssignMembers />} />
                <Route path="ministries/counts" element={<SecretaryMembershipCounts />} />
                {/* Communication */}
                <Route path="communication" element={<SecretaryCommunication />} />
                <Route path="communication/inbox" element={<SecretaryInbox />} />
                <Route path="communication/outbox" element={<SecretaryOutbox />} />
                <Route path="communication/bulk" element={<SecretaryBulkSend />} />
                {/* Pastoral Care */}
                <Route path="pastoral" element={<SecretaryPastoralCare />} />
                <Route path="pastoral/counseling" element={<SecretaryCounselingSessions />} />
                <Route path="pastoral/followups" element={<SecretaryFollowUps />} />
                {/* Reports */}
                <Route path="reports/membership" element={<SecretaryMembershipReports />} />
                <Route path="reports/events" element={<SecretaryEventAttendanceReports />} />
                <Route path="reports/groups" element={<SecretaryGroupActivityReports />} />
                <Route path="reports/finances" element={<SecretaryFinancialOverview />} />
                {/* Tools */}
                <Route path="tools/templates" element={<SecretaryDocumentTemplates />} />
                <Route path="tools/settings" element={<SecretarySettings />} />
                <Route path="tools/roles" element={<SecretaryProfileRoleManagement />} />
                <Route path="announcements" element={<SecretaryAnnouncements />} />
                <Route path="alerts" element={<SecretaryAlerts />} />
              </Route>
              <Route path="/clergy-dashboard" element={
                <RoleBasedRoute allowedRoles={['clergy', 'system_admin']}>
                  <Layout><ClergyDashboard /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/dashboard/clergy" element={
                <RoleBasedRoute allowedRoles={['clergy', 'system_admin']}>
                  <Layout><ClergyDashboard /></Layout>
                </RoleBasedRoute>
              }>
                {/* Members */}
                <Route path="members" element={<ClergyMembers />} />
                <Route path="members/sacraments" element={<ClergySacraments />} />
                <Route path="members/groups" element={<ClergyGroupAssignments />} />
                <Route path="members/notes" element={<ClergySpiritualNotes />} />
                {/* Pastoral Care */}
                <Route path="pastoral" element={<ClergyPastoralCare />} />
                <Route path="pastoral/history" element={<div>Care History (TODO)</div>} />
                <Route path="pastoral/counseling" element={<div>Counseling Sessions (TODO)</div>} />
                <Route path="pastoral/followups" element={<div>Follow-Ups (TODO)</div>} />
                {/* Ministries */}
                <Route path="ministries" element={<ClergyMinistries />} />
                <Route path="ministries/leaders" element={<div>Assign Leaders (TODO)</div>} />
                <Route path="ministries/growth" element={<div>Track Growth (TODO)</div>} />
                <Route path="ministries/activities" element={<div>Group Activities (TODO)</div>} />
                {/* Events & Services */}
                <Route path="events" element={<ClergyEvents />} />
                <Route path="events/services" element={<div>Service Details (TODO)</div>} />
                <Route path="events/attendance" element={<div>Attendance Monitoring (TODO)</div>} />
                <Route path="events/reports" element={<div>Event Reports (TODO)</div>} />
                {/* Communication */}
                <Route path="communication" element={<ClergyCommunication />} />
                <Route path="communication/messages" element={<div>Messages (TODO)</div>} />
                <Route path="communication/alerts" element={<div>Urgent Alerts (TODO)</div>} />
                {/* Reports & Insights */}
                <Route path="reports/growth" element={<div>Member Growth Reports (TODO)</div>} />
                <Route path="reports/attendance" element={<div>Attendance Trends (TODO)</div>} />
                <Route path="reports/pastoral" element={<div>Pastoral Care Stats (TODO)</div>} />
                <Route path="reports/engagement" element={<div>Ministry Engagement (TODO)</div>} />
              </Route>
              <Route path="/user-dashboard" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><UserDashboard /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Settings Routes - Admin Only */}
              <Route path="/church-info" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><ChurchSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/system-overview" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SystemSettings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/users" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserManagement /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/backup" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><BackupSettings /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Security Routes - Admin Only */}
              <Route path="/security-overview" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SecurityOverview /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/access-control" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><UserAccessControl /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/data-protection" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><DataProtection /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/security-logs" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><SecurityLogs /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/checkin-security" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><CheckInSecurity /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/integrations" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><IntegrationSettings /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* User Profile - All authenticated users */}
              <Route path="/profile" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><UserProfile /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Notifications - All authenticated users */}
              <Route path="/notifications" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><NotificationCenter /></Layout>
                </RoleBasedRoute>
              } />
              
              {/* Main Module Routes */}
              <Route path="/members" element={
                <RoleBasedRoute allowedRoles={['clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Members /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/events" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Events /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/finances" element={
                <RoleBasedRoute allowedRoles={['treasurer', 'system_admin']}>
                  <Layout><Finances /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/communication" element={
                <RoleBasedRoute allowedRoles={['clergy', 'secretary', 'system_admin']}>
                  <Layout><Communication /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/reports" element={
                <RoleBasedRoute allowedRoles={['clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Reports /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/settings" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><Settings /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/security" element={
                <RoleBasedRoute allowedRoles={['system_admin']}>
                  <Layout><Security /></Layout>
                </RoleBasedRoute>
              } />
              <Route path="/settings-dashboard" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><SettingsDashboard /></Layout>
                </RoleBasedRoute>
              } />

              <Route path="/prayers" element={<PrayerRequests />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/event-tickets" element={<EventTicketsPage />} />

              <Route path="/ministry" element={
                <RoleBasedRoute allowedRoles={['member', 'clergy', 'treasurer', 'secretary', 'system_admin']}>
                  <Layout><Ministry /></Layout>
                </RoleBasedRoute>
              } />

              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;