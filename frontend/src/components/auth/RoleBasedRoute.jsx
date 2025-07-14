import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  // Show loading spinner while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-xiracom-blue"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If no role assigned, redirect to welcome page
  if (!role) {
    return <Navigate to="/welcome" replace />;
  }

  // If specific roles are required and user doesn't have access
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      system_admin: '/admin/dashboard',
      clergy: '/clergy/dashboard',
      treasurer: '/treasurer/dashboard',
      secretary: '/secretary/dashboard',
      member: '/welcome',
    };

    const targetRoute = redirectTo || dashboardRoutes[role] || '/welcome';
    console.log('RoleBasedRoute: Redirecting user with role', role, 'to', targetRoute);
    return <Navigate to={targetRoute} replace />;
  }

  return children;
};

export default RoleBasedRoute; 