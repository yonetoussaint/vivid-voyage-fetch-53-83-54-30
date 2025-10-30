// hooks/useProductVariants.ts
import { useState, useMemo } from 'react';
import { Product, ProductVariant, ProductOption } from '@/types/variant';

export const useProductVariants = (product: Product) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Get available variants based on current selections
  const availableVariants = useMemo(() => {
    return product.variants.filter(variant => {
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        return variant.options[optionName] === optionValue;
      });
    });
  }, [product.variants, selectedOptions]);

  // Get current selected variant
  const selectedVariant = useMemo(() => {
    return product.variants.find(variant => {
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        return variant.options[optionName] === optionValue;
      });
    }) || product.variants.find(v => v.id === product.defaultVariantId) || product.variants[0];
  }, [product.variants, selectedOptions, product.defaultVariantId]);

  // Get available values for each option based on current selections
  const getAvailableOptionValues = (optionName: string) => {
    const currentSelections = { ...selectedOptions };
    delete currentSelections[optionName];

    const availableValues = new Set<string>();

    product.variants.forEach(variant => {
      // Check if variant matches all current selections
      const matchesCurrentSelections = Object.entries(currentSelections).every(
        ([key, value]) => variant.options[key] === value
      );

      if (matchesCurrentSelections && variant.isAvailable) {
        availableValues.add(variant.options[optionName]);
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
    resetSelections
  };
};