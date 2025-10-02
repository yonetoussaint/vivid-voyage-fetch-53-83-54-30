import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Edit,
  Settings,
  HelpCircle,
  Lock,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from "@/components/transfer-app/common/PageHeader";

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

const AccountPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log('Getting user data...');
        
        // First check localStorage
        const storedUser = localStorage.getItem('user');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        console.log('Stored user from localStorage:', storedUser);
        console.log('Is authenticated:', isAuthenticated);
        
        if (isAuthenticated === 'true' && storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('Parsed user data from localStorage:', userData);
          
          // Try to get additional profile data from Supabase
          try {
            const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
            console.log('Supabase user:', supabaseUser);
            
            if (supabaseUser && !userError) {
              // Get user profile from profiles table if it exists
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();
              
              console.log('Profile data from Supabase:', profile);
              console.log('Profile error:', profileError);
              
              // Merge data from localStorage and Supabase
              const completeUserData = {
                id: supabaseUser.id,
                email: userData.email || supabaseUser.email,
                full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || userData.full_name,
                profile_picture: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url
              };
              
              console.log('Complete merged user data:', completeUserData);
              setUser(completeUserData);
            } else {
              // Fallback to localStorage data only
              setUser({
                id: userData.id || 'unknown',
                email: userData.email,
                full_name: userData.full_name,
                profile_picture: userData.profile_picture
              });
            }
          } catch (supabaseError) {
            console.log('Supabase not available, using localStorage only:', supabaseError);
            // Fallback to localStorage data
            setUser({
              id: userData.id || 'unknown',
              email: userData.email,
              full_name: userData.full_name,
              profile_picture: userData.profile_picture
            });
          }
        } else {
          console.log('No user data found in localStorage');
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Sign out clicked - clearing localStorage and signing out');
      
      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Also sign out from Supabase for good measure
      await supabase.auth.signOut();
      
      // Reload to trigger auth check
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.full_name) {
      return user.full_name;
    }
    // Fallback to email username
    return user?.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-20 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-20 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No user data available</p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pb-20 max-w-4xl">
      <PageHeader 
        title="Account"
        subtitle="Manage your account settings and preferences."
      />

      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal details and contact information.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.profile_picture} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {getInitials(getDisplayName())}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {getDisplayName()}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  defaultValue={getDisplayName()}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email || ''}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  defaultValue="Not provided"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue="Not provided"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Sign-in Provider</Label>
                <Input
                  id="provider"
                  defaultValue="email"
                  readOnly
                  className="bg-muted capitalize"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-id">User ID</Label>
                <Input
                  id="user-id"
                  defaultValue={user.id}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage your password and security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  defaultValue="••••••••"
                  readOnly
                  className="bg-muted pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">Verify your email address</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-green-600 border-green-600">
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your app experience and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your transfers</p>
                </div>
              </div>
              <Badge variant="secondary">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Get text alerts for important updates</p>
                </div>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">English (US)</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your saved payment methods for transfers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Badge variant="secondary">Primary</Badge>
            </div>
            <Button variant="outline" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help & Support
            </CardTitle>
            <CardDescription>
              Get help and manage your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Terms of Service
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;
