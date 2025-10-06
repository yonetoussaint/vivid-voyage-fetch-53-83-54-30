
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Phone, Mail, Clock, Star, Navigation, 
  ArrowLeft, Package, Truck, CheckCircle 
} from 'lucide-react';

const PickupStationProfile = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();

  // Mock pickup station data - you can replace this with actual data fetching
  const pickupStations: Record<string, any> = {
    'station-1': {
      id: 'station-1',
      name: 'Downtown Station #45',
      address: '123 Main Street, Downtown',
      city: 'Port-au-Prince',
      phone: '+509 1234-5678',
      email: 'downtown45@pickupstation.com',
      hours: 'Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM',
      rating: 4.8,
      totalReviews: 1247,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      features: ['24/7 Locker Access', 'Package Tracking', 'Secure Storage', 'SMS Notifications'],
      stats: {
        packagesDelivered: '15,000+',
        averagePickupTime: '2 mins',
        satisfaction: '98%'
      }
    },
    'station-2': {
      id: 'station-2',
      name: 'West Side Station #12',
      address: '456 West Avenue, West Side',
      city: 'Port-au-Prince',
      phone: '+509 2345-6789',
      email: 'westside12@pickupstation.com',
      hours: 'Mon-Fri: 7AM-9PM, Sat-Sun: 8AM-7PM',
      rating: 4.6,
      totalReviews: 892,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
      features: ['Temperature Controlled', 'Package Tracking', 'Extended Hours', 'Email Updates'],
      stats: {
        packagesDelivered: '12,000+',
        averagePickupTime: '3 mins',
        satisfaction: '96%'
      }
    },
    'station-3': {
      id: 'station-3',
      name: 'East End Station #28',
      address: '789 East Road, East End',
      city: 'Port-au-Prince',
      phone: '+509 3456-7890',
      email: 'eastend28@pickupstation.com',
      hours: 'Mon-Sun: 6AM-10PM',
      rating: 4.9,
      totalReviews: 2103,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
      features: ['Express Pickup', 'Package Tracking', 'Drive-Through', 'Mobile App'],
      stats: {
        packagesDelivered: '20,000+',
        averagePickupTime: '1 min',
        satisfaction: '99%'
      }
    },
    'station-4': {
      id: 'station-4',
      name: 'South Plaza Station #67',
      address: '321 South Plaza, South District',
      city: 'Port-au-Prince',
      phone: '+509 4567-8901',
      email: 'southplaza67@pickupstation.com',
      hours: 'Mon-Fri: 9AM-7PM, Sat-Sun: 10AM-5PM',
      rating: 4.7,
      totalReviews: 1456,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
      features: ['Indoor Lockers', 'Package Tracking', 'Parking Available', 'Wheelchair Access'],
      stats: {
        packagesDelivered: '18,000+',
        averagePickupTime: '2 mins',
        satisfaction: '97%'
      }
    },
    'station-5': {
      id: 'station-5',
      name: 'North Market Station #91',
      address: '654 North Market, North Side',
      city: 'Port-au-Prince',
      phone: '+509 5678-9012',
      email: 'northmarket91@pickupstation.com',
      hours: 'Mon-Sun: 24/7',
      rating: 4.5,
      totalReviews: 743,
      image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop',
      features: ['24/7 Access', 'Package Tracking', 'Self-Service Kiosks', 'Multiple Sizes'],
      stats: {
        packagesDelivered: '10,000+',
        averagePickupTime: '4 mins',
        satisfaction: '95%'
      }
    }
  };

  const station = pickupStations[stationId || ''] || pickupStations['station-1'];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1">Pickup Station</h1>
        </div>
      </div>

      {/* Station Image */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={station.image} 
          alt={station.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Station Info */}
      <div className="px-4 py-4 space-y-4">
        {/* Name and Rating */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">{station.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{station.city}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Open
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{station.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({station.totalReviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">{station.address}</p>
                  <Button variant="link" className="h-auto p-0 text-sm text-blue-600">
                    Get Directions
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <a href={`tel:${station.phone}`} className="text-sm text-foreground hover:underline">
                  {station.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <a href={`mailto:${station.email}`} className="text-sm text-foreground hover:underline">
                  {station.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-foreground">{station.hours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Station Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Package className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <p className="text-lg font-bold">{station.stats.packagesDelivered}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold">{station.stats.averagePickupTime}</p>
                <p className="text-xs text-muted-foreground">Avg Pickup</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                <p className="text-lg font-bold">{station.stats.satisfaction}</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {station.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full">
            <Navigation className="w-4 h-4 mr-2" />
            Navigate
          </Button>
          <Button className="w-full">
            <Phone className="w-4 h-4 mr-2" />
            Call Station
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickupStationProfile;
