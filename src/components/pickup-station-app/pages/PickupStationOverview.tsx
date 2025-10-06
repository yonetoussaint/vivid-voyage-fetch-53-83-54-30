
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, TrendingUp, Clock, MapPin, CheckCircle } from 'lucide-react';

const PickupStationOverview = () => {
  const stats = [
    { label: 'Packages Today', value: '45', icon: Package, color: 'text-blue-600' },
    { label: 'Active Customers', value: '128', icon: Users, color: 'text-green-600' },
    { label: 'Pickup Rate', value: '92%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Avg Wait Time', value: '2 min', icon: Clock, color: 'text-orange-600' },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Station Info */}
      <div className="px-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Station Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Open
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span>Downtown Station #45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hours</span>
                <span>8AM - 8PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Package #{1000 + item}</p>
                      <p className="text-xs text-muted-foreground">Picked up 5 min ago</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PickupStationOverview;
