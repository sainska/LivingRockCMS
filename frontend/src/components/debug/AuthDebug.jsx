import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const AuthDebug = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Authentication Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Role Loading:</strong> {roleLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User:</strong> {user ? 'Logged In' : 'Not Logged In'}
        </div>
        {user && (
          <div>
            <strong>User ID:</strong> {user.id}
          </div>
        )}
        {user && (
          <div>
            <strong>User Email:</strong> {user.email}
          </div>
        )}
        <div>
          <strong>Session:</strong> {session ? 'Active' : 'No Session'}
        </div>
        <div>
          <strong>Role:</strong> {role || 'No Role'}
        </div>
        <div>
          <strong>Current Path:</strong> {window.location.pathname}
        </div>
      </div>
    </div>
  );
};

export default AuthDebug; 