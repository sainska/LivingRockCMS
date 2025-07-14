
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DonationChart = () => {
  const [timeframe, setTimeframe] = useState('annual');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/donations?timeframe=${timeframe}`)
      .then(res => res.json())
      .then(json => {
        setData(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [timeframe]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Donations Overview</CardTitle>
          <CardDescription>
            Breakdown of tithes, offerings, and campaign donations
          </CardDescription>
        </div>
        <Select
          defaultValue={timeframe}
          onValueChange={(value) => setTimeframe(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Last Week</SelectItem>
            <SelectItem value="monthly">Last Month</SelectItem>
            <SelectItem value="quarterly">Last Quarter</SelectItem>
            <SelectItem value="annual">Annual</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-10">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tithes" name="Tithes" fill="#0071BC" />
              <Bar dataKey="offerings" name="Offerings" fill="#F7941D" />
              <Bar dataKey="campaigns" name="Campaigns" fill="#5F9EA0" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DonationChart;
