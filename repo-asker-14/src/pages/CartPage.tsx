import React, { useState, useRef, useEffect } from 'react';
import { X, Edit, Truck, Tag, ChevronDown, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 14",
      variants: ["Red", "128GB", "Unlocked", "Refurbished"],
      price: 599.00,
      quantity: 1,
      image: "iphone"
    },
    {
      id: 2,
      name: "Oral Solution 5 ml", 
      price: 41.00,
      quantity: 1,
      image: "oral"
    }
  ]);

  const [scrollStates, setScrollStates] = useState({});

  const updateScrollState = (itemId, element) => {
    const canScrollLeft = element.scrollLeft > 0;
    const canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth);

    setScrollStates(prev => ({
      ...prev,
      [itemId]: { canScrollLeft, canScrollRight }
    }));
  };

  useEffect(() => {
    // Initialize scroll states
    cartItems.forEach(item => {
      if (item.variants) {
        const element = document.getElementById(`scroll-${item.id}`);
        if (element) {
          updateScrollState(item.id, element);
        }
      }
    });
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 1000 ? 0 : 19.00;
  const total = subtotal + shippingCost;
  const freeShippingThreshold = 1000.00;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const ProductImage = ({ type, name }) => {
    if (type === "iphone") {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative">
          <div className="w-10 h-12 bg-red-600 border-2 border-gray-800 flex flex-col justify-between p-1">
            <div className="w-full h-1 bg-gray-800"></div>
            <div className="w-full h-6 bg-gray-800"></div>
            <div className="w-4 h-1 bg-gray-800 mx-auto"></div>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-orange-500 flex items-center justify-center">
        <div className="bg-white text-orange-600 text-xs font-semibold px-2 py-1">
          5ml
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col">
      {/* Pickup Station */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Truck className="w-3 h-3" />
            <span>Pickup Station</span>
          </div>
          <div className="flex items-center gap-1 text-gray-900">
            <span>Downtown Station #4</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-28 space-y-6">

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded-xl">
              <div className="flex gap-3">
                {/* Product Image and Quantity */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden">
                    <ProductImage type={item.image} name={item.name} />
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 text-xs h-6 rounded-full overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-1 py-1 bg-white h-full flex items-center"
                    >
                      <Minus className="w-2 h-2 text-gray-600" />
                    </button>
                    <div className="px-2 font-medium bg-white border-l border-r border-gray-300 min-w-[1.5rem] text-center h-full flex items-center justify-center">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-1 py-1 bg-white h-full flex items-center"
                    >
                      <Plus className="w-2 h-2 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Top section: Title + Shipping + Variants (exactly match image height) */}
                  <div style={{ height: '56px' }} className="flex flex-col justify-between">
                    <div className="flex justify-between items-start min-h-[18px]">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">{item.name}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="p-0.5">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => removeItem(item.id)}>
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Shipping fees row */}
                    <div className="flex items-center text-xs text-gray-600 min-h-[16px]">
                      <Truck className="w-3 h-3 mr-1" />
                      <span>Ships for ${(shippingCost * item.quantity / cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0)).toFixed(2)}</span>
                    </div>

                    {/* Variants section */}
                    <div className="flex items-center min-h-[18px]">
                      {item.variants ? (
                        <div className="relative w-full">
                          <div 
                            className="overflow-x-auto scrollbar-hide" 
                            id={`scroll-${item.id}`}
                            onScroll={(e) => updateScrollState(item.id, e.target)}
                          >
                            <div className="flex gap-1 pr-3">
                              {item.variants.map((variant, index) => (
                                <span key={index} className="inline-flex items-center text-xs text-gray-700 bg-white px-2 py-0.5 border border-gray-300 whitespace-nowrap flex-shrink-0">
                                  {variant}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Left scroll indicator */}
                          {scrollStates[item.id]?.canScrollLeft && (
                            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 from-50% to-transparent pointer-events-none flex items-center">
                              <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </div>
                          )}

                          {/* Right scroll indicator */}
                          {scrollStates[item.id]?.canScrollRight !== false && (
                            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 from-50% to-transparent pointer-events-none flex items-center justify-end">
                              <ChevronRight className="w-4 h-4 text-gray-700" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Standard option</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom section: Price (h-6 to match quantity selector) */}
                  <div className="h-6 flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} each
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-sm mx-auto">
          {/* Compact Order Summary */}
          <div className="mb-2">
            {/* Subtotal and Total in one line */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Subtotal: ${subtotal.toFixed(2)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Shipping: {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>

            {/* Free Shipping Status - Only when needed */}
            {subtotal < freeShippingThreshold && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-gray-600 font-medium whitespace-nowrap">
                  ${remaining.toFixed(2)} for FREE shipping
                </span>
              </div>
            )}

            {/* Free shipping earned - compact version */}
            {subtotal >= freeShippingThreshold && (
              <div className="flex items-center justify-center gap-1 text-xs text-orange-700 bg-orange-50 rounded px-2 py-0.5">
                <Truck className="w-3 h-3" />
                <span className="font-medium">FREE SHIPPING earned!</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button className="flex items-center justify-center bg-gray-100 text-gray-600 px-3 py-3 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">TG</span>
            </button>
            <button className="flex items-center justify-center bg-gray-100 text-gray-600 px-3 py-3 rounded-lg">
              <Tag className="w-4 h-4" />
            </button>
            <button className="flex-1 bg-orange-500 text-white font-bold py-3 text-sm tracking-wider rounded-lg">
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}