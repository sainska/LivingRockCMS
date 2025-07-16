
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Sun, Moon, Cloud } from 'lucide-react';

const WelcomeDashboard = ({ userName, userRole }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun };
    if (hour < 17) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GreetingIcon className="h-6 w-6" />
              <h1 className="text-2xl font-bold">
                {greeting.text}, {userName}!
              </h1>
            </div>
            <p className="text-blue-100">
              Welcome to your Church Management Dashboard
            </p>
            <p className="text-sm text-blue-200">
              Role: {userRole}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{getCurrentDate()}</span>
            </div>
            <p className="text-xs text-blue-200">
              Living Rock Church Management System
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeDashboard;
