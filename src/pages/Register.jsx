
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { BasicInfoFields, PersonalDetailsFields } from "@/components/forms/UserFormFields";
import { PasswordFields } from "@/components/forms/PasswordFields";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Prepare additional data for profile
      const additionalData = {
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        role: 'member' // Default role for registration
      };

      // Call the signUp function from AuthContext
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        additionalData
      );

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Welcome to Living Rock Church! Please check your email to verify your account.",
        });
        
        // Redirect to login page after successful registration
        navigate('/auth');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Join Living Rock Church" 
      subtitle="Create your member account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicInfoFields formData={formData} setFormData={setFormData} />
        <PersonalDetailsFields formData={formData} setFormData={setFormData} />
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
            <Link to="/welcome" className="text-xiracom-blue hover:underline">
              Back to Welcome
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
