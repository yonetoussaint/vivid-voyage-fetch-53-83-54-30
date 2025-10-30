// components/product/VariantSelector.tsx (Fixed with safe utilities)
import React from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/variant';
import { useProductVariants } from '@/hooks/useProductVariants';
import { safeObjectEntries } from '@/utils/productHelpers';

interface VariantSelectorProps {
  product?: Product | null;
  onVariantChange?: (variantId: string) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  product,
  onVariantChange,
  className
}) => {
  const {
    selectedOptions,
    selectedVariant,
    getAvailableOptionValues,
    isOptionValueAvailable,
    handleOptionSelect,
    hasVariants
  } = useProductVariants(product);

  // If no variants, show message
  if (!hasVariants) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No variants available for this product.</p>
      </div>
    );
  }

  const handleOptionClick = (optionName: string, optionValue: string) => {
    if (!isOptionValueAvailable(optionName, optionValue)) return;

    handleOptionSelect(optionName, optionValue);
    
    // Find the variant that matches the new selection
    const newSelections = { ...selectedOptions, [optionName]: optionValue };
    const newVariant = product?.variants?.find(variant => {
      return safeObjectEntries(newSelections).every(([key, value]) => {
        return variant.options?.[key] === value;
      });
    });

    if (newVariant && onVariantChange) {
      onVariantChange(newVariant.id);
    }
  };

  const renderOption = (option: any) => {
    const availableValues = getAvailableOptionValues(option.name);

    return (
      <div key={option.id} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
          </label>
          <span className="text-xs text-muted-foreground">
            {selectedOptions[option.name] || 'Select'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {option.values.map((value: string) => {
            const isAvailable = isOptionValueAvailable(option.name, value);
            const isSelected = selectedOptions[option.name] === value;
            
            return (
              <button
                key={value}
                onClick={() => handleOptionClick(option.name, value)}
                disabled={!isAvailable}
                className={cn(
                  "px-3 py-2 text-sm border rounded-md transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-gray-300 bg-background hover:border-gray-400",
                  !isAvailable && "opacity-40 cursor-not-allowed grayscale",
                  option.name === 'color' && "min-w-[60px]"
                )}
                title={!isAvailable ? 'Out of stock' : value}
              >
                {option.name === 'color' ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: value.toLowerCase() }}
                    />
                    <span className="text-xs">{value}</span>
                  </div>
                ) : (
                  value
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {product?.options?.map(renderOption)}
      
      {/* Selected variant info */}
      {selectedVariant && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SKU:</span>
            <span className="font-mono">{selectedVariant.sku}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Stock:</span>
            <span className={cn(
              "font-medium",
              selectedVariant.inventory > 10 ? "text-green-600" : 
              selectedVariant.inventory > 0 ? "text-amber-600" : "text-red-600"
            )}>
              {selectedVariant.inventory > 0 
                ? `${selectedVariant.inventory} available` 
                : 'Out of stock'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};