
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Shield, Users, DollarSign, FileText, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const roleOptions = [
  {
    value: 'system_admin',
    label: 'System Administrator',
    description: 'Full system access and management capabilities',
    icon: <Shield className="h-8 w-8" />,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    value: 'clergy',
    label: 'Clergy',
    description: 'Religious leadership and pastoral care functions',
    icon: <Church className="h-8 w-8" />,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    value: 'treasurer',
    label: 'Treasurer',
    description: 'Financial management and accounting functions',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    value: 'secretary',
    label: 'Secretary',
    description: 'Administrative tasks and member management',
    icon: <FileText className="h-8 w-8" />,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    value: 'member',
    label: 'Member',
    description: 'Basic member access and personal functions',
    icon: <User className="h-8 w-8" />,
    color: 'bg-gray-500 hover:bg-gray-600'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user already has a role, redirect to appropriate dashboard
    if (role && !roleLoading) {
      const dashboardRoutes = {
        system_admin: '/admin-dashboard',
        clergy: '/clergy-dashboard',
        treasurer: '/treasurer-dashboard',
        secretary: '/secretary-dashboard',
        member: '/user-dashboard'
      };
      
      const targetRoute = dashboardRoutes[role];
      if (targetRoute) {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [role, roleLoading, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    toast({
      title: "Role Selection",
      description: `You have selected ${selectedRole.replace('_', ' ')} role. Redirecting to dashboard...`,
    });

    // Simulate role assignment and redirect
    setTimeout(() => {
      const dashboardRoutes = {
        system_admin: '/admin-dashboard',
        clergy: '/clergy-dashboard',
        treasurer: '/treasurer-dashboard',
        secretary: '/secretary-dashboard',
        member: '/user-dashboard'
      };

      const targetRoute = dashboardRoutes[selectedRole];
      navigate(targetRoute, { replace: true });
    }, 1000);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">
              Welcome to Living Rock Church
            </CardTitle>
          </div>
          <p className="text-gray-600">
            Please select your role to continue to your dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <Card
                key={role.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.value
                    ? 'ring-2 ring-xiracom-blue bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedRole(role.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full text-white ${role.color}`}>
                      {role.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{role.label}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleRoleSelection}
              disabled={!selectedRole || isLoading}
              className="bg-xiracom-blue hover:bg-xiracom-darkblue px-8"
            >
              {isLoading ? "Assigning Role..." : "Continue to Dashboard"}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your role can be changed later by a system administrator</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelection;
