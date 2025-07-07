
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church } from "lucide-react";

export const AuthLayout = ({ children, title, subtitle, roleInfo = null }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xiracom-blue to-xiracom-darkblue flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
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
