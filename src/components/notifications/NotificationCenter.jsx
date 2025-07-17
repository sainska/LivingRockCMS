
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing,
  Check, 
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { toast } from 'sonner';

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  urgent: BellRing
};

const notificationColors = {
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  success: 'text-green-600 bg-green-50 border-green-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  urgent: 'text-purple-600 bg-purple-50 border-purple-200'
};

const NotificationCenter = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  const getTabNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications;
      case 'read':
        return readNotifications;
      default:
        return notifications;
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('All notifications marked as read');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest church activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Bell className="h-3 w-3" />
            {unreadCount} Unread
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <Badge variant="secondary">{notifications.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-2">
                Unread
                <Badge variant="secondary">{unreadCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="read" className="flex items-center gap-2">
                Read
                <Badge variant="secondary">{readNotifications.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {getTabNotifications().length > 0 ? (
                  getTabNotifications().map((notification) => {
                    const IconComponent = notificationIcons[notification.notification_type] || Info;
                    const colorClasses = notificationColors[notification.notification_type] || notificationColors.info;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg transition-all ${
                          !notification.is_read 
                            ? 'bg-blue-50/50 border-blue-200' 
                            : 'bg-muted/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${colorClasses}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {format(new Date(notification.created_at), 'MMM dd, yyyy HH:mm')}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!notification.is_read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <div className="flex items-center gap-1">
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  )}
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${colorClasses.split(' ').slice(0, 2).join(' ')}`}
                                  >
                                    {notification.notification_type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {notification.action_url && (
                              <Button variant="link" size="sm" className="h-auto p-0 mt-2">
                                View Details →
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {activeTab === 'unread' && 'No unread notifications'}
                      {activeTab === 'read' && 'No read notifications'}
                      {activeTab === 'all' && 'No notifications yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'unread' && 'All caught up! Check back later for new updates.'}
                      {activeTab === 'read' && 'Your read notifications will appear here.'}
                      {activeTab === 'all' && 'You\'ll see church updates and important announcements here.'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
