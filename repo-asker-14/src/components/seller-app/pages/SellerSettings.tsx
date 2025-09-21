import React, { useState } from 'react';
import { 
  User, Store, Bell, Shield, CreditCard, 
  Truck, Globe, Palette, Save, Eye, EyeOff,
  Search, Filter, Plus
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

const SellerSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    storeName: "John's Electronics Store",
    storeDescription: "Premium electronics and accessories with fast shipping and excellent customer service.",
    contactEmail: "john@store.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, City, State 12345",

    // Notification settings
    orderNotifications: true,
    lowStockAlerts: true,
    reviewNotifications: true,
    marketingEmails: false,

    // Business settings
    currency: "USD",
    timezone: "America/New_York",
    language: "en",
    taxRate: "8.25",

    // Shipping settings
    freeShippingThreshold: "50",
    standardShippingCost: "5.99",
    expressShippingCost: "12.99",

    // Security settings
    twoFactorEnabled: true,
    sessionTimeout: "30",
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Settings</h1>
              <p className="text-xs text-muted-foreground">Manage your store settings</p>
            </div>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-full overflow-x-auto">
          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('profile')}
            className="text-xs h-7 flex-1 min-w-max"
          >
            <Store className="w-3 h-3 mr-1" />
            Profile
          </Button>
          <Button
            variant={activeTab === 'business' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('business')}
            className="text-xs h-7 flex-1 min-w-max"
          >
            <Globe className="w-3 h-3 mr-1" />
            Business
          </Button>
          <Button
            variant={activeTab === 'shipping' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('shipping')}
            className="text-xs h-7 flex-1 min-w-max"
          >
            <Truck className="w-3 h-3 mr-1" />
            Shipping
          </Button>
          <Button
            variant={activeTab === 'notifications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('notifications')}
            className="text-xs h-7 flex-1 min-w-max"
          >
            <Bell className="w-3 h-3 mr-1" />
            Notifications
          </Button>
          <Button
            variant={activeTab === 'security' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('security')}
            className="text-xs h-7 flex-1 min-w-max"
          >
            <Shield className="w-3 h-3 mr-1" />
            Security
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-3">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Change Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="storeName" className="text-xs">Store Name</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => handleSettingChange('storeName', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail" className="text-xs">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="storeDescription" className="text-xs">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      value={settings.storeDescription}
                      onChange={(e) => handleSettingChange('storeDescription', e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                      <Label htmlFor="address" className="text-xs">Address</Label>
                      <Input
                        id="address"
                        value={settings.address}
                        onChange={(e) => handleSettingChange('address', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="currency" className="text-xs">Currency</Label>
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
                      <Label htmlFor="timezone" className="text-xs">Timezone</Label>
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
                  </div>

                  <div>
                    <Label htmlFor="taxRate" className="text-xs">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      value={settings.taxRate}
                      onChange={(e) => handleSettingChange('taxRate', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="freeShippingThreshold" className="text-xs">Free Shipping ($)</Label>
                      <Input
                        id="freeShippingThreshold"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => handleSettingChange('freeShippingThreshold', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="standardShippingCost" className="text-xs">Standard ($)</Label>
                      <Input
                        id="standardShippingCost"
                        value={settings.standardShippingCost}
                        onChange={(e) => handleSettingChange('standardShippingCost', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expressShippingCost" className="text-xs">Express ($)</Label>
                      <Input
                        id="expressShippingCost"
                        value={settings.expressShippingCost}
                        onChange={(e) => handleSettingChange('expressShippingCost', e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Order Notifications</Label>
                      <p className="text-xs text-muted-foreground">New orders</p>
                    </div>
                    <Switch
                      checked={settings.orderNotifications}
                      onCheckedChange={(checked) => handleSettingChange('orderNotifications', checked)}
                      className="h-4 w-7"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Low Stock Alerts</Label>
                      <p className="text-xs text-muted-foreground">Inventory alerts</p>
                    </div>
                    <Switch
                      checked={settings.lowStockAlerts}
                      onCheckedChange={(checked) => handleSettingChange('lowStockAlerts', checked)}
                      className="h-4 w-7"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Review Notifications</Label>
                      <p className="text-xs text-muted-foreground">New reviews</p>
                    </div>
                    <Switch
                      checked={settings.reviewNotifications}
                      onCheckedChange={(checked) => handleSettingChange('reviewNotifications', checked)}
                      className="h-4 w-7"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Updates</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                      className="h-4 w-7"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-3">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs">Two-Factor Auth</Label>
                      <p className="text-xs text-muted-foreground">Extra security</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                      className="h-4 w-7"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="currentPassword" className="text-xs">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Current password"
                        className="h-8 text-sm pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="newPassword" className="text-xs">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="New password"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-xs">Confirm</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <CreditCard className="w-3 h-3 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <Palette className="w-3 h-3 mr-2" />
                    Store Theme
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                    <User className="w-3 h-3 mr-2" />
                    Account Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSettings;