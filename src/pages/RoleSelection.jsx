
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, User, Shield, DollarSign, FileText, Users, ArrowRight } from "lucide-react";

const roles = [
  {
    id: 'member',
    title: 'Church Member',
    description: 'Join our church community as a regular member. Access member resources, events, and community features.',
    icon: <User className="h-8 w-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    hoverBg: 'hover:bg-blue-100',
    features: ['Event registration', 'Prayer requests', 'Community updates', 'Member directory']
  },
  {
    id: 'clergy',
    title: 'Clergy/Leadership',
    description: 'Register as ordained clergy or church leadership. Manage sermons, pastoral care, and ministry activities.',
    icon: <Users className="h-8 w-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    hoverBg: 'hover:bg-purple-100',
    features: ['Sermon management', 'Member oversight', 'Event planning', 'Pastoral visits']
  },
  {
    id: 'treasurer',
    title: 'Treasurer',
    description: 'Manage church finances, donations, and budgets. Handle financial reporting and accounting tasks.',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    hoverBg: 'hover:bg-green-100',
    features: ['Financial management', 'Donation tracking', 'Budget planning', 'Financial reports']
  },
  {
    id: 'secretary',
    title: 'Secretary',
    description: 'Handle administrative tasks, communications, and record keeping for the church.',
    icon: <FileText className="h-8 w-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    hoverBg: 'hover:bg-orange-100',
    features: ['Record management', 'Communications', 'Meeting minutes', 'Administrative tasks']
  },
  {
    id: 'system_admin',
    title: 'System Administrator',
    description: 'Manage the church management system, user accounts, and technical infrastructure.',
    icon: <Shield className="h-8 w-8" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    hoverBg: 'hover:bg-red-100',
    features: ['User management', 'System settings', 'Security oversight', 'Data management']
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/role-based-register?role=${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Church className="h-8 w-8 text-xiracom-blue" />
              <CardTitle className="text-3xl text-xiracom-blue">Living Rock Church</CardTitle>
            </div>
            <h2 className="text-xl font-semibold mb-2">Choose Your Role</h2>
            <p className="text-muted-foreground">
              Select the role that best describes your position or intended involvement with Living Rock Church
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 ${role.borderColor} ${role.hoverBg} ${
                    selectedRole === role.id ? `ring-2 ring-offset-2 ring-xiracom-blue ${role.bgColor}` : ''
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${role.bgColor}`}>
                      <div className={role.color}>
                        {role.icon}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-current rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedRole}
                className="bg-xiracom-blue hover:bg-xiracom-darkblue px-8 py-2 flex items-center gap-2"
              >
                Continue with Selected Role
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-xiracom-blue hover:underline">
                    Sign in
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Link to="/welcome" className="text-xiracom-blue hover:underline">
                    Back to Welcome
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
