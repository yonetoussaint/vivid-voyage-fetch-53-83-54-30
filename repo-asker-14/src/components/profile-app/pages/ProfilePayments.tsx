import React, { useState } from 'react';
import { 
  CreditCard, Plus, Edit, Trash2, MoreHorizontal, 
  Shield, Star, Check, Eye, EyeOff
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

const ProfilePayments = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: '1',
      type: 'visa',
      name: 'Visa ending in 4242',
      cardNumber: '**** **** **** 4242',
      fullCardNumber: '4242 4242 4242 4242',
      expiryDate: '12/25',
      holderName: 'John Doe',
      isDefault: true,
      addedDate: '2023-06-15'
    },
    {
      id: '2',
      type: 'mastercard',
      name: 'Mastercard ending in 8888',
      cardNumber: '**** **** **** 8888',
      fullCardNumber: '5555 5555 5555 8888',
      expiryDate: '09/24',
      holderName: 'John Doe',
      isDefault: false,
      addedDate: '2023-03-10'
    },
    {
      id: '3',
      type: 'amex',
      name: 'American Express ending in 1005',
      cardNumber: '**** ****** *1005',
      fullCardNumber: '3782 822463 10005',
      expiryDate: '06/26',
      holderName: 'John Doe',
      isDefault: false,
      addedDate: '2023-01-20'
    }
  ];

  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    isDefault: false
  });

  const getCardIcon = (type: string) => {
    const iconProps = "w-8 h-5";
    switch (type) {
      case 'visa':
        return <div className={`${iconProps} bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold`}>VISA</div>;
      case 'mastercard':
        return <div className={`${iconProps} bg-red-600 rounded text-white flex items-center justify-center text-xs font-bold`}>MC</div>;
      case 'amex':
        return <div className={`${iconProps} bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold`}>AMEX</div>;
      default:
        return <CreditCard className={iconProps} />;
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const formatCardNumber = (number: string) => {
    const num = number.replace(/\s/g, '');
    const formatted = num.match(/.{1,4}/g)?.join(' ') || num;
    return formatted.substr(0, 19); // Max length for card number with spaces
  };

  const handleSaveCard = () => {
    // Save card logic here
    console.log('Saving card:', newCard);
    setIsAddingNew(false);
    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
      isDefault: false
    });
  };

  const handleDeleteCard = (cardId: string) => {
    // Delete card logic here
    console.log('Deleting card:', cardId);
  };

  const handleSetDefault = (cardId: string) => {
    // Set default card logic here
    console.log('Setting default card:', cardId);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Payment Methods</h1>
              <p className="text-xs text-muted-foreground">Manage your payment cards</p>
            </div>
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Card Number</Label>
                    <Input
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard(prev => ({ 
                        ...prev, 
                        cardNumber: formatCardNumber(e.target.value)
                      }))}
                      placeholder="1234 5678 9012 3456"
                      className="h-8 text-sm"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Expiry Date</Label>
                      <Input
                        value={newCard.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          setNewCard(prev => ({ ...prev, expiryDate: value }));
                        }}
                        placeholder="MM/YY"
                        className="h-8 text-sm"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">CVV</Label>
                      <Input
                        value={newCard.cvv}
                        onChange={(e) => setNewCard(prev => ({ 
                          ...prev, 
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                        }))}
                        placeholder="123"
                        className="h-8 text-sm"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Cardholder Name</Label>
                    <Input
                      value={newCard.holderName}
                      onChange={(e) => setNewCard(prev => ({ ...prev, holderName: e.target.value }))}
                      placeholder="John Doe"
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="setDefaultCard"
                      checked={newCard.isDefault}
                      onChange={(e) => setNewCard(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="setDefaultCard" className="text-xs">Set as default payment method</Label>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button onClick={handleSaveCard} size="sm" className="flex-1">
                      Add Card
                    </Button>
                    <Button onClick={() => setIsAddingNew(false)} variant="outline" size="sm" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Shield className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-800">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="px-4 space-y-3">
        {paymentMethods.map((card) => (
          <Card key={card.id} className={card.isDefault ? 'ring-2 ring-primary/20' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getCardIcon(card.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{card.name}</h3>
                      {card.isDefault && (
                        <Badge className="bg-primary/10 text-primary text-xs">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Expires {card.expiryDate}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-3 h-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {!card.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(card.id)}>
                        <Star className="w-3 h-3 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => setShowCardNumber(showCardNumber === card.id ? null : card.id)}
                    >
                      {showCardNumber === card.id ? (
                        <>
                          <EyeOff className="w-3 h-3 mr-2" />
                          Hide Number
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 mr-2" />
                          Show Number
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Card Number</span>
                    <span className="text-sm font-mono">
                      {showCardNumber === card.id ? card.fullCardNumber : card.cardNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Cardholder</span>
                    <span className="text-sm">{card.holderName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Added</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(card.addedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                {!card.isDefault && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs"
                    onClick={() => handleSetDefault(card.id)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Set Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {paymentMethods.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
              <p className="text-muted-foreground mb-4">
                Add a payment method to make checkout faster and easier
              </p>
              <Button onClick={() => setIsAddingNew(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security & Privacy
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Your payment information is encrypted with industry-standard SSL</p>
              <p>• We never store your CVV numbers</p>
              <p>• All transactions are processed securely</p>
              <p>• You can delete payment methods at any time</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePayments;