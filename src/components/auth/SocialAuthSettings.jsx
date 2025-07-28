import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaWhatsapp, FaLink, FaUnlink, FaClock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialAuth } from '@/hooks/useSocialAuth';
import { useToast } from '@/hooks/use-toast';

const SocialAuthSettings = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    getSocialProfile, 
    disconnectSocialAccount, 
    linkSocialAccount,
    getAvailableProviders,
    isProviderEnabled 
  } = useSocialAuth();
  const { toast } = useToast();

  const [socialProfile, setSocialProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      loadSocialProfile();
    }
  }, [user]);

  const loadSocialProfile = async () => {
    if (!user) return;
    
    setIsLoadingProfile(true);
    try {
      const profile = await getSocialProfile(user.id);
      setSocialProfile(profile);
    } catch (error) {
      console.error('Error loading social profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !socialProfile?.social_provider) return;

    const confirmed = window.confirm(
      `Are you sure you want to disconnect your ${socialProfile.social_provider} account? You will need to use email/password to sign in.`
    );

    if (!confirmed) return;

    const { error } = await disconnectSocialAccount(user.id);
    if (!error) {
      await loadSocialProfile();
    }
  };

  const handleLinkAccount = async (provider) => {
    if (!isProviderEnabled(provider)) {
      toast({
        title: "Provider Not Available",
        description: `${provider} authentication is not currently available.`,
        variant: "destructive",
      });
      return;
    }

    await linkSocialAccount(provider);
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google':
        return <FcGoogle className="h-5 w-5" />;
      case 'facebook':
        return <FaFacebook className="h-5 w-5 text-blue-600" />;
      case 'whatsapp':
        return <FaWhatsapp className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getProviderName = (provider) => {
    if (!provider) return 'None';
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const availableProviders = getAvailableProviders();

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-xiracom-blue"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaLink className="h-5 w-5" />
          Social Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Social Account */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connected Account</h3>
          
          {socialProfile?.social_provider ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={socialProfile.avatar_url} />
                  <AvatarFallback>
                    {getProviderIcon(socialProfile.social_provider)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getProviderName(socialProfile.social_provider)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Connected
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {socialProfile.email}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FaClock className="h-3 w-3" />
                    Last login: {formatDate(socialProfile.last_social_login)}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700"
              >
                <FaUnlink className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <FaLink className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Social Account Connected
              </h4>
              <p className="text-gray-600 mb-4">
                Connect a social account for faster and more secure sign-in.
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Available Providers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Providers</h3>
          
          <div className="grid gap-3">
            {availableProviders.map((provider) => {
              const isConnected = socialProfile?.social_provider === provider.id;
              const isDisabled = provider.disabled || isConnected;

              return (
                <div
                  key={provider.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    isConnected ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                      {getProviderIcon(provider.id)}
                    </div>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-600">
                        {isConnected 
                          ? 'Account connected' 
                          : isDisabled 
                            ? 'Coming soon' 
                            : 'Click to connect'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isConnected && (
                      <Badge variant="secondary" className="text-xs">
                        Connected
                      </Badge>
                    )}
                    {provider.disabled && (
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                    {!isConnected && !provider.disabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLinkAccount(provider.id)}
                        disabled={isLoading}
                      >
                        <FaLink className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Account Information</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Verification</label>
              <div className="flex items-center gap-2">
                <Badge variant={socialProfile?.email_verified ? "default" : "secondary"}>
                  {socialProfile?.email_verified ? "Verified" : "Not Verified"}
                </Badge>
                {socialProfile?.social_provider && (
                  <span className="text-xs text-gray-600">
                    (via {getProviderName(socialProfile.social_provider)})
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <div>
                <Badge variant="outline">
                  {socialProfile?.social_provider ? "Social Account" : "Email Account"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Security Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Social accounts provide secure, passwordless authentication</li>
            <li>• Your social profile data is only used for authentication</li>
            <li>• You can disconnect your social account at any time</li>
            <li>• Email/password authentication remains available as backup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialAuthSettings; 