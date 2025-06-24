import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const AuthDebug = () => {
  const { user, session, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Auth Debug Info:</h3>
      <div className="text-sm space-y-1">
        <div>User: {user ? `${user.email} (${user.id})` : 'Not authenticated'}</div>
        <div>Session: {session ? 'Active' : 'No session'}</div>
        <div>Role: {role || 'No role assigned'}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default AuthDebug; 