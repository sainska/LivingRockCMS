
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle, roleInfo = null }) => {
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
            <CardTitle className="text-2xl text-xiracom-blue">Living Rock Church</CardTitle>
          </div>
          
          {roleInfo && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${roleInfo.bgColor} ${roleInfo.color} mb-2`}>
              {roleInfo.icon}
              <span className="font-medium">{roleInfo.title}</span>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </CardHeader>
        
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
