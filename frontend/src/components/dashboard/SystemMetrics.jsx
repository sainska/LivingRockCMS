
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, BookOpen } from "lucide-react";
import { useEffect, useState } from 'react';

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/metrics/system')
      .then(res => res.json())
      .then(json => {
        setMetrics(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {loading ? (
        <div className="text-center py-10 col-span-4">Loading...</div>
      ) : metrics.length === 0 ? (
        <div className="text-center py-10 col-span-4">No data available</div>
      ) : (
        metrics.map((metric, index) => {
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
        })
      )}
    </div>
  );
};

export default SystemMetrics;
