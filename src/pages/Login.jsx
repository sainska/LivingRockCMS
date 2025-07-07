
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/auth/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, getUserRole, getDashboardRoute } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login: Starting login process...');
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Login: Login failed with error:', error);
        setIsLoading(false);
        return;
      }

      console.log('Login: Login successful, getting user role...');
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user role and redirect to appropriate dashboard
      const userRole = await getUserRole();
      console.log('Login: User role retrieved:', userRole);
      
      if (userRole) {
        const dashboardRoute = getDashboardRoute(userRole);
        console.log('Login: Redirecting to dashboard:', dashboardRoute);
        navigate(dashboardRoute);
      } else {
        console.log('Login: No role found, redirecting to user dashboard');
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Login: Unexpected error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
          <Link to="/reset-password" className="text-sm text-xiracom-blue hover:underline">
            Forgot your password?
          </Link>
          <div className="text-sm text-muted-foreground">
            New to Living Rock Church?{" "}
            <Link to="/role-selection" className="text-xiracom-blue hover:underline">
              Join us
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

export default Login;
