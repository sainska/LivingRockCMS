import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SocialLogin from "@/components/auth/SocialLogin";
import MagicLink from "@/components/auth/MagicLink";
import TwoFactorAuth from "@/components/auth/TwoFactorAuth";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Auth = () => {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    resetPassword,
    checkEmailExists,
    checkPhoneExists,
    checkUserActivation,
    sendMagicLink,
    send2FACode,
    verify2FACode,
    getUserRole,
    getDashboardRoute,
  } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: "",
    city: "",
    country: "Kenya",
    emergencyContactName: "",
    emergencyContactPhone: "",
    baptismDate: "",
    confirmationDate: "",
    occupation: "",
    notes: ""
  });
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorMethod, setTwoFactorMethod] = useState("email"); // "email" or "phone"
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [pendingLogin, setPendingLogin] = useState(null);

  // Debounced email check
  const debouncedEmailCheck = React.useCallback(
    debounce(async (email) => {
      if (email && email.includes('@')) {
        setIsCheckingEmail(true);
        const exists = await checkEmailExists(email);
        setEmailExists(exists);
        setIsCheckingEmail(false);
      } else {
        setEmailExists(false);
      }
    }, 500),
    [checkEmailExists]
  );

  // Debounced phone check
  const debouncedPhoneCheck = React.useCallback(
    debounce(async (phone) => {
      if (phone && phone.length >= 10) {
        setIsCheckingPhone(true);
        const exists = await checkPhoneExists(phone);
        setPhoneExists(exists);
        setIsCheckingPhone(false);
      } else {
        setPhoneExists(false);
      }
    }, 500),
    [checkPhoneExists]
  );

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setRegisterData(prev => ({ ...prev, email }));
    debouncedEmailCheck(email);
  };

  // Handle phone change with validation
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setRegisterData(prev => ({ ...prev, phone }));
    debouncedPhoneCheck(phone);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('🔍 Login attempt started...');
    console.log('📧 Email:', loginEmail);
    console.log('🔑 Password entered:', loginPassword ? 'Yes' : 'No');

    try {
      // First, attempt to sign in with email and password
      const { data, error } = await signIn(loginEmail, loginPassword);
      
      console.log('🔐 Sign in result:', { data: !!data, error: error?.message });
      
      if (error) {
        console.log('❌ Sign in failed:', error.message);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log('✅ Sign in successful, checking 2FA status...');

      // If login successful, check if 2FA is enabled for this user
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('two_factor_enabled, phone')
        .eq('email', loginEmail)
        .single();

      console.log('👤 User profile check:', { 
        userProfile: !!userProfile, 
        error: profileError?.message,
        twoFactorEnabled: userProfile?.two_factor_enabled,
        hasPhone: !!userProfile?.phone
      });

      if (profileError) {
        console.error('❌ Error checking 2FA status:', profileError);
        // Continue with normal login if we can't check 2FA status
        console.log('🔄 Continuing with normal login due to profile error...');
        const userRole = await getUserRole();
        if (userRole) {
          const dashboardRoute = getDashboardRoute(userRole);
          navigate(dashboardRoute);
        } else {
          navigate("/user-dashboard");
        }
        setIsLoading(false);
        return;
      }

      if (userProfile?.two_factor_enabled) {
        console.log('🔐 2FA is enabled, showing 2FA form...');
        // Store pending login and show 2FA form
        setPendingLogin({ email: loginEmail, password: loginPassword, userProfile });
        setShow2FA(true);
        setIsLoading(false);
        return;
      }

      console.log('✅ 2FA not enabled, proceeding with normal login...');
      // If 2FA not enabled, proceed with normal login
      const userRole = await getUserRole();
      if (userRole) {
        const dashboardRoute = getDashboardRoute(userRole);
        navigate(dashboardRoute);
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send 2FA code based on selected method
      const { error: sendError } = await send2FACode(
        pendingLogin.email, 
        pendingLogin.userProfile?.phone, 
        twoFactorMethod
      );

      if (sendError) {
        setIsLoading(false);
        return;
      }

      // Wait for user to enter code
      toast({
        title: "2FA Code Sent",
        description: `Verification code sent to your ${twoFactorMethod}.`,
      });
    } catch (error) {
      console.error('2FA send error:', error);
      toast({
        title: "2FA Failed",
        description: "Failed to send verification code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify the 2FA code
      const { data, error } = await verify2FACode(
        pendingLogin.email,
        pendingLogin.userProfile?.phone,
        twoFactorCode,
        twoFactorMethod
      );

      if (error) {
        setIsLoading(false);
        return;
      }

      // 2FA successful, complete login
      const userRole = await getUserRole();
      if (userRole) {
        const dashboardRoute = getDashboardRoute(userRole);
        navigate(dashboardRoute);
      } else {
        navigate("/user-dashboard");
      }

      // Reset 2FA state
      setShow2FA(false);
      setTwoFactorCode("");
      setPendingLogin(null);
    } catch (error) {
      console.error('2FA verification error:', error);
      toast({
        title: "2FA Verification Failed",
        description: "Failed to verify code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!registerData.firstName.trim() || !registerData.lastName.trim() || !registerData.email.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields (marked with *).",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email already exists
    if (emailExists) {
      toast({
        title: "Email Already Exists",
        description: "This email address is already registered. Please use a different email or try logging in.",
        variant: "destructive",
      });
      return;
    }

    // Check if phone number already exists (if provided)
    if (registerData.phone && phoneExists) {
      toast({
        title: "Phone Number Already Exists",
        description: "This phone number is already registered. Please use a different phone number.",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (registerData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Final email check before registration
    const finalEmailCheck = await checkEmailExists(registerData.email);
    if (finalEmailCheck) {
      toast({
        title: "Email Already Exists",
        description: "This email address is already registered. Please use a different email or try logging in.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Final phone check before registration (if phone provided)
    if (registerData.phone) {
      const finalPhoneCheck = await checkPhoneExists(registerData.phone);
      if (finalPhoneCheck) {
        toast({
          title: "Phone Number Already Exists",
          description: "This phone number is already registered. Please use a different phone number.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }
    
    // Prepare additional profile data
    const additionalData = {
      phone: registerData.phone || null,
      date_of_birth: registerData.dateOfBirth || null,
      gender: registerData.gender || null,
      marital_status: registerData.maritalStatus || null,
      address: registerData.address || null,
      city: registerData.city || null,
      country: registerData.country || null,
      emergency_contact_name: registerData.emergencyContactName || null,
      emergency_contact_phone: registerData.emergencyContactPhone || null,
      baptism_date: registerData.baptismDate || null,
      confirmation_date: registerData.confirmationDate || null,
      occupation: registerData.occupation || null,
      notes: registerData.notes || null
    };

    const { error } = await signUp(
      registerData.email,
      registerData.password,
      registerData.firstName,
      registerData.lastName,
      additionalData
    );
    
    if (!error) {
      setActiveTab("login");
      // Reset form data
      setRegisterData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        maritalStatus: "",
        address: "",
        city: "",
        country: "Kenya",
        emergencyContactName: "",
        emergencyContactPhone: "",
        baptismDate: "",
        confirmationDate: "",
        occupation: "",
        notes: ""
      });
      setEmailExists(false);
      setPhoneExists(false);
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail || !resetEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (!error) {
        // Clear the email field on success
        setResetEmail("");
        // Switch back to login tab after successful reset request
        setActiveTab("login");
      }
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
    setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-yellow-400 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
      <div className="absolute top-40 right-30 w-16 h-16 bg-green-500 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
      <div className="absolute bottom-30 left-50 w-12 h-12 bg-orange-500 rounded-full opacity-10 animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
      
      {/* Additional floating elements for more dynamic background */}
      <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-purple-400 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-pink-400 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-6 h-6 bg-blue-400 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '5s' }}></div>
      
      <Card className="w-full max-w-2xl relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">
              Living Rock Church
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">Church Management System</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
              <TabsTrigger value="reset">Reset Password</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {!show2FA ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail">Email Address</Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              ) : (
                <TwoFactorAuth
                  email={pendingLogin?.email}
                  method={twoFactorMethod}
                  userName={pendingLogin?.userProfile ? `${pendingLogin.userProfile.first_name} ${pendingLogin.userProfile.last_name}` : pendingLogin?.email?.split('@')[0]}
                  onVerificationSuccess={async () => {
                    const userRole = await getUserRole();
                    if (userRole) {
                      const dashboardRoute = getDashboardRoute(userRole);
                      navigate(dashboardRoute);
                    } else {
                      navigate("/user-dashboard");
                    }
                  }}
                  onBack={() => {
                        setShow2FA(false);
                        setTwoFactorCode("");
                        setPendingLogin(null);
                      }}
                />
              )}

              <SocialLogin 
                onSuccess={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  const userRole = await getUserRole();
                  if (userRole) {
                    const dashboardRoute = getDashboardRoute(userRole);
                    navigate(dashboardRoute);
                  } else {
                    navigate("/user-dashboard");
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="magic" className="space-y-4">
              <MagicLink 
                allowSignUp={false}
                onSuccess={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  const userRole = await getUserRole();
                  if (userRole) {
                    const dashboardRoute = getDashboardRoute(userRole);
                    navigate(dashboardRoute);
                  } else {
                    navigate("/user-dashboard");
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={registerData.firstName}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={registerData.lastName}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={handleEmailChange}
                        required
                        disabled={isLoading}
                        className={`${emailExists ? 'border-red-500' : ''} ${isCheckingEmail ? 'border-yellow-500' : ''}`}
                      />
                      {isCheckingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {emailExists && !isCheckingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      {!emailExists && registerData.email && !isCheckingEmail && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {isCheckingEmail && (
                      <p className="text-sm text-blue-600 flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        Checking email availability...
                      </p>
                    )}
                    {emailExists && !isCheckingEmail && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Email already in use. Please use a different email or try logging in.
                      </p>
                    )}
                    {!emailExists && registerData.email && !isCheckingEmail && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Email is available!
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={registerData.phone}
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                        className={`${phoneExists ? 'border-red-500' : ''} ${isCheckingPhone ? 'border-yellow-500' : ''}`}
                      />
                      {isCheckingPhone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {phoneExists && !isCheckingPhone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                      {!phoneExists && registerData.phone && registerData.phone.length >= 10 && !isCheckingPhone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {isCheckingPhone && (
                      <p className="text-sm text-blue-600 flex items-center gap-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        Checking phone number availability...
                      </p>
                    )}
                    {phoneExists && !isCheckingPhone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Phone number already in use. Please use a different phone number.
                      </p>
                    )}
                    {!phoneExists && registerData.phone && registerData.phone.length >= 10 && !isCheckingPhone && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Phone number is available!
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={registerData.dateOfBirth}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <select
                        id="gender"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xiracom-blue"
                        value={registerData.gender}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, gender: e.target.value }))
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <select
                      id="maritalStatus"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xiracom-blue"
                      value={registerData.maritalStatus}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, maritalStatus: e.target.value }))
                      }
                    >
                      <option value="">Select marital status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Address Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={registerData.address}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, address: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={registerData.city}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, city: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        value={registerData.country}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, country: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Church Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Church Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baptismDate">Baptism Date</Label>
                      <Input
                        id="baptismDate"
                        type="date"
                        value={registerData.baptismDate}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, baptismDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmationDate">Confirmation Date</Label>
                      <Input
                        id="confirmationDate"
                        type="date"
                        value={registerData.confirmationDate}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, confirmationDate: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Your occupation"
                      value={registerData.occupation}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, occupation: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Emergency Contact</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      placeholder="Full name of emergency contact"
                      value={registerData.emergencyContactName}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, emergencyContactName: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={registerData.emergencyContactPhone}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password *</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                      id="notes"
                      placeholder="Any additional information you'd like to share..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xiracom-blue min-h-[80px]"
                      value={registerData.notes}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue"
                  disabled={isLoading}
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
                  {isLoading ? "Sending reset link..." : "Send Reset Link"}
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
