
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, Users, Calendar, DollarSign, Shield, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue">
      {/* Header */}
      <header className="p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Church className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Living Rock Church</h1>
          </div>
          <Link to="/auth">
            <Button variant="secondary" className="bg-white text-xiracom-blue hover:bg-gray-100">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl font-bold mb-6">
            Church Management<br />Made Simple
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Streamline your church operations with our comprehensive management system.
            From member management to financial tracking, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-xiracom-blue hover:bg-gray-100">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Manage Your Church
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Users className="h-10 w-10 mb-4 text-white" />
                <CardTitle>Member Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Keep track of all church members, their contact information, 
                  involvement in ministries, and spiritual journey.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Calendar className="h-10 w-10 mb-4 text-white" />
                <CardTitle>Event Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Organize church events, track attendance, and manage 
                  registrations with our integrated event management system.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <DollarSign className="h-10 w-10 mb-4 text-white" />
                <CardTitle>Financial Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Track donations, manage church finances, generate reports, 
                  and maintain transparent financial records.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Shield className="h-10 w-10 mb-4 text-white" />
                <CardTitle>Security & Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Role-based access control ensures that sensitive information 
                  is protected and accessible only to authorized personnel.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Settings className="h-10 w-10 mb-4 text-white" />
                <CardTitle>System Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Comprehensive admin tools for managing users, system settings, 
                  backups, and maintaining the overall system health.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Church className="h-10 w-10 mb-4 text-white" />
                <CardTitle>Ministry Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Organize different ministries, track member involvement, 
                  and coordinate ministry activities effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Transform Your Church Management?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of churches already using our platform to streamline their operations.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-xiracom-blue hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center text-white/80">
          <p>© 2024 Living Rock Church Management System. Built with love for the church community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
