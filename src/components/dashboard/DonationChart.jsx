
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const data = [
  { month: 'Jan', tithes: 4000, offerings: 2400, campaigns: 1200 },
  { month: 'Feb', tithes: 3000, offerings: 1398, campaigns: 800 },
  { month: 'Mar', tithes: 2000, offerings: 9800, campaigns: 2000 },
  { month: 'Apr', tithes: 2780, offerings: 3908, campaigns: 1800 },
  { month: 'May', tithes: 1890, offerings: 4800, campaigns: 1700 },
  { month: 'Jun', tithes: 2390, offerings: 3800, campaigns: 1500 },
  { month: 'Jul', tithes: 3490, offerings: 4300, campaigns: 2100 },
  { month: 'Aug', tithes: 3190, offerings: 4300, campaigns: 2200 },
  { month: 'Sep', tithes: 4200, offerings: 3800, campaigns: 1900 },
  { month: 'Oct', tithes: 5400, offerings: 4300, campaigns: 2400 },
  { month: 'Nov', tithes: 6100, offerings: 5500, campaigns: 3000 },
  { month: 'Dec', tithes: 7200, offerings: 6300, campaigns: 4100 },
];

const DonationChart = () => {
  const [timeframe, setTimeframe] = useState('annual');
  
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
      </CardContent>
    </Card>
  );
};

export default DonationChart;
