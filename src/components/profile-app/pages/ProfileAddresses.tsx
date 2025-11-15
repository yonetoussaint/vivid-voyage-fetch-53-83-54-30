import React, { useState } from 'react';
import {
  MapPin, Plus, Edit, Trash2, MoreHorizontal,
  Home, Building, Star, Check, Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';

const ProfileAddresses = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<'delivery' | 'pickup'>('delivery');

  const addresses = [
    {
      id: '1',
      type: 'home',
      label: 'Home',
      name: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      instructions: 'Ring doorbell twice',
      addressType: 'delivery'
    },
    {
      id: '2',
      type: 'work',
      label: 'Work',
      name: 'John Doe',
      address: '456 Business Ave',
      apartment: 'Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      phone: '+1 (555) 234-5678',
      isDefault: false,
      instructions: 'Leave with reception',
      addressType: 'delivery'
    },
    {
      id: '3',
      type: 'pickup',
      label: 'UPS Store',
      name: 'UPS Access Point',
      address: '789 Shopping Center',
      apartment: 'Unit 15',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'United States',
      phone: '+1 (555) 345-6789',
      isDefault: false,
      instructions: 'Pickup hours: 9AM-7PM',
      addressType: 'pickup',
      provider: 'UPS',
      hours: '9:00 AM - 7:00 PM'
    }
  ];

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    label: '',
    name: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    instructions: '',
    isDefault: false,
    addressType: 'delivery',
    provider: '',
    hours: ''
  });

  const getAddressIcon = (type: string, addressType: string) => {
    if (addressType === 'pickup') return Package;
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  const handleSaveAddress = () => {
    console.log('Saving address:', newAddress);
    setIsAddingNew(false);
    setNewAddress({
      type: 'home',
      label: '',
      name: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      instructions: '',
      isDefault: false,
      addressType: 'delivery',
      provider: '',
      hours: ''
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    console.log('Deleting address:', addressId);
  };

  const handleSetDefault = (addressId: string) => {
    console.log('Setting default address:', addressId);
  };

  const mockAddresses = addresses;
  const stats = [
    { value: mockAddresses.length.toString(), label: 'Saved', color: 'text-blue-600' },
    { value: mockAddresses.filter(a => a.isDefault).length.toString(), label: 'Default', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen pb-6">
      <SellerSummaryHeader
        title="My Addresses"
        subtitle="Manage your delivery and pickup addresses"
        stats={stats}
        actionButton={{
          label: 'Add Address',
          icon: Plus,
          onClick: () => setIsAddingNew(true)
        }}
      />

      {/* Address Type Tabs - Mobile Friendly */}
      <div className="px-4">
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setAddressType('delivery')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              addressType === 'delivery'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setAddressType('pickup')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              addressType === 'pickup'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pickup Stations
          </button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="px-4 space-y-3">
        {addresses
          .filter(address => address.addressType === addressType)
          .map((address) => {
            const Icon = getAddressIcon(address.type, address.addressType);

            return (
              <Card key={address.id} className={`${address.isDefault ? 'ring-2 ring-primary/20' : ''} touch-manipulation`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm truncate">{address.label}</h3>
                          {address.isDefault && (
                            <Badge className="bg-primary/10 text-primary text-xs flex-shrink-0">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Default
                            </Badge>
                          )}
                          {address.addressType === 'pickup' && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              <Package className="w-3 h-3 mr-1" />
                              Pickup
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{address.name}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingAddress(address.id)}>
                          <Edit className="w-3 h-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!address.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                            <Star className="w-3 h-3 mr-2" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-3">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium break-words">{address.address}</p>
                      {address.apartment && <p className="break-words">{address.apartment}</p>}
                      <p className="break-words">{address.city}, {address.state} {address.zipCode}</p>
                      <p className="break-words">{address.country}</p>
                    </div>

                    {/* Pickup Station Specific Info */}
                    {address.addressType === 'pickup' && address.provider && (
                      <div className="mt-2 pt-2 border-t border-muted-foreground/10">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {address.provider}
                          </Badge>
                          {address.hours && (
                            <span className="text-muted-foreground">⏰ {address.hours}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-muted-foreground/10">
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="break-all">📞 {address.phone}</span>
                        {address.instructions && (
                          <span className="break-words">📝 {address.instructions}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs flex-1 min-w-[80px] max-w-[120px]"
                      onClick={() => setEditingAddress(address.id)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    {!address.isDefault && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs flex-1 min-w-[80px] max-w-[120px]"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Set Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

        {addresses.filter(address => address.addressType === addressType).length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              {addressType === 'delivery' ? (
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              ) : (
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              )}
              <h3 className="text-lg font-semibold mb-2">
                No {addressType === 'delivery' ? 'delivery addresses' : 'pickup stations'} saved
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {addressType === 'delivery' 
                  ? 'Add your delivery addresses to make checkout faster'
                  : 'Add pickup station addresses for convenient package collection'
                }
              </p>
              <Button onClick={() => setIsAddingNew(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add {addressType === 'delivery' ? 'Delivery Address' : 'Pickup Station'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddingNew || !!editingAddress} onOpenChange={(open) => {
        if (!open) {
          setIsAddingNew(false);
          setEditingAddress(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Address Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Address Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewAddress({...newAddress, addressType: 'delivery'})}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    newAddress.addressType === 'delivery'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🏠 Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setNewAddress({...newAddress, addressType: 'pickup'})}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    newAddress.addressType === 'pickup'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  📦 Pickup Station
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">Label</Label>
              <Input
                id="label"
                placeholder="Home, Work, UPS Store, etc."
                value={newAddress.label}
                onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                className="w-full"
              />
            </div>

            {/* Pickup Station Specific Fields */}
            {newAddress.addressType === 'pickup' && (
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-sm font-medium">Provider</Label>
                <Input
                  id="provider"
                  placeholder="UPS, FedEx, DHL, etc."
                  value={newAddress.provider}
                  onChange={(e) => setNewAddress({...newAddress, provider: e.target.value})}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Address</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>

            {/* Pickup Station Hours */}
            {newAddress.addressType === 'pickup' && (
              <div className="space-y-2">
                <Label htmlFor="hours" className="text-sm font-medium">Operating Hours</Label>
                <Input
                  id="hours"
                  placeholder="e.g., 9:00 AM - 7:00 PM"
                  value={newAddress.hours}
                  onChange={(e) => setNewAddress({...newAddress, hours: e.target.value})}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium">
                {newAddress.addressType === 'pickup' ? 'Additional Notes' : 'Delivery Instructions'}
              </Label>
              <Input
                id="instructions"
                placeholder={
                  newAddress.addressType === 'pickup' 
                    ? 'Any additional information...'
                    : 'Delivery instructions...'
                }
                value={newAddress.instructions}
                onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="default"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                className="rounded border-gray-300"
              />
              <Label htmlFor="default" className="text-sm font-medium">
                Set as default {newAddress.addressType === 'delivery' ? 'delivery' : 'pickup'} address
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAddingNew(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleSaveAddress}
            >
              Save Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileAddresses;