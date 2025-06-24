import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Users,
  Prayer,
  AlertCircle,
  Info,
  CheckCircle
} from "lucide-react";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'event',
      title: 'Sunday Service Reminder',
      message: 'Don\'t forget about this Sunday\'s service at 9:00 AM. We\'ll be continuing our series on "Walking in Faith".',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'donation',
      title: 'Donation Received',
      message: 'Thank you for your generous donation of KES 5,000. Your contribution helps support our ministry.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'prayer',
      title: 'Prayer Request Update',
      message: 'Your prayer request for healing has been shared with the prayer team. We\'re praying for you.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'ministry',
      title: 'Youth Ministry Meeting',
      message: 'Youth ministry meeting scheduled for tomorrow at 6:00 PM. All youth leaders are encouraged to attend.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      read: false,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. The system may be temporarily unavailable.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: true,
      priority: 'low'
    },
    {
      id: '6',
      type: 'success',
      title: 'Account Verified',
      message: 'Your account has been successfully verified. You now have full access to all features.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: 'low'
    }
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    eventReminders: true,
    prayerRequests: true,
    donationReceipts: true,
    ministryUpdates: true,
    systemAlerts: false
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event': return Calendar;
      case 'donation': return DollarSign;
      case 'prayer': return Prayer;
      case 'ministry': return Users;
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return X;
      default: return Info;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event': return 'text-blue-600 bg-blue-50';
      case 'donation': return 'text-green-600 bg-green-50';
      case 'prayer': return 'text-purple-600 bg-purple-50';
      case 'ministry': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      // Navigate to the action URL
      console.log('Navigating to:', notification.actionUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with church activities and important information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notification List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount}</Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('read')}
                  >
                    Read
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-white border-blue-200 shadow-sm'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </h4>
                                  <Badge className={getPriorityColor(notification.priority)} size="sm">
                                    {notification.priority}
                                  </Badge>
                                </div>
                                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatTimeAgo(notification.timestamp)}
                                </p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Event Reminders</Label>
                      <p className="text-xs text-muted-foreground">Get reminded about upcoming events</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.eventReminders}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, eventReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Prayer Requests</Label>
                      <p className="text-xs text-muted-foreground">Receive prayer request updates</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.prayerRequests}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, prayerRequests: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Donation Receipts</Label>
                      <p className="text-xs text-muted-foreground">Receive donation confirmations</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.donationReceipts}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, donationReceipts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Ministry Updates</Label>
                      <p className="text-xs text-muted-foreground">Receive ministry-related updates</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.ministryUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, ministryUpdates: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">System Alerts</Label>
                      <p className="text-xs text-muted-foreground">Receive system maintenance alerts</p>
                    </div>
                    <Switch
                      checked={notificationPreferences.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationPreferences(prev => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                </div>

                <Button className="w-full">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter; 