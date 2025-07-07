import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Mail, Phone, DollarSign, Calendar, MessageCircle, Settings, CheckCircle, AlertTriangle } from "lucide-react";

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'email',
      name: 'Email Service',
      description: 'Send notifications and newsletters via email',
      icon: Mail,
      enabled: true,
      configured: true,
      provider: 'SendGrid',
      status: 'Connected'
    },
    {
      id: 'sms',
      name: 'SMS Service',
      description: 'Send SMS notifications and alerts',
      icon: Phone,
      enabled: false,
      configured: false,
      provider: 'Twilio',
      status: 'Not Configured'
    },
    {
      id: 'payment',
      name: 'Payment Gateway',
      description: 'Accept online donations and payments',
      icon: DollarSign,
      enabled: true,
      configured: true,
      provider: 'Stripe',
      status: 'Connected'
    },
    {
      id: 'calendar',
      name: 'Calendar Sync',
      description: 'Sync events with external calendars',
      icon: Calendar,
      enabled: false,
      configured: false,
      provider: 'Google Calendar',
      status: 'Not Configured'
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Share content on social media platforms',
      icon: Globe,
      enabled: false,
      configured: false,
      provider: 'Facebook/Twitter',
      status: 'Not Configured'
    },
    {
      id: 'messaging',
      name: 'Messaging Platform',
      description: 'Group messaging and communication',
      icon: MessageCircle,
      enabled: false,
      configured: false,
      provider: 'WhatsApp Business',
      status: 'Not Configured'
    }
  ]);

  const [emailConfig, setEmailConfig] = useState({
    apiKey: '••••••••••••••••',
    fromEmail: 'noreply@livingrockchurch.org',
    fromName: 'Living Rock Church',
    replyTo: 'info@livingrockchurch.org'
  });

  const [paymentConfig, setPaymentConfig] = useState({
    publicKey: 'pk_test_••••••••••••••••',
    secretKey: '••••••••••••••••',
    currency: 'KES',
    testMode: true
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Connected": return "bg-green-100 text-green-800";
      case "Error": return "bg-red-100 text-red-800";
      case "Not Configured": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Connected": return CheckCircle;
      case "Error": return AlertTriangle;
      default: return Settings;
    }
  };

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Integration Settings</h3>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration) => {
              const StatusIcon = getStatusIcon(integration.status);
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <integration.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Provider: {integration.provider}</span>
                        <Badge className={getStatusColor(integration.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                      disabled={!integration.configured}
                    />
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email Service Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Service Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input 
                type="password"
                value={emailConfig.apiKey}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input 
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>From Name</Label>
              <Input 
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Reply To Email</Label>
              <Input 
                type="email"
                value={emailConfig.replyTo}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, replyTo: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Test Connection</Button>
            <Button>Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payment Gateway Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Publishable Key</Label>
              <Input 
                value={paymentConfig.publicKey}
                onChange={(e) => setPaymentConfig(prev => ({ ...prev, publicKey: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input 
                type="password"
                value={paymentConfig.secretKey}
                onChange={(e) => setPaymentConfig(prev => ({ ...prev, secretKey: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input 
                value={paymentConfig.currency}
                onChange={(e) => setPaymentConfig(prev => ({ ...prev, currency: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Test Mode</Label>
                <p className="text-sm text-muted-foreground">Use test environment</p>
              </div>
              <Switch 
                checked={paymentConfig.testMode}
                onCheckedChange={(checked) => setPaymentConfig(prev => ({ ...prev, testMode: checked }))}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">Test Payment</Button>
            <Button>Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input value="https://your-church-domain.com/api/webhooks" readOnly />
            <p className="text-sm text-muted-foreground">
              Use this URL to configure webhooks in your external services
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Webhook Secret</Label>
            <div className="flex gap-2">
              <Input value="wh_••••••••••••••••••••••••••••••••" readOnly />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input value="https://api.your-church-domain.com/v1" readOnly />
          </div>
          
          <div className="space-y-2">
            <Label>API Documentation</Label>
            <Textarea 
              value="Access the API documentation at: https://docs.your-church-domain.com/api"
              readOnly
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rate Limit</Label>
              <Input value="1000 requests/hour" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label>API Version</Label>
              <Input value="v1.2.0" readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
