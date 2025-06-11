
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Search, Share, Play, FileText } from "lucide-react";

const ResourcesMediaModule = () => {
  const recentSermons = [
    {
      id: 1,
      title: "Faith in Action",
      speaker: "Pastor John Doe",
      date: "2025-01-01",
      duration: "45:30",
      type: "video",
      views: 156
    },
    {
      id: 2,
      title: "Love Your Neighbor",
      speaker: "Pastor Mary Smith",
      date: "2024-12-25",
      duration: "38:15",
      type: "audio",
      views: 203
    },
    {
      id: 3,
      title: "Walking in Purpose",
      speaker: "Pastor Mike Johnson",
      date: "2024-12-18",
      duration: "42:00",
      type: "video",
      views: 189
    }
  ];

  const studyMaterials = [
    {
      id: 1,
      title: "New Testament Study Guide",
      type: "PDF",
      category: "Bible Study",
      size: "2.5 MB",
      downloads: 45
    },
    {
      id: 2,
      title: "Daily Devotional - January",
      type: "PDF",
      category: "Devotional",
      size: "1.8 MB",
      downloads: 78
    },
    {
      id: 3,
      title: "Prayer and Fasting Guide",
      type: "PDF",
      category: "Spiritual Growth",
      size: "1.2 MB",
      downloads: 62
    }
  ];

  const getTypeIcon = (type: string) => {
    return type === 'video' ? '🎥' : '🎵';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bible Study': return 'border-blue-500 text-blue-500';
      case 'Devotional': return 'border-green-500 text-green-500';
      case 'Spiritual Growth': return 'border-purple-500 text-purple-500';
      default: return 'border-gray-500 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-xiracom-blue">Resources & Media Library</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Categories
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Sermons</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Play className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Study Materials</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <BookOpen className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Downloads</p>
                <p className="text-2xl font-bold">185</p>
              </div>
              <Download className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Shared</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <Share className="h-6 w-6 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sermons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Recent Sermons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSermons.map((sermon) => (
              <div key={sermon.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-xiracom-blue rounded-lg flex items-center justify-center text-white text-2xl">
                  {getTypeIcon(sermon.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold">{sermon.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    By {sermon.speaker} • {sermon.date}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Duration: {sermon.duration}</span>
                    <span>Views: {sermon.views}</span>
                    <Badge variant="outline">{sermon.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-xiracom-blue hover:bg-xiracom-darkblue">
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Sermons
          </Button>
        </CardContent>
      </Card>

      {/* Study Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Materials & E-Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {studyMaterials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                    PDF
                  </div>
                  <div>
                    <h4 className="font-semibold">{material.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className={getCategoryColor(material.category)}>
                        {material.category}
                      </Badge>
                      <span>Size: {material.size}</span>
                      <span>Downloads: {material.downloads}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-xiracom-orange hover:bg-xiracom-lightorange">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Archive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="font-semibold">Search by Speaker</label>
                <Button variant="outline" className="w-full justify-start">
                  Select Speaker
                </Button>
              </div>
              <div className="space-y-2">
                <label className="font-semibold">Search by Date</label>
                <Button variant="outline" className="w-full justify-start">
                  Select Date Range
                </Button>
              </div>
              <div className="space-y-2">
                <label className="font-semibold">Search by Theme</label>
                <Button variant="outline" className="w-full justify-start">
                  Select Theme
                </Button>
              </div>
            </div>
            <Button className="w-full bg-xiracom-blue hover:bg-xiracom-darkblue">
              <Search className="h-4 w-4 mr-2" />
              Search Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle>Share Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Share className="h-6 w-6 mb-2" />
              WhatsApp
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Share className="h-6 w-6 mb-2" />
              Facebook
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Share className="h-6 w-6 mb-2" />
              Twitter
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Share className="h-6 w-6 mb-2" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesMediaModule;
