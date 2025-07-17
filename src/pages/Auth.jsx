import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, Eye, EyeOff, Shield, Users, DollarSign, FileText, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const roleInfo = {
  system_admin: { label: "System Admin", icon: <span>🛡️</span>, color: "red" },
  treasurer: { label: "Treasurer", icon: <span>💰</span>, color: "green" },
  secretary: { label: "Secretary", icon: <span>📝</span>, color: "blue" },
  clergy: { label: "Clergy", icon: <span>⛪</span>, color: "purple" },
  member: { label: "Member", icon: <span>👤</span>, color: "gray" },
};

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, getUserRole, getDashboardRoute } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Auth: Starting login process...');
    
    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        console.error('Auth: Login failed with error:', error);
        setIsLoading(false);
        return;
      }

      console.log('Auth: Login successful, getting user role...');
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user role and redirect to appropriate dashboard
      const userRole = await getUserRole();
      console.log('Auth: User role retrieved:', userRole);
      
      if (userRole) {
        const dashboardRoute = getDashboardRoute(userRole);
        console.log('Auth: Redirecting to dashboard:', dashboardRoute);
        navigate(dashboardRoute);
      } else {
        console.log('Auth: No role found, redirecting to user dashboard');
        // If no role assigned, default to member dashboard
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.error('Auth: Unexpected error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      registerData.email, 
      registerData.password, 
      registerData.firstName, 
      registerData.lastName
    );
    
    if (!error) {
      setActiveTab("login");
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await resetPassword(resetEmail);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">Living Rock Church</CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            Church Management System
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">Select your role to access the appropriate dashboard:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(roleInfo).map(([role, info]) => (
                    <div key={role} className={`flex items-center gap-2 p-2 rounded border ${info.color}`}>
                      {info.icon}
                      <span>{info.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
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
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email Address</Label>
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="registerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
                  disabled={isLoading || registerData.password !== registerData.confirmPassword}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="reset" className="space-y-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-4">
            <Link to="/welcome" className="text-sm text-xiracom-blue hover:underline">
              Back to Welcome
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
