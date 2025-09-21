import React, { useState } from 'react';
import { 
  MapPin, Plus, Edit, Trash2, MoreHorizontal, 
  Home, Building, Star, Check
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

const ProfileAddresses = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

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
      instructions: 'Ring doorbell twice'
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
      instructions: 'Leave with reception'
    },
    {
      id: '3',
      type: 'other',
      label: "Mom's House",
      name: 'Jane Doe',
      address: '789 Family Lane',
      apartment: '',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      country: 'United States',
      phone: '+1 (555) 345-6789',
      isDefault: false,
      instructions: ''
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
    isDefault: false
  });

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Building;
      default: return MapPin;
    }
  };

  const handleSaveAddress = () => {
    // Save address logic here
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
      isDefault: false
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    // Delete address logic here
    console.log('Deleting address:', addressId);
  };

  const handleSetDefault = (addressId: string) => {
    // Set default address logic here
    console.log('Setting default address:', addressId);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">My Addresses</h1>
              <p className="text-xs text-muted-foreground">Manage your delivery addresses</p>
            </div>
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Address Type</Label>
                      <Select value={newAddress.type} onValueChange={(value) => setNewAddress(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="work">Work</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={newAddress.label}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Home, Work, etc."
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Street Address</Label>
                    <Input
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Apartment, Suite, etc. (optional)</Label>
                    <Input
                      value={newAddress.apartment}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, apartment: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">City</Label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">State</Label>
                      <Input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">ZIP Code</Label>
                      <Input
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Country</Label>
                      <Select value={newAddress.country} onValueChange={(value) => setNewAddress(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Phone Number</Label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Delivery Instructions (optional)</Label>
                    <Input
                      value={newAddress.instructions}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Ring doorbell, leave at door, etc."
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="setDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="setDefault" className="text-xs">Set as default address</Label>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button onClick={handleSaveAddress} size="sm" className="flex-1">
                      Save Address
                    </Button>
                    <Button onClick={() => setIsAddingNew(false)} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Addresses List */}
      <div className="px-4 space-y-3">
        {addresses.map((address) => {
          const Icon = getAddressIcon(address.type);
          
          return (
            <Card key={address.id} className={address.isDefault ? 'ring-2 ring-primary/20' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{address.label}</h3>
                        {address.isDefault && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{address.name}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
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
                    <p className="font-medium">{address.address}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-muted-foreground/10">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>📞 {address.phone}</span>
                      {address.instructions && (
                        <span>📝 {address.instructions}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
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

        {addresses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-4">
                Add your delivery addresses to make checkout faster
              </p>
              <Button onClick={() => setIsAddingNew(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileAddresses;