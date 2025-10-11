
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Star, Package } from 'lucide-react';

const MyStations = () => {
  const navigate = useNavigate();

  const pickupStations = [
    {
      id: "station-1",
      name: "Port-au-Prince Central Station",
      address: "123 Boulevard Jean-Jacques Dessalines, Port-au-Prince",
      city: "Port-au-Prince",
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
      distance: "0.5 km",
      phone: "+509 2234 5678",
      rating: 4.8,
      totalPackages: 45,
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=200&fit=crop"
    },
    {
      id: "station-2", 
      name: "Pétion-Ville Express Station",
      address: "45 Rue Grégoire, Pétion-Ville",
      city: "Pétion-Ville",
      hours: "Mon-Fri: 9AM-7PM, Sat: 9AM-5PM",
      distance: "1.2 km",
      phone: "+509 2234 5679",
      rating: 4.6,
      totalPackages: 32,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop"
    },
    {
      id: "station-3",
      name: "Delmas Shopping Center Station", 
      address: "67 Route de Delmas, Delmas 31",
      city: "Delmas",
      hours: "Daily: 9AM-9PM",
      distance: "2.1 km",
      phone: "+509 2234 5680",
      rating: 4.7,
      totalPackages: 38,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop"
    },
    {
      id: "station-4",
      name: "Carrefour Mall Station",
      address: "89 Boulevard du 15 Octobre, Carrefour",
      city: "Carrefour",
      hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM", 
      distance: "3.5 km",
      phone: "+509 2234 5681",
      rating: 4.5,
      totalPackages: 28,
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
          <h1 className="text-lg font-semibold flex-1">My Stations</h1>
        </div>
      </div>

      {/* Stations List */}
      <div className="p-4 space-y-4">
        {pickupStations.map((station) => (
          <Card 
            key={station.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/profile/pickup-station/${station.id}`)}
          >
            <div className="relative h-32">
              <img 
                src={station.image} 
                alt={station.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{station.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{station.city}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{station.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{station.address}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{station.hours}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span>{station.totalPackages} packages ready</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium">{station.distance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyStations;
