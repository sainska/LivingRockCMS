
import { useState } from 'react';
import { 
  User, 
  Building, 
  Lock, 
  Bell, 
  CreditCard, 
  Globe, 
  Sliders, 
  Check,
  UserPlus,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const userRoles = [
  { id: "admin", label: "Admin", description: "Full access to all settings" },
  { id: "pastor", label: "Pastor", description: "Access to ministry and member data" },
  { id: "treasurer", label: "Treasurer", description: "Access to financial data and reports" },
  { id: "secretary", label: "Secretary", description: "Access to member data and events" },
  { id: "volunteer", label: "Volunteer", description: "Limited access to assigned areas" },
];

const systemUsers = [
  { id: 1, name: "John Smith", email: "johnsmith@example.com", role: "Admin", lastActive: "Today", status: "active" },
  { id: 2, name: "Sarah Johnson", email: "sarahjohnson@example.com", role: "Pastor", lastActive: "Yesterday", status: "active" },
  { id: 3, name: "Michael Davis", email: "michaeldavis@example.com", role: "Treasurer", lastActive: "May 21, 2025", status: "active" },
  { id: 4, name: "Emily Wilson", email: "emilywilson@example.com", role: "Secretary", lastActive: "May 19, 2025", status: "active" },
  { id: 5, name: "Robert Brown", email: "robertbrown@example.com", role: "Volunteer", lastActive: "May 10, 2025", status: "inactive" },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRole, setSelectedRole] = useState("admin");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>
      
      <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
        <div className="flex border-b">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-none bg-transparent p-0">
            <TabsTrigger
              value="users"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <User className="mr-2 h-4 w-4" />
              Users & Permissions
            </TabsTrigger>
            <TabsTrigger
              value="church"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Building className="mr-2 h-4 w-4" />
              Church Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Globe className="mr-2 h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="customization"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Sliders className="mr-2 h-4 w-4" />
              Customization
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="users" className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Users & Permissions</h2>
              <p className="text-sm text-muted-foreground">
                Manage system users and their access levels
              </p>
            </div>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="font-medium">User Roles</div>
                {userRoles.map(role => (
                  <div
                    key={role.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
                      selectedRole === role.id 
                      ? 'border-xiracom-blue bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                    {selectedRole === role.id && (
                      <Check className="h-5 w-5 text-xiracom-blue" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Role Permissions</h3>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>{userRoles.find(role => role.id === selectedRole)?.label} Permissions</CardTitle>
                    <CardDescription>Configure access for this role</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <PermissionItem 
                        label="Member Management" 
                        description="Add, edit, and view member profiles"
                        defaultChecked={selectedRole === "admin" || selectedRole === "pastor" || selectedRole === "secretary"}
                      />
                      <PermissionItem 
                        label="Financial Management" 
                        description="Access to contributions and expenses"
                        defaultChecked={selectedRole === "admin" || selectedRole === "treasurer"}
                      />
                      <PermissionItem 
                        label="Event Management" 
                        description="Create and manage church events"
                        defaultChecked={selectedRole === "admin" || selectedRole === "pastor" || selectedRole === "secretary"}
                      />
                      <PermissionItem 
                        label="Communication Tools" 
                        description="Send emails, SMS, or newsletters"
                        defaultChecked={selectedRole === "admin" || selectedRole === "pastor"}
                      />
                      <PermissionItem 
                        label="Reports & Analytics" 
                        description="View and export system reports"
                        defaultChecked={selectedRole === "admin" || selectedRole === "treasurer"}
                      />
                      <PermissionItem 
                        label="System Settings" 
                        description="Modify system configuration"
                        defaultChecked={selectedRole === "admin"}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Active</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {systemUsers.map(user => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium">{user.name}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">{user.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "Admin" 
                                ? "bg-xiracom-blue text-white" 
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.lastActive}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <span 
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                user.status === "active" ? "bg-green-500" : "bg-gray-300"
                              }`}
                            />
                            <span className="text-sm">{user.status === "active" ? "Active" : "Inactive"}</span>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="church" className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Church Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your church details and information
              </p>
            </div>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">Save Changes</Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your church's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="churchName" className="text-sm font-medium">Church Name</label>
                  <Input id="churchName" defaultValue="Grace Community Church" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="churchPhone" className="text-sm font-medium">Phone Number</label>
                  <Input id="churchPhone" defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="churchEmail" className="text-sm font-medium">Email Address</label>
                  <Input id="churchEmail" defaultValue="info@gracecommunity.org" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="churchWebsite" className="text-sm font-medium">Website</label>
                  <Input id="churchWebsite" defaultValue="https://www.gracecommunity.org" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Update your church's location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="streetAddress" className="text-sm font-medium">Street Address</label>
                  <Input id="streetAddress" defaultValue="123 Faith Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <Input id="city" defaultValue="Hopeville" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">State</label>
                    <Input id="state" defaultValue="California" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="zipCode" className="text-sm font-medium">Zip Code</label>
                    <Input id="zipCode" defaultValue="90210" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium">Country</label>
                    <Input id="country" defaultValue="United States" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
                <CardDescription>Update your regular service times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="font-medium">Sunday Services</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="sundayMorning" className="text-sm font-medium">Morning Service</label>
                        <Input id="sundayMorning" defaultValue="9:00 AM - 10:30 AM" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="sundayEvening" className="text-sm font-medium">Evening Service</label>
                        <Input id="sundayEvening" defaultValue="6:00 PM - 7:30 PM" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="font-medium">Weekday Services</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="wednesdayService" className="text-sm font-medium">Wednesday</label>
                        <Input id="wednesdayService" defaultValue="7:00 PM - 8:30 PM" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="fridayService" className="text-sm font-medium">Friday</label>
                        <Input id="fridayService" defaultValue="7:00 PM - 9:00 PM" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="pt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage security and privacy settings for your church management system
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>Configure password requirements for users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="minLength" defaultChecked />
                  <label
                    htmlFor="minLength"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Minimum 8 characters required
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="specialChar" defaultChecked />
                  <label
                    htmlFor="specialChar"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require special characters
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="upperLower" defaultChecked />
                  <label
                    htmlFor="upperLower"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require uppercase and lowercase letters
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers" defaultChecked />
                  <label
                    htmlFor="numbers"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require numbers
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="expiration" />
                  <label
                    htmlFor="expiration"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Password expires after 90 days
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Configure 2FA requirements for user accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="require2fa" />
                  <label
                    htmlFor="require2fa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require 2FA for all users
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="require2faAdmin" defaultChecked />
                  <label
                    htmlFor="require2faAdmin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require 2FA for admin accounts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allow2faSMS" defaultChecked />
                  <label
                    htmlFor="allow2faSMS"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Allow SMS as 2FA method
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allow2faEmail" defaultChecked />
                  <label
                    htmlFor="allow2faEmail"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Allow email as 2FA method
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="allow2faApp" defaultChecked />
                  <label
                    htmlFor="allow2faApp"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Allow authenticator apps
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Settings</CardTitle>
                <CardDescription>Configure user session behaviors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session timeout (minutes)</label>
                  <Input type="number" defaultValue="30" min="5" max="120" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="forceLogout" defaultChecked />
                  <label
                    htmlFor="forceLogout"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Force logout after inactivity
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="concurrentSessions" />
                  <label
                    htmlFor="concurrentSessions"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Allow concurrent sessions
                  </label>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
                <CardDescription>Configure data security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="dataEncryption" defaultChecked />
                  <label
                    htmlFor="dataEncryption"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable database encryption
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sslConnection" defaultChecked />
                  <label
                    htmlFor="sslConnection"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Require SSL for all connections
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auditLogs" defaultChecked />
                  <label
                    htmlFor="auditLogs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable audit logging
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data retention period (days)</label>
                  <Input type="number" defaultValue="365" min="30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Coming Soon: Configure system and user notifications</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Bell className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-500">Notification Settings Coming Soon</h3>
                <p className="mt-1 text-gray-400">This section is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Coming Soon: Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <CreditCard className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-500">Billing Settings Coming Soon</h3>
                <p className="mt-1 text-gray-400">This section is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Coming Soon: Connect with third-party services</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-500">Integrations Coming Soon</h3>
                <p className="mt-1 text-gray-400">This section is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customization" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customization</CardTitle>
              <CardDescription>Coming Soon: Customize your system appearance</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Sliders className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-500">Customization Settings Coming Soon</h3>
                <p className="mt-1 text-gray-400">This section is under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PermissionItem = ({ label, description, defaultChecked = false }) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox id={label} defaultChecked={defaultChecked} />
      <div>
        <label
          htmlFor={label}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {label}
        </label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

export default Settings;
