
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, BookOpen } from "lucide-react";

const SystemMetrics = () => {
  const metrics = [
    {
      title: "Total Members",
      value: "1,248",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-xiracom-blue"
    },
    {
      title: "Monthly Giving",
      value: "KSh 485,000",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Groups",
      value: "23",
      change: "+2",
      trend: "up",
      icon: BookOpen,
      color: "text-xiracom-orange"
    },
    {
      title: "Upcoming Events",
      value: "7",
      change: "This week",
      trend: "neutral",
      icon: Calendar,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-xiracom-blue">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend !== "neutral" && (
                  <TrendIcon className={`h-3 w-3 mr-1 ${
                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                  }`} />
                )}
                <span>{metric.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SystemMetrics;
