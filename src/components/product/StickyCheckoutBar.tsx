
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, CreditCard, LogIn, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency, currencies, currencyToCountry } from '@/contexts/CurrencyContext';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { Button } from '@/components/ui/button';
import ProductVariants from './ProductVariants';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

// Payment Method Component
const PaymentMethod = ({ 
  method, 
  isSelected, 
  onSelect, 
  icon, 
  title, 
  description, 
  borderColor = 'blue' 
}) => {
  const borderColors = {
    blue: 'border-blue-500 bg-blue-50',
    orange: 'border-orange-500 bg-orange-50',
    gray: 'border-gray-200 hover:border-gray-300'
  };

  const bgColors = {
    blue: 'bg-blue-100',
    orange: 'bg-orange-100'
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? borderColors[borderColor] : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(method)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${bgColors[borderColor] || 'bg-gray-100'} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <div className="font-medium text-gray-900">{title}</div>
            <div className="text-sm text-gray-500">{description}</div>
          </div>
        </div>
        <div className={`w-4 h-4 rounded-full border-2 ${
          isSelected 
            ? `border-${borderColor}-500 bg-${borderColor}-500` 
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Payment Dialog with payment method selection
const MockPaymentDialog = ({ open, onOpenChange, product, quantity, totalPrice, selectedColor, selectedStorage, selectedNetwork, selectedCondition }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  if (!open) return null;

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    alert(`Payment processed successfully with ${selectedPaymentMethod}!`);
    onOpenChange(false);
    setSelectedPaymentMethod('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <PaymentMethod
            method="wallet"
            isSelected={selectedPaymentMethod === 'wallet'}
            onSelect={setSelectedPaymentMethod}
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            }
            title="Pay with Wallet"
            description="Use your digital wallet"
            borderColor="blue"
          />

          <PaymentMethod
            method="moncash"
            isSelected={selectedPaymentMethod === 'moncash'}
            onSelect={setSelectedPaymentMethod}
            icon={
              <img 
                src="/lovable-uploads/26276fb9-2443-4215-a6ae-d1d16e6c2f92.png" 
                alt="MonCash" 
                className="w-full h-full object-cover"
              />
            }
            title="Pay with Moncash"
            description="Mobile money payment"
            borderColor="orange"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              onOpenChange(false);
              setSelectedPaymentMethod('');
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handlePayment}
            disabled={!selectedPaymentMethod}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPaymentMethod
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

const StickyCheckoutBar = ({ 
  product,
  quantity = 1,
  onQuantityChange = (newQuantity) => {},
  selectedColor,
  onColorChange = (color) => {},
  selectedStorage,
  onStorageChange = (storage) => {},
  selectedNetwork,
  selectedCondition,
  selectedColorImage = null,
  onAddToCart = () => {},
  onBuyNow = () => {},
  cartItemCount = 0,
  onViewCart = () => {},
  currentPrice = null,
  currentStock = null,
  className = '',
  onImageSelect = (imageUrl: string, variantName: string) => {},
  onConfigurationChange = (configData: any) => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [variantConfig, setVariantConfig] = useState(null);
  const { isAuthenticated } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const { currentCurrency, formatPrice, convertPrice } = useCurrency();
  const navigate = useNavigate();

  // Use current stock from selected variant or product inventory
  const stockLeft = currentStock !== null ? currentStock : (product?.inventory || 0);

  // Price calculations using shared currency context
  const basePrice = currentPrice || (() => {
    if (product?.storage_variants) {
      const storage = product.storage_variants.find(v => v.name === selectedStorage);
      return storage?.price || product?.price || 0;
    }
    return product?.price || 0;
  })();

  const isDiscountActive = product.discount && product.discount.active;
  const discountMultiplier = isDiscountActive ? (1 - product.discount.percentage / 100) : 1;

  const unitPrice = basePrice * discountMultiplier;
  const totalPrice = convertPrice(unitPrice * quantity);
  const totalOriginalPrice = convertPrice(basePrice * quantity);
  const discountAmount = totalOriginalPrice - totalPrice;

  // Action handlers
  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      openAuthOverlay();
      setIsExpanded(false);
      return;
    }

    // Show variants panel when Add to Cart is clicked
    setIsExpanded(true);
    setShowVariants(true);
    setShowPaymentMethods(false);
  };

  const handleVariantConfigChange = (configData) => {
    setVariantConfig(configData);
  };

  const handleFinalAddToCart = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart();
    }
    setIsExpanded(false);
    setShowVariants(false);
  };

  const handleProceedToPayment = () => {
    setShowVariants(false);
    setShowPaymentMethods(true);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openAuthOverlay();
      setIsExpanded(false);
      return;
    }
    setShowPaymentMethods(true);
  };

  const handleViewCart = () => {
    console.log('🛒 Cart button clicked! Navigating to cart page...');
    // Always try to use the provided onViewCart function first
    if (typeof onViewCart === 'function') {
      console.log('🛒 Using provided onViewCart function');
      onViewCart();
    } else {
      console.log('🛒 Using default navigation to /cart');
      // Default navigation to cart page using React Router
      navigate('/cart');
    }
  };

  const handleContinuePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'moncash') {
      try {
        const response = await fetch('https://app.pgecom.com/api/v1/moncash/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gdes: totalPrice,
            userID: "ec5f6d89-fe96-4d0c-aaab-cf4fcdc445ac",
            successUrl: window.location.origin + "/success",
            description: `Payment for ${product.name}`,
            referenceId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            errorUrl: window.location.origin + "/error",
            customerFirstName: "",
            customerLastName: "",
            customerEmail: "",
            metadata: {
              productName: product.name,
              quantity: quantity,
              color: selectedColor,
              storage: selectedStorage,
              network: selectedNetwork,
              condition: selectedCondition
            }
          })
        });

        if (!response.ok) {
          throw new Error('Payment request failed');
        }

        const data = await response.json();

        // Redirect to provided URL (redirectUrl preferred)
        const redirect = data.redirectUrl || data.paymentUrl || data.url;
        if (redirect) {
          window.location.href = redirect;
        } else {
          console.warn('No redirect URL found in response:', data);
          alert('MonCash payment initiated, but no redirect URL was provided.');
        }
      } catch (error) {
        console.error('MonCash payment error:', error);
        alert('Failed to process MonCash payment. Please try again.');
        return;
      }
    } else {
      alert(`Payment processed successfully with ${selectedPaymentMethod}!`);
    }

    setIsExpanded(false);
    setShowPaymentMethods(false);
    setSelectedPaymentMethod('');
  };

  if (!product) {
    return null;
  }

  return (
    <>
      {/* Sticky Bottom Bar - Three Buttons */}
      <div className={`fixed bottom-0 left-0 right-0 z-[60] transition-all duration-300 ease-out ${className}`}>
        {/* Three Button Layout */}
        {!isExpanded && (
          <div className="p-2 bg-white border-t border-gray-200 flex gap-2">
            {/* Cart Button with Item Count */}
            <button 
              onClick={handleViewCart}
              className="relative w-10 h-10 bg-white border border-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Add to Cart Button - Now expands the panel */}
            <button 
              onClick={handleAddToCartClick}
              className="flex-1 py-2 bg-white border border-gray-300 text-gray-800 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
            >
              Add to Cart
            </button>

            {/* Checkout Button - Now expands the panel */}
            <button 
              onClick={() => setIsExpanded(true)}
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* SlideUpPanel for Variants and Payment */}
      <SlideUpPanel
        isOpen={isExpanded}
        onClose={() => {
          setIsExpanded(false);
          setShowVariants(false);
          setShowPaymentMethods(false);
        }}
        showCloseButton={false}
        preventBodyScroll={true}
        className="p-4"
        stickyFooter={
          <div className="px-4 py-4">
            {showVariants ? (
              <button 
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 shadow-lg"
              >
                Continue to Payment
              </button>
            ) : showPaymentMethods ? (
              <button 
                onClick={handleContinuePayment}
                disabled={!selectedPaymentMethod}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                  selectedPaymentMethod
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue Payment
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCartClick}
                  className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 shadow-lg"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        }
      >
        {showVariants ? (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose your options</h3>
            <div className="w-full">
              <ProductVariants
                productId={product?.id}
                onImageSelect={onImageSelect}
                onConfigurationChange={handleVariantConfigChange}
              />
            </div>
          </div>
        ) : showPaymentMethods ? (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose Payment Method</h3>
            <div className="space-y-3">
              <PaymentMethod
                method="wallet"
                isSelected={selectedPaymentMethod === 'wallet'}
                onSelect={setSelectedPaymentMethod}
                icon={
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
                title="Pay with Wallet"
                description="Use your digital wallet"
                borderColor="blue"
              />

              <PaymentMethod
                method="moncash"
                isSelected={selectedPaymentMethod === 'moncash'}
                onSelect={setSelectedPaymentMethod}
                icon={
                  <img 
                    src="/lovable-uploads/26276fb9-2443-4215-a6ae-d1d16e6c2f92.png" 
                    alt="MonCash" 
                    className="w-full h-full object-cover"
                  />
                }
                title="Pay with Moncash"
                description="Mobile money payment"
                borderColor="orange"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Select an option to continue</p>
          </div>
        )}
      </SlideUpPanel>

      {/* Mock Payment Dialog */}
      <MockPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        product={product}
        quantity={quantity}
        selectedColor={selectedColor}
        selectedStorage={selectedStorage}
        selectedNetwork={selectedNetwork}
        selectedCondition={selectedCondition}
        totalPrice={formatPrice(unitPrice * quantity)}
      />
    </>
  );
};

export default StickyCheckoutBar;
