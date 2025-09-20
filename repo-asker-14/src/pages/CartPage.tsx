
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, AlertTriangle, Shield, Heart, Share2, Eye, Store, Star, Truck, CheckCircle, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    seller: {
      id: string;
      name: string;
      verified: boolean;
      rating: number;
    };
    variants?: {
      color?: string;
      storage?: string;
      network?: string;
      condition?: string;
    };
    shippingInfo: {
      free: boolean;
      estimatedDays: string;
      method: string;
    };
    stock: number;
    badges?: string[];
  };
  quantity: number;
  selected: boolean;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentCurrency, formatPrice, convertPrice } = useCurrency();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      product: {
        id: 'prod1',
        name: 'iPhone 15 Pro Max - Latest Model with Advanced Camera System',
        image: '/placeholder.svg',
        price: 1199,
        originalPrice: 1399,
        rating: 4.8,
        reviewCount: 2340,
        seller: {
          id: 'seller1',
          name: 'Apple Official Store',
          verified: true,
          rating: 4.9
        },
        variants: {
          color: 'Natural Titanium',
          storage: '256GB',
          network: 'Unlocked'
        },
        shippingInfo: {
          free: true,
          estimatedDays: '3-5',
          method: 'Express'
        },
        stock: 15,
        badges: ['Best Seller', 'Fast Shipping']
      },
      quantity: 1,
      selected: true
    },
    {
      id: '2',
      product: {
        id: 'prod2',
        name: 'MacBook Air M3 - Ultra Portable Laptop for Professionals',
        image: '/placeholder.svg',
        price: 1099,
        originalPrice: 1299,
        rating: 4.7,
        reviewCount: 1856,
        seller: {
          id: 'seller1',
          name: 'Apple Official Store',
          verified: true,
          rating: 4.9
        },
        variants: {
          color: 'Space Gray',
          storage: '512GB',
          network: 'WiFi + Cellular'
        },
        shippingInfo: {
          free: true,
          estimatedDays: '2-4',
          method: 'Standard'
        },
        stock: 8,
        badges: ['Limited Stock']
      },
      quantity: 2,
      selected: true
    }
  ]);

  const [selectAll, setSelectAll] = useState(true);
  const [showSecurityNotice, setShowSecurityNotice] = useState(true);

  // Check if all items are from the same seller
  const sellerId = cartItems.length > 0 ? cartItems[0].product.seller.id : null;
  const allFromSameSeller = cartItems.every(item => item.product.seller.id === sellerId);

  // Calculate totals
  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const originalTotal = selectedItems.reduce((sum, item) => sum + ((item.product.originalPrice || item.product.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const shipping = selectedItems.some(item => !item.product.shippingInfo.free) ? 9.99 : 0;
  const total = subtotal + shipping;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const toggleItemSelection = (itemId: string) => {
    setCartItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(items => 
      items.map(item => ({ ...item, selected: newSelectAll }))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">Your cart is waiting for you. Sign in to continue shopping.</p>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold">Shopping Cart</h1>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="p-8 text-center max-w-md w-full">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Shopping Cart</h1>
            <Badge variant="secondary">{cartItems.length} items</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-32">
        {/* Security Notice */}
        {showSecurityNotice && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-orange-900">Security Notice</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowSecurityNotice(false)}
                      className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-orange-800 mt-1">
                    For security reasons, your cart can only contain products from one seller at a time. 
                    To add products from a different seller, please clear your cart first.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Select All */}
            <Card className="mb-4">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="font-medium">Select All ({cartItems.length} items)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {cartItems[0]?.product.seller.name}
                    </span>
                    {cartItems[0]?.product.seller.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <Checkbox 
                        checked={item.selected}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                        className="mt-2"
                      />

                      {/* Product Image */}
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                        />
                        {item.product.badges && item.product.badges.length > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 text-xs px-1 py-0 h-5"
                          >
                            {item.product.badges[0]}
                          </Badge>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 line-clamp-2 pr-2">
                            {item.product.name}
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Variants */}
                        {item.product.variants && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.product.variants.color && (
                              <Badge variant="outline" className="text-xs">
                                {item.product.variants.color}
                              </Badge>
                            )}
                            {item.product.variants.storage && (
                              <Badge variant="outline" className="text-xs">
                                {item.product.variants.storage}
                              </Badge>
                            )}
                            {item.product.variants.network && (
                              <Badge variant="outline" className="text-xs">
                                {item.product.variants.network}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{item.product.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({item.product.reviewCount.toLocaleString()} reviews)
                          </span>
                        </div>

                        {/* Shipping Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <Truck className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">
                            {item.product.shippingInfo.free ? 'Free shipping' : 'Shipping: $9.99'}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {item.product.shippingInfo.estimatedDays} days
                          </span>
                        </div>

                        {/* Price & Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-orange-600">
                                {currencies[currentCurrency]}{formatPrice(convertPrice(item.product.price))}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">
                                  {currencies[currentCurrency]}{formatPrice(convertPrice(item.product.originalPrice))}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.product.stock} in stock
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-full">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 rounded-full p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="h-8 w-8 rounded-full p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            <Heart className="w-3 h-3 mr-1" />
                            Save for later
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            <Share2 className="w-3 h-3 mr-1" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            <Eye className="w-3 h-3 mr-1" />
                            View details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Items Count */}
                <div className="flex justify-between text-sm">
                  <span>Items ({selectedItems.length})</span>
                  <span>{currencies[currentCurrency]}{formatPrice(convertPrice(subtotal))}</span>
                </div>

                {/* Savings */}
                {savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span>-{currencies[currentCurrency]}{formatPrice(convertPrice(savings))}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? 'Free' : `${currencies[currentCurrency]}${formatPrice(convertPrice(shipping))}`}
                  </span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {currencies[currentCurrency]}{formatPrice(convertPrice(total))}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                  size="lg"
                >
                  Proceed to Checkout ({selectedItems.length})
                </Button>

                {/* Security Features */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Fast & reliable shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>30-day return policy</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" className="w-full text-sm text-orange-600">
                    <Plus className="w-4 h-4 mr-1" />
                    Apply promo code
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recently Viewed */}
            <Card className="mt-4">
              <div className="p-4 border-b">
                <h3 className="font-medium">Recently Viewed</h3>
              </div>
              <div className="p-4">
                <div className="text-center text-sm text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No recently viewed items
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
