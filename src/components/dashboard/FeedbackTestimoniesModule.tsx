
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Heart, Send, Star, MessageCircle } from "lucide-react";

const FeedbackTestimoniesModule = () => {
  const recentFeedback = [
    {
      id: 1,
      type: "service",
      subject: "Sunday Service Feedback",
      rating: 5,
      comment: "Wonderful service today. The message was very inspiring...",
      date: "2025-01-01",
      status: "submitted"
    },
    {
      id: 2,
      type: "event",
      subject: "Youth Conference Feedback",
      rating: 4,
      comment: "Great event, would love more interactive sessions...",
      date: "2024-12-20",
      status: "reviewed"
    }
  ];

  const testimonies = [
    {
      id: 1,
      title: "God's Healing Power",
      preview: "I want to testify about God's healing in my life...",
      date: "2024-12-25",
      status: "published",
      views: 45
    },
    {
      id: 2,
      title: "Financial Breakthrough",
      preview: "Praise God for the breakthrough in my business...",
      date: "2024-12-15",
      status: "pending",
      views: 0
    }
  ];

  const feedbackCategories = [
    { name: "Sunday Service", icon: "⛪", count: 12 },
    { name: "Youth Ministry", icon: "👥", count: 8 },
    { name: "Church Events", icon: "📅", count: 15 },
    { name: "Facilities", icon: "🏢", count: 5 },
    { name: "Leadership", icon: "👨‍💼", count: 3 },
    { name: "General", icon: "💭", count: 7 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'reviewed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Feedback & Testimonies</h2>
        <div className="flex gap-2">
          <Button className="bg-xiracom-orange hover:bg-xiracom-lightorange">
            <Heart className="h-4 w-4 mr-2" />
            Share Testimony
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Give Feedback
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Feedback Given</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <MessageCircle className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Testimonies Shared</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Heart className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Average Rating</p>
                <p className="text-2xl font-bold">4.5</p>
              </div>
              <Star className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Views</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <FileText className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              My Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{feedback.subject}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(feedback.rating)}
                        </div>
                        <Badge variant="outline" className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{feedback.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Feedback
            </Button>
          </CardContent>
        </Card>

        {/* My Testimonies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              My Testimonies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testimonies.map((testimony) => (
                <div key={testimony.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{testimony.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(testimony.status)}>
                          {testimony.status}
                        </Badge>
                        {testimony.views > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {testimony.views} views
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{testimony.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{testimony.preview}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    {testimony.status === 'published' && (
                      <Button size="sm" variant="outline">
                        Share
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {feedbackCategories.map((category, index) => (
              <div key={index} className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-2xl mb-2">{category.icon}</div>
                <p className="font-semibold text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count} feedback</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Submit Feedback */}
            <div className="p-6 border rounded-lg">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-xiracom-blue mb-4" />
                <h3 className="font-semibold mb-2">Submit Feedback</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your thoughts about our services and events
                </p>
                <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                  Give Feedback
                </Button>
              </div>
            </div>

            {/* Share Testimony */}
            <div className="p-6 border rounded-lg">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto text-xiracom-orange mb-4" />
                <h3 className="font-semibold mb-2">Share Testimony</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tell others about God's goodness in your life
                </p>
                <Button className="bg-xiracom-orange hover:bg-xiracom-lightorange">
                  Share Testimony
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle>Request Follow-up or Counseling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Need prayer, counseling, or want to speak with a pastor?
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline">
                Request Prayer
              </Button>
              <Button variant="outline">
                Book Counseling
              </Button>
              <Button className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                Contact Pastor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackTestimoniesModule;
