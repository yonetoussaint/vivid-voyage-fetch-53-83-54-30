
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Package, AlertCircle } from 'lucide-react';

const PickupStationNotifications = () => {
  const notifications = [
    { type: 'new-package', message: 'New package arrived for John Doe', time: '5 min ago', icon: Package },
    { type: 'alert', message: 'Storage capacity at 80%', time: '1 hour ago', icon: AlertCircle },
    { type: 'pickup', message: 'Package PKG001 picked up', time: '2 hours ago', icon: Package },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="p-4 space-y-3">
        {notifications.map((notif, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <notif.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PickupStationNotifications;
