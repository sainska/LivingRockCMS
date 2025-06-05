
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Download, Users } from "lucide-react";

const MemberProfileModule = () => {
  const memberData = {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    gender: "Male",
    membershipStatus: "Active",
    baptismDate: "2020-01-15",
    confirmationDate: "2020-03-20",
    ministries: ["Youth Ministry", "Choir"]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Member Profile</h2>
        <Button variant="outline">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-xiracom-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {memberData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div>
              <label className="font-semibold">Name:</label>
              <p>{memberData.name}</p>
            </div>
            <div>
              <label className="font-semibold">Email:</label>
              <p>{memberData.email}</p>
            </div>
            <div>
              <label className="font-semibold">Phone:</label>
              <p>{memberData.phone}</p>
            </div>
            <div>
              <label className="font-semibold">Gender:</label>
              <p>{memberData.gender}</p>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="h-5 w-5" />
              Membership Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-semibold">Status:</label>
              <Badge className="ml-2 bg-green-500">{memberData.membershipStatus}</Badge>
            </div>
            <div>
              <label className="font-semibold">Baptism Date:</label>
              <p>{memberData.baptismDate}</p>
            </div>
            <div>
              <label className="font-semibold">Confirmation Date:</label>
              <p>{memberData.confirmationDate}</p>
            </div>
            <Button className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue">
              <Download className="h-4 w-4 mr-2" />
              Download Membership Card
            </Button>
          </CardContent>
        </Card>

        {/* Ministries & Groups */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assigned Ministries & Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {memberData.ministries.map((ministry, index) => (
                <Badge key={index} variant="outline" className="text-xiracom-blue border-xiracom-blue">
                  {ministry}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberProfileModule;
