import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Calendar,
  Heart,
  BookOpen,
  Church,
  UserCheck,
  Activity,
  TrendingUp,
  MessageCircle,
  MessageSquare,
  Clock,
  MapPin
} from "lucide-react";
import MemberMessages from '../member/MemberMessages';

const ClergyDashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Clergy Dashboard</h1>
      <Outlet />
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberMessages role="clergy" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClergyDashboard;
