
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Church, Users, Calendar, Heart } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue via-xiracom-darkblue to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Church className="h-12 w-12" />
            <h1 className="text-4xl font-bold">Living Rock Church</h1>
          </div>
          <p className="text-xl opacity-90">Welcome to our Church Management System</p>
          <p className="text-lg opacity-75 mt-2">Building faith, community, and fellowship together</p>
        </div>

        {/* Action Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-xiracom-blue">Existing Member?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Access your dashboard, view events, manage giving, and stay connected with your church family.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue text-white py-3 text-lg"
              >
                Login to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-xiracom-blue">New Member?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center">
                Join our congregation! Create your account to participate in events, give online, and connect with others.
              </p>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline"
                className="w-full border-xiracom-blue text-xiracom-blue hover:bg-xiracom-blue hover:text-white py-3 text-lg"
              >
                Create Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center text-white">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="opacity-75">Connect with fellow believers and grow together in faith</p>
          </div>
          
          <div className="text-center text-white">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="opacity-75">Stay updated with services, conferences, and activities</p>
          </div>
          
          <div className="text-center text-white">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h3 className="text-xl font-semibold mb-2">Giving</h3>
            <p className="opacity-75">Support God's work through convenient online giving</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
