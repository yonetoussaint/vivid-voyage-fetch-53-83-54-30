
import React from "react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/transfer-app/common/PageHeader";

const locations = [
  {
    id: 1,
    city: "New York",
    address: "123 Wall Street, New York, NY 10005, USA",
    hours: "Mon–Fri 9:00am – 5:30pm",
    phone: "+1 (212) 555-1234",
    img: "https://maps.googleapis.com/maps/api/staticmap?center=40.7061,-74.0092&zoom=14&size=600x400&maptype=roadmap&markers=color:red%7C40.7061,-74.0092&style=feature:poi|visibility:off&style=feature:transit|visibility:off"
  },
  {
    id: 2,
    city: "London",
    address: "8 King's Road, London SW3 4RY, UK",
    hours: "Mon–Fri 8:30am – 5:00pm",
    phone: "+44 20 7345 6789",
    img: "https://maps.googleapis.com/maps/api/staticmap?center=51.4886,-0.1622&zoom=14&size=600x400&maptype=roadmap&markers=color:red%7C51.4886,-0.1622&style=feature:poi|visibility:off&style=feature:transit|visibility:off"
  },
  {
    id: 3,
    city: "Lagos",
    address: "55B Allen Avenue, Ikeja, Lagos, Nigeria",
    hours: "Mon–Sat 9:00am – 6:00pm",
    phone: "+234 1 270 5678",
    img: "https://maps.googleapis.com/maps/api/staticmap?center=6.6018,3.3515&zoom=14&size=600x400&maptype=roadmap&markers=color:red%7C6.6018,3.3515&style=feature:poi|visibility:off&style=feature:transit|visibility:off"
  }
];

const LocationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <PageHeader 
        title="Our Locations"
        subtitle="Visit our branches worldwide for in-person assistance"
      />

      {/* Locations List */}
      <div className="px-4 py-6 space-y-4">
        {locations.map(location => (
          <Card key={location.id} className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            {/* Map Image */}
            <div className="relative h-40 bg-gray-100">
              <img
                src={location.img}
                alt={`${location.city} map`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {location.city}
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {location.city} Branch
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-relaxed">
                {location.address}
              </CardDescription>
            </CardHeader>

            <CardContent className="py-0 space-y-3">
              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Hours</p>
                  <p className="text-sm text-gray-900">{location.hours}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                  <a 
                    href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
                    className="text-sm text-red-600 font-medium"
                  >
                    {location.phone}
                  </a>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Button 
                asChild 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="sm"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-4 pb-20 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Need Help Finding Us?</h3>
              <p className="text-sm text-blue-700">
                Can't find a location near you? Contact our support team for assistance with your transfer needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPage;
