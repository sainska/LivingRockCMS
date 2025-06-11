
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, BookOpen, HandHeart } from "lucide-react";

const SpiritualJourneyModule = () => {
  const milestones = [
    { event: "Baptism", date: "2020-01-15", status: "completed" },
    { event: "Confirmation", date: "2020-03-20", status: "completed" },
    { event: "Marriage", date: "2022-06-10", status: "completed" },
    { event: "Ordination", date: "", status: "pending" }
  ];

  const recentNotes = [
    {
      id: 1,
      title: "Faith in Action",
      date: "2025-01-01",
      speaker: "Pastor John",
      notes: "Key takeaway: Faith without works is dead..."
    },
    {
      id: 2,
      title: "Love Your Neighbor",
      date: "2024-12-25",
      speaker: "Pastor Mary",
      notes: "Love is the greatest commandment..."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Spiritual Journey</h2>
        <Button variant="outline">
          <HandHeart className="h-4 w-4 mr-2" />
          Submit Prayer Request
        </Button>
      </div>

      {/* Spiritual Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Spiritual Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <p className="font-semibold">{milestone.event}</p>
                    {milestone.date && (
                      <p className="text-sm text-muted-foreground">{milestone.date}</p>
                    )}
                  </div>
                </div>
                <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                  {milestone.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sermon Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Sermon Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{note.title}</h4>
                  <span className="text-sm text-muted-foreground">{note.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Speaker: {note.speaker}</p>
                <p className="text-sm">{note.notes}</p>
                <Button size="sm" variant="outline" className="mt-2">
                  View Full Notes
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" variant="outline">
            View All Notes Archive
          </Button>
        </CardContent>
      </Card>

      {/* Prayer Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeart className="h-5 w-5" />
            Prayer Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <HandHeart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Share your prayer requests with the church family</p>
            <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
              Submit Prayer Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiritualJourneyModule;
