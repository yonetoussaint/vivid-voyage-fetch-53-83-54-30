
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Bell, MapPin, Clock, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const PickupStationSettings = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">New Package Alerts</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pickup Notifications</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Capacity Warnings</span>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span>8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday - Sunday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Require PIN for Pickup</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">ID Verification</span>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PickupStationSettings;
