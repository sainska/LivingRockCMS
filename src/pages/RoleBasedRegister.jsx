
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Shield, DollarSign, FileText, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BasicInfoFields, PersonalDetailsFields, RoleSpecificFields } from "@/components/forms/UserFormFields";
import { PasswordFields } from "@/components/forms/PasswordFields";

const roleConfig = {
  member: {
    title: "Member Registration",
    icon: <User className="h-6 w-6" />,
    description: "Join our church community as a member",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  clergy: {
    title: "Clergy Registration",
    icon: <Users className="h-6 w-6" />,
    description: "Register as church clergy or leadership",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  treasurer: {
    title: "Treasurer Registration",
    icon: <DollarSign className="h-6 w-6" />,
    description: "Register as church treasurer or financial staff",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  secretary: {
    title: "Secretary Registration",
    icon: <FileText className="h-6 w-6" />,
    description: "Register as church secretary or administrative staff",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  system_admin: {
    title: "System Admin Registration",
    icon: <Shield className="h-6 w-6" />,
    description: "Register as system administrator",
    color: "text-red-600",
    bgColor: "bg-red-50",
  }
};

const RoleBasedRegister = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role') || 'member';
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    // Role-specific fields
    ordination: "",
    specialization: "",
    experience: "",
    qualifications: "",
    skills: "",
    techExperience: "",
    certifications: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const currentRole = roleConfig[selectedRole] || roleConfig.member;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (!error) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={currentRole.title}
      subtitle={currentRole.description}
      roleInfo={currentRole}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicInfoFields formData={formData} setFormData={setFormData} />
        
        {selectedRole === 'member' && (
          <PersonalDetailsFields formData={formData} setFormData={setFormData} />
        )}

        <RoleSpecificFields 
          role={selectedRole} 
          formData={formData} 
          setFormData={setFormData} 
        />

        <PasswordFields formData={formData} setFormData={setFormData} />

        <Button
          type="submit"
          className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-xiracom-blue hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link to="/role-selection" className="text-xiracom-blue hover:underline">
              Choose a different role
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link to="/welcome" className="text-xiracom-blue hover:underline">
              Back to Welcome
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RoleBasedRegister;
