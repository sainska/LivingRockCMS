
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Church, Eye, EyeOff, User, Shield, DollarSign, FileText, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const roleConfig = {
  member: {
    title: "Member Registration",
    icon: <User className="h-6 w-6" />,
    description: "Join our church community as a member",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'address', 'password', 'confirmPassword']
  },
  clergy: {
    title: "Clergy Registration",
    icon: <Users className="h-6 w-6" />,
    description: "Register as church clergy or leadership",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'ordination', 'specialization', 'password', 'confirmPassword']
  },
  treasurer: {
    title: "Treasurer Registration",
    icon: <DollarSign className="h-6 w-6" />,
    description: "Register as church treasurer or financial staff",
    color: "text-green-600",
    bgColor: "bg-green-50",
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'experience', 'qualifications', 'password', 'confirmPassword']
  },
  secretary: {
    title: "Secretary Registration",
    icon: <FileText className="h-6 w-6" />,
    description: "Register as church secretary or administrative staff",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'experience', 'skills', 'password', 'confirmPassword']
  },
  system_admin: {
    title: "System Admin Registration",
    icon: <Shield className="h-6 w-6" />,
    description: "Register as system administrator",
    color: "text-red-600",
    bgColor: "bg-red-50",
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'techExperience', 'certifications', 'password', 'confirmPassword']
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'clergy':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="ordination">Ordination Status</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, ordination: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ordination status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordained">Ordained</SelectItem>
                  <SelectItem value="licensed">Licensed</SelectItem>
                  <SelectItem value="student">Seminary Student</SelectItem>
                  <SelectItem value="lay">Lay Leader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Ministry Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Youth Ministry, Worship, Counseling"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
              />
            </div>
          </>
        );

      case 'treasurer':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="experience">Financial Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Years of financial experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Professional Qualifications</Label>
              <Input
                id="qualifications"
                placeholder="e.g., CPA, ACCA, MBA Finance"
                value={formData.qualifications}
                onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>
          </>
        );

      case 'secretary':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="experience">Administrative Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Years of administrative experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Key Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Office Management, Record Keeping, Communication"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>
          </>
        );

      case 'system_admin':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="techExperience">Technical Experience (Years)</Label>
              <Input
                id="techExperience"
                type="number"
                placeholder="Years of IT/Systems experience"
                value={formData.techExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, techExperience: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Technical Certifications</Label>
              <Input
                id="certifications"
                placeholder="e.g., AWS, Azure, CompTIA, Cisco"
                value={formData.certifications}
                onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Church className="h-8 w-8 text-xiracom-blue" />
            <CardTitle className="text-2xl text-xiracom-blue">Living Rock Church</CardTitle>
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${currentRole.bgColor} ${currentRole.color} mb-2`}>
            {currentRole.icon}
            <span className="font-medium">{currentRole.title}</span>
          </div>
          
          <p className="text-muted-foreground">{currentRole.description}</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254700000000"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>

            {selectedRole === 'member' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </>
            )}

            {renderRoleSpecificFields()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
            </div>

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
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleBasedRegister;
