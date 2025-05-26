
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Calendar, DollarSign, MessageCircle } from "lucide-react";

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-xiracom-blue">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-xiracom-blue hover:text-white transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add Member</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-xiracom-blue hover:text-white transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">New Event</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-xiracom-blue hover:text-white transition-colors"
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Record Donation</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2 hover:bg-xiracom-blue hover:text-white transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs">Send Message</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
