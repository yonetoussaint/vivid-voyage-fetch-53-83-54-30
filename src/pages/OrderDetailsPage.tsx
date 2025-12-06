// @/components/seller-app/pages/orders/OrderDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Clock, Truck, PackageOpen, XCircle,
  Copy, MapPin, MessageCircle, Download, CreditCard, User, Box,
  Calendar, ShoppingBag, Mail, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockOrder = {
      id: `#${orderId}`,
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face'
      },
      products: [
        { 
          name: 'Wireless Earbuds Pro', 
          quantity: 2, 
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop'
        }
      ],
      total: 149.99,
      subtotal: 99.98,
      shipping: 10.00,
      tax: 5.99,
      status: 'Completed',
      date: '2024-01-20',
      orderPlacedAt: '2024-01-19 14:30',
      trackingNumber: 'TRK1234567890',
      carrier: 'FedEx',
      estimatedDelivery: '2024-01-22',
      pickupStation: 'Downtown Station #45',
      pickupStationAddress: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card ****1234',
      shippingAddress: '456 Oak Ave, Brooklyn, NY 11201',
      shippingMethod: 'Standard Delivery',
      notes: 'Leave package at front door if no one is home.'
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 300);
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'Processing': return Clock;
      case 'Shipped': return Truck;
      case 'Pending': return PackageOpen;
      case 'Cancelled': return XCircle;
      default: return Box;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <PackageOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/seller-dashboard/orders')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/seller-dashboard/orders')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{order.id}</h1>
            <p className="text-xs text-muted-foreground">Order Details</p>
          </div>
          <Badge className={`${getStatusColor(order.status)} px-3 py-1.5 flex items-center gap-2`}>
            <StatusIcon className="w-4 h-4" />
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Customer Info */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-medium text-foreground mb-4">Customer Information</h2>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={order.customer.avatar} />
                <AvatarFallback>{order.customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-foreground">{order.customer.name}</h3>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {order.customer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {order.customer.phone}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-medium text-foreground mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.products.map((product: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{product.name}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity: {product.quantity}</span>
                      <span>${product.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">${(product.price * product.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Tracking */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-medium text-foreground mb-4">Shipping & Tracking</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tracking Information</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                    {order.trackingNumber}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(order.trackingNumber)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Carrier: {order.carrier} • Estimated Delivery: {order.estimatedDelivery}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Pickup Station</span>
                </div>
                <p className="text-sm">{order.pickupStation}</p>
                <p className="text-xs text-muted-foreground mt-1">{order.pickupStationAddress}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View Station Details
                </Button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Payment Information</span>
                </div>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11">
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          <Button className="h-11" onClick={() => toast.success('Order updated successfully')}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Update Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;