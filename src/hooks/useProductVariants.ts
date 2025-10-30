// hooks/useProductVariants.ts (Fixed)
import { useState, useMemo } from 'react';
import { Product, ProductVariant, ProductOption } from '@/types/variant';

// Default empty product to prevent crashes
const defaultProduct: Product = {
  id: '',
  title: '',
  description: '',
  category: '',
  tags: [],
  options: [],
  variants: [],
  defaultVariantId: ''
};

export const useProductVariants = (product?: Product | null) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Use provided product or default empty product
  const safeProduct = product || defaultProduct;

  // Get available variants based on current selections
  const availableVariants = useMemo(() => {
    if (!safeProduct.variants || safeProduct.variants.length === 0) {
      return [];
    }
    
  return safeProduct.variants.filter(variant => {
    return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
      return (variant.options?.[optionName]) === optionValue;
    });
  });
  }, [safeProduct.variants, selectedOptions]);

  // Get current selected variant
  const selectedVariant = useMemo(() => {
    if (!safeProduct.variants || safeProduct.variants.length === 0) {
      return null;
    }

    const foundVariant = safeProduct.variants.find(variant => {
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        return (variant.options?.[optionName]) === optionValue;
      });
    });

    return foundVariant || 
           safeProduct.variants.find(v => v.id === safeProduct.defaultVariantId) || 
           safeProduct.variants[0] ||
           null;
  }, [safeProduct.variants, selectedOptions, safeProduct.defaultVariantId]);

  // Get available values for each option based on current selections
  const getAvailableOptionValues = (optionName: string) => {
    if (!safeProduct.variants || safeProduct.variants.length === 0) {
      return [];
    }

    const currentSelections = { ...selectedOptions };
    delete currentSelections[optionName];

    const availableValues = new Set<string>();

    safeProduct.variants.forEach(variant => {
      // Check if variant matches all current selections
      const matchesCurrentSelections = Object.entries(currentSelections).every(
        ([key, value]) => (variant.options?.[key]) === value
      );

      const valueForOption = variant.options?.[optionName];
      if (matchesCurrentSelections && variant.isAvailable && valueForOption) {
        availableValues.add(valueForOption);
      }
    });

    return Array.from(availableValues);
  };

  // Check if an option value is available
  const isOptionValueAvailable = (optionName: string, optionValue: string) => {
    return getAvailableOptionValues(optionName).includes(optionValue);
  };

  // Handle option selection
  const handleOptionSelect = (optionName: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: optionValue
    }));
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedOptions({});
  };

  return {
    selectedOptions,
    selectedVariant,
    availableVariants,
    getAvailableOptionValues,
    isOptionValueAvailable,
    handleOptionSelect,
    resetSelections,
    hasVariants: safeProduct.variants && safeProduct.variants.length > 0
  };
};