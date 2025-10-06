
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const PickupStationPackages = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const packages = [
    { id: 'PKG001', customer: 'John Doe', status: 'ready', arrivalTime: '2 hours ago' },
    { id: 'PKG002', customer: 'Jane Smith', status: 'ready', arrivalTime: '3 hours ago' },
    { id: 'PKG003', customer: 'Mike Johnson', status: 'picked-up', arrivalTime: '1 day ago' },
    { id: 'PKG004', customer: 'Sarah Williams', status: 'ready', arrivalTime: '5 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'picked-up': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Search Bar */}
      <div className="p-4 bg-white border-b sticky top-[120px] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Packages List */}
      <div className="p-4 space-y-3">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{pkg.id}</p>
                    <p className="text-sm text-muted-foreground">{pkg.customer}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(pkg.status)}>
                  {pkg.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Arrived {pkg.arrivalTime}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PickupStationPackages;
