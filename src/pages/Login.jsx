import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual authentication logic
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock role-based redirection
      const mockUser = {
        email: formData.emailOrPhone,
        role: formData.emailOrPhone.includes("admin") ? "admin" : 
              formData.emailOrPhone.includes("clergy") ? "clergy" :
              formData.emailOrPhone.includes("treasurer") ? "treasurer" :
              formData.emailOrPhone.includes("secretary") ? "secretary" : "member"
      };

      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to your dashboard...`,
      });

      // Role-based redirection
      switch (mockUser.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'clergy':
          navigate('/dashboard/clergy');
          break;
        case 'treasurer':
          navigate('/dashboard/treasurer');
          break;
        case 'secretary':
          navigate('/dashboard/secretary');
          break;
        case 'member':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">Living Rock Church</CardTitle>
          </div>
          <p className="text-muted-foreground">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrPhone">Email or Phone Number</Label>
              <Input
                id="emailOrPhone"
                type="text"
                placeholder="Enter your email or phone"
                value={formData.emailOrPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-xiracom-blue hover:underline">
                Forgot your password?
              </Link>
              <div className="text-sm text-muted-foreground">
                New member?{" "}
                <Link to="/register" className="text-xiracom-blue hover:underline">
                  Create an account
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                <Link to="/welcome" className="text-xiracom-blue hover:underline">
                  Back to Welcome
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
