// @ts-nocheck
import React, { useState } from 'react';
import {
  User, Bell, Shield, CreditCard, Truck, Globe,
  Palette, Save, Eye, EyeOff, Camera, Edit,
  Smartphone, Mail, MapPin, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth/AuthContext';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    fullName: user?.full_name || 'John Doe',
    username: user?.email?.split('@')[0] || 'johndoe',
    email: user?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Love technology and great products!',
    birthDate: '1990-01-01',

    // Address settings
    address: '123 Main St, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',

    // Notification settings
    orderUpdates: true,
    priceAlerts: true,
    newProducts: false,
    promotions: true,
    newsletter: false,
    smsNotifications: true,

    // Privacy settings
    profileVisibility: 'friends',
    showEmail: false,
    showPhone: false,
    allowRecommendations: true,

    // Preferences
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'system',

    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: '30',
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <SellerSummaryHeader
        title="Account Settings"
        subtitle="Manage your account preferences"
        stats={[]}
        showStats={false}
      >
        <Button size="sm" onClick={handleSave}>
          <Save className="w-3 h-3 mr-1" />
          Save Changes
        </Button>
      </SellerSummaryHeader>


      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap h-7 text-xs"
            >
              <Icon className="w-3 h-3 mr-1" />
              {tab.name}
            </Button>
          );
        })}
      </div>

      <div className="px-4">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3">Profile Information</h3>

                {/* Profile Picture */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user?.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                      <AvatarFallback>
                        {settings.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-1 -right-1 h-6 w-6 p-0 rounded-full">
                      <Camera className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{settings.fullName}</p>
                    <p className="text-xs text-muted-foreground">@{settings.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                    <Input
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => handleSettingChange('fullName', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-xs">Username</Label>
                    <Input
                      id="username"
                      value={settings.username}
                      onChange={(e) => handleSettingChange('username', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-xs">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleSettingChange('phone', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-xs">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={settings.birthDate}
                      onChange={(e) => handleSettingChange('birthDate', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <Label htmlFor="bio" className="text-xs">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="text-sm"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-xs">Street Address</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleSettingChange('address', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs">City</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => handleSettingChange('city', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs">State</Label>
                    <Input
                      id="state"
                      value={settings.state}
                      onChange={(e) => handleSettingChange('state', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-xs">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={settings.zipCode}
                      onChange={(e) => handleSettingChange('zipCode', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-xs">Country</Label>
                    <Select value={settings.country} onValueChange={(value) => handleSettingChange('country', value)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order Updates</p>
                    <p className="text-xs text-muted-foreground">Get notified about order status changes</p>
                  </div>
                  <Switch
                    checked={settings.orderUpdates}
                    onCheckedChange={(checked) => handleSettingChange('orderUpdates', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Price Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified when wishlist items go on sale</p>
                  </div>
                  <Switch
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">New Products</p>
                    <p className="text-xs text-muted-foreground">Get notified about new products from followed sellers</p>
                  </div>
                  <Switch
                    checked={settings.newProducts}
                    onCheckedChange={(checked) => handleSettingChange('newProducts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Promotions</p>
                    <p className="text-xs text-muted-foreground">Get notified about special offers and discounts</p>
                  </div>
                  <Switch
                    checked={settings.promotions}
                    onCheckedChange={(checked) => handleSettingChange('promotions', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Newsletter</p>
                    <p className="text-xs text-muted-foreground">Receive our weekly newsletter</p>
                  </div>
                  <Switch
                    checked={settings.newsletter}
                    onCheckedChange={(checked) => handleSettingChange('newsletter', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Privacy Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
                    <SelectTrigger className="h-8 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Email</p>
                    <p className="text-xs text-muted-foreground">Allow others to see your email address</p>
                  </div>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Show Phone</p>
                    <p className="text-xs text-muted-foreground">Allow others to see your phone number</p>
                  </div>
                  <Switch
                    checked={settings.showPhone}
                    onCheckedChange={(checked) => handleSettingChange('showPhone', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Product Recommendations</p>
                    <p className="text-xs text-muted-foreground">Allow personalized product recommendations</p>
                  </div>
                  <Switch
                    checked={settings.allowRecommendations}
                    onCheckedChange={(checked) => handleSettingChange('allowRecommendations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">App Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange('currency', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Session Timeout</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('sessionTimeout', value)}>
                    <SelectTrigger className="h-8 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Shield className="w-3 h-3 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Smartphone className="w-3 h-3 mr-2" />
                    Manage Devices
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Eye className="w-3 h-3 mr-2" />
                    Login Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;