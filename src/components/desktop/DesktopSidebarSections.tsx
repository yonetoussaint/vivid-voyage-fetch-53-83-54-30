
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { History, Route, MapPin, Smartphone, Download, Star, Search, Package, Truck, CheckCircle, Clock, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import TransferHistoryPage from '@/pages/TransferHistoryPage';
import LocationsPage from '@/pages/LocationsPage';

interface Transfer {
  id: string;
  recipient: string;
  amount: string;
  currency: string;
  status: 'pending' | 'processing' | 'in_transit' | 'completed' | 'failed';
  createdAt: string;
  estimatedDelivery: string;
  fromLocation: string;
  toLocation: string;
  trackingSteps: {
    step: string;
    status: 'completed' | 'current' | 'pending';
    timestamp?: string;
    description: string;
  }[];
}

// Mock transfer data
const mockTransfer: Transfer = {
  id: 'T123456',
  recipient: 'John Doe',
  amount: '250.00',
  currency: 'USD',
  status: 'in_transit',
  createdAt: '2025-06-14T10:30:00Z',
  estimatedDelivery: '2025-06-16T15:00:00Z',
  fromLocation: 'New York, USA',
  toLocation: 'London, UK',
  trackingSteps: [
    {
      step: 'Transfer Initiated',
      status: 'completed',
      timestamp: '2025-06-14T10:30:00Z',
      description: 'Your transfer has been successfully initiated and payment confirmed.'
    },
    {
      step: 'Processing',
      status: 'completed',
      timestamp: '2025-06-14T11:15:00Z',
      description: 'Transfer is being processed and verified by our security team.'
    },
    {
      step: 'In Transit',
      status: 'current',
      timestamp: '2025-06-14T14:20:00Z',
      description: 'Your money is on its way to the recipient.'
    },
    {
      step: 'Delivered',
      status: 'pending',
      description: 'Funds will be available to the recipient.'
    }
  ]
};

const getStatusColor = (status: Transfer['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'in_transit':
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStepIcon = (step: string, status: 'completed' | 'current' | 'pending') => {
  const iconProps = { className: "w-3 h-3" };
  
  if (status === 'completed') {
    return <CheckCircle {...iconProps} className="w-3 h-3 text-green-600" />;
  } else if (status === 'current') {
    return <Clock {...iconProps} className="w-3 h-3 text-blue-600" />;
  }
  
  switch (step) {
    case 'Transfer Initiated':
      return <Package {...iconProps} className="w-3 h-3 text-gray-400" />;
    case 'Processing':
      return <AlertCircle {...iconProps} className="w-3 h-3 text-gray-400" />;
    case 'In Transit':
      return <Truck {...iconProps} className="w-3 h-3 text-gray-400" />;
    case 'Delivered':
      return <CheckCircle {...iconProps} className="w-3 h-3 text-gray-400" />;
    default:
      return <Clock {...iconProps} className="w-3 h-3 text-gray-400" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DesktopSidebarSections: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackTransfer = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (trackingId === 'T123456') {
        setTransfer(mockTransfer);
      } else {
        setError('Transfer not found. Please check your tracking ID.');
        setTransfer(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Track Transfer Section */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Route className="h-5 w-5" />
            Track Transfer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-id" className="text-sm">Tracking ID</Label>
            <div className="flex gap-2">
              <Input
                id="tracking-id"
                placeholder="e.g., T123456"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackTransfer()}
                className="text-sm"
              />
              <Button 
                onClick={handleTrackTransfer}
                disabled={isLoading}
                size="sm"
                className="px-3"
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}

          {/* Transfer Details */}
          {transfer && (
            <div className="space-y-4 border-t pt-4">
              {/* Transfer Overview */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">#{transfer.id}</h4>
                    <p className="text-xs text-muted-foreground">To {transfer.recipient}</p>
                  </div>
                  <Badge className={cn('text-xs capitalize border-transparent', getStatusColor(transfer.status))}>
                    {transfer.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">{transfer.amount} {transfer.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Initiated:</span>
                    <span>{formatDate(transfer.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Est. Delivery:</span>
                    <span>{formatDate(transfer.estimatedDelivery)}</span>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Route</h5>
                <div className="flex items-center justify-between text-xs">
                  <div className="text-center flex-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full mb-1 mx-auto"></div>
                    <p className="text-xs text-muted-foreground">{transfer.fromLocation}</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 mx-2 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Truck className="w-3 h-3 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mb-1 mx-auto"></div>
                    <p className="text-xs text-muted-foreground">{transfer.toLocation}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Timeline</h5>
                <div className="space-y-3">
                  {transfer.trackingSteps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex flex-col items-center">
                        {getStepIcon(step.step, step.status)}
                        {index < transfer.trackingSteps.length - 1 && (
                          <div className={cn(
                            "w-px h-6 mt-1",
                            step.status === 'completed' ? "bg-green-600" : "bg-gray-200"
                          )} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <h6 className={cn(
                            "text-xs font-medium",
                            step.status === 'completed' ? "text-green-700" :
                            step.status === 'current' ? "text-blue-700" : "text-gray-500"
                          )}>
                            {step.step}
                          </h6>
                          {step.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!transfer && !error && (
            <div className="space-y-2 text-xs text-muted-foreground border-t pt-4">
              <p>• Your tracking ID was sent to your email</p>
              <p>• IDs start with 'T' followed by numbers</p>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Contact Support
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transfer History Section */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            Transfer History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TransferHistoryPage />
        </CardContent>
      </Card>

      {/* Mobile App Section */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="h-5 w-5" />
            Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Send Money On The Go</h4>
            <p className="text-sm text-gray-600">
              Experience faster transfers with our mobile app. Available on iOS and Android.
            </p>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-medium">4.8/5</span>
            <span className="text-gray-500">from 50K+ reviews</span>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              size="sm"
              className="bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2"
              onClick={() => window.open('#', '_blank')}
            >
              <span className="text-xs">📱</span>
              <span className="text-xs">App Store</span>
            </Button>
            
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
              onClick={() => window.open('#', '_blank')}
            >
              <Download className="w-3 h-3" />
              <span className="text-xs">Google Play</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Locations Section */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Our Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LocationsPage />
        </CardContent>
      </Card>
    </div>
  );
};

export default DesktopSidebarSections;
