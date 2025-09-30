
import React, { useState } from 'react';
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
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  DollarSign,
  Route
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHeader from "@/components/common/PageHeader";

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
  const iconProps = { className: "w-4 h-4" };
  
  if (status === 'completed') {
    return <CheckCircle {...iconProps} className="w-4 h-4 text-green-600" />;
  } else if (status === 'current') {
    return <Clock {...iconProps} className="w-4 h-4 text-blue-600" />;
  }
  
  switch (step) {
    case 'Transfer Initiated':
      return <Package {...iconProps} className="w-4 h-4 text-gray-400" />;
    case 'Processing':
      return <AlertCircle {...iconProps} className="w-4 h-4 text-gray-400" />;
    case 'In Transit':
      return <Truck {...iconProps} className="w-4 h-4 text-gray-400" />;
    case 'Delivered':
      return <CheckCircle {...iconProps} className="w-4 h-4 text-gray-400" />;
    default:
      return <Clock {...iconProps} className="w-4 h-4 text-gray-400" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TrackTransferPage: React.FC = () => {
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
    <div className="container mx-auto p-4 md:p-6 pb-20">
      <PageHeader 
        title="Track Transfer"
        subtitle="Enter your tracking ID to monitor your transfer status in real-time."
      />

      {/* Tracking Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Track Your Transfer
          </CardTitle>
          <CardDescription>
            Enter your transfer tracking ID to see the current status and delivery progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-id">Tracking ID</Label>
            <div className="flex gap-2">
              <Input
                id="tracking-id"
                placeholder="Enter tracking ID (e.g., T123456)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackTransfer()}
              />
              <Button 
                onClick={handleTrackTransfer}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Transfer Details */}
      {transfer && (
        <div className="space-y-6">
          {/* Transfer Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Transfer #{transfer.id}</CardTitle>
                  <CardDescription>
                    To {transfer.recipient}
                  </CardDescription>
                </div>
                <Badge className={cn('capitalize border-transparent', getStatusColor(transfer.status))}>
                  {transfer.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{transfer.amount} {transfer.currency}</p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatDate(transfer.createdAt)}</p>
                    <p className="text-xs text-muted-foreground">Initiated</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{formatDate(transfer.estimatedDelivery)}</p>
                    <p className="text-xs text-muted-foreground">Est. Delivery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Transfer Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mb-2 mx-auto"></div>
                  <p className="text-sm font-medium">{transfer.fromLocation}</p>
                  <p className="text-xs text-muted-foreground">From</p>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mb-2 mx-auto"></div>
                  <p className="text-sm font-medium">{transfer.toLocation}</p>
                  <p className="text-xs text-muted-foreground">To</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Timeline</CardTitle>
              <CardDescription>
                Track the progress of your transfer step by step.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfer.trackingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStepIcon(step.step, step.status)}
                      {index < transfer.trackingSteps.length - 1 && (
                        <div className={cn(
                          "w-px h-8 mt-2",
                          step.status === 'completed' ? "bg-green-600" : "bg-gray-200"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-medium",
                          step.status === 'completed' ? "text-green-700" :
                          step.status === 'current' ? "text-blue-700" : "text-gray-500"
                        )}>
                          {step.step}
                        </h4>
                        {step.timestamp && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(step.timestamp)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      {!transfer && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Your tracking ID was sent to your email when you initiated the transfer</p>
              <p>• Tracking IDs typically start with 'T' followed by numbers (e.g., T123456)</p>
              <p>• Contact our support team if you can't find your tracking ID</p>
            </div>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackTransferPage;
