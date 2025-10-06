
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, Clock } from 'lucide-react';

const PickupStationAnalytics = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Daily Packages</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weekly Packages</span>
                <span className="font-semibold">312</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Packages</span>
                <span className="font-semibold">1,248</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Efficiency Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pickup Rate</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Wait Time</span>
                <span className="font-semibold">2 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <span className="font-semibold text-green-600">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PickupStationAnalytics;
