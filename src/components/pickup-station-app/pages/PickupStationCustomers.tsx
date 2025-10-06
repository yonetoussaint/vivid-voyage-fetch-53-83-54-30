
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Package } from 'lucide-react';

const PickupStationCustomers = () => {
  const customers = [
    { name: 'John Doe', email: 'john@example.com', packages: 5, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Jane Smith', email: 'jane@example.com', packages: 3, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face' },
    { name: 'Mike Johnson', email: 'mike@example.com', packages: 8, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Regular Customers</h2>
          <p className="text-sm text-muted-foreground">Customers who use this station</p>
        </div>

        <div className="space-y-3">
          {customers.map((customer, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{customer.packages}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PickupStationCustomers;
