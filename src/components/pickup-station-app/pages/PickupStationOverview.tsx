
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, TrendingUp, Clock, MapPin, CheckCircle } from 'lucide-react';

import ProductQA from '@/components/product/ProductQA';
import CustomerReviews from '@/components/product/CustomerReviewsEnhanced';

const PickupStationOverview = () => {
  const stats = [
    { label: 'Packages Today', value: '45', icon: Package, color: 'text-blue-600' },
    { label: 'Active Customers', value: '128', icon: Users, color: 'text-green-600' },
    { label: 'Pickup Rate', value: '92%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Avg Wait Time', value: '2 min', icon: Clock, color: 'text-orange-600' },
  ];

  // Mock Q&A data for pickup station
  const mockStationQAs = [
    {
      id: 1,
      user_name: "Jean Baptiste",
      question: "What are your operating hours?",
      answer: "We're open Monday to Saturday from 8 AM to 8 PM, and Sunday from 10 AM to 6 PM.",
      answer_author: "Station Manager",
      is_official: true,
      created_at: "2024-08-15T10:30:00Z",
      answered_at: "2024-08-15T14:30:00Z",
      helpful_count: 24,
      reply_count: 2,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Marie Claire",
          comment: "Perfect hours for my schedule!",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: false
        },
        {
          id: 102,
          user_name: "Station Manager",
          comment: "We're here to serve you at convenient times!",
          created_at: "2024-08-17T14:30:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Pierre Louis",
      question: "How long can I leave my package at the station?",
      answer: "Packages can be stored for up to 7 days free of charge. After that, a small storage fee applies.",
      answer_author: "Customer Service",
      is_official: true,
      created_at: "2024-08-10T14:20:00Z",
      answered_at: "2024-08-10T16:45:00Z",
      helpful_count: 18,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

  // Mock reviews data for pickup station
  const mockStationReviews = [
    {
      id: 1,
      user_name: "Claudette Joseph",
      rating: 5,
      title: "Excellent service!",
      comment: "Very fast and professional. The staff is always friendly and helpful. I never wait more than 5 minutes to pick up my packages.",
      created_at: "2024-08-15T10:30:00Z",
      verified_purchase: true,
      helpful_count: 15,
      reply_count: 1,
      media: [],
      replies: [
        {
          id: 101,
          user_name: "Station Manager",
          comment: "Thank you for your wonderful feedback! We're committed to providing fast, friendly service.",
          created_at: "2024-08-16T09:15:00Z",
          is_seller: true
        }
      ]
    },
    {
      id: 2,
      user_name: "Jacques Desir",
      rating: 5,
      title: "Very convenient location",
      comment: "Right in the heart of the city. Easy to access and plenty of parking nearby.",
      created_at: "2024-08-10T14:20:00Z",
      verified_purchase: true,
      helpful_count: 12,
      reply_count: 0,
      media: [],
      replies: []
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3 bg-gray-50">
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

      {/* Customer Reviews Section */}
      <div className="mt-6">
        <CustomerReviews 
          productId="pickup-station-1"
          reviews={mockStationReviews}
          limit={5}
        />
      </div>

      {/* Q&A Section */}
      <div className="mt-6">
        <ProductQA 
          productId="pickup-station-1"
          questions={mockStationQAs}
          limit={5}
        />
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
