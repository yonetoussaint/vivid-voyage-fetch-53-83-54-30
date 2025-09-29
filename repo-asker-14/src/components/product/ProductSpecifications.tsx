import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Leaf, Shield, Award, Truck,
  Settings, Zap, Star, Heart, Package, Box, Layers, Clock,
  Target, Globe, Droplet, Thermometer, Calendar, Users
} from 'lucide-react';

interface ProductSpecificationsProps {
  product?: {
    specifications?: {
      title: string;
      icon: string;
      items: { label: string; value: string; }[];
    }[];
  };
}

const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Leaf': return <Leaf className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Truck': return <Truck className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'Droplet': return <Droplet className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const specifications = product?.specifications || [];
  
  console.log('📋 ProductSpecifications - Received specifications:', specifications);

  // Don't render anything if no specifications are available
  if (!specifications || specifications.length === 0) {
    console.log('📋 ProductSpecifications - No specifications available, not rendering');
    return null;
  }

  return (
    <div className="bg-white py-4 space-y-4">
      <h3 className="text-lg font-semibold">Product Specifications</h3>

      <div className="space-y-3">
        {specifications.map((section, index) => (
          <div key={index} className="bg-gray-100 rounded-lg">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                {getIconComponent(section.icon)}
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSections.includes(section.title) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.includes(section.title) && (
              <div className="bg-gray-100">
                <div className="p-3 space-y-2 bg-gray-100">
                  {section.items
                    .filter(item => item.label && item.value) // Only show items with both label and value
                    .map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-800 font-medium">{item.label}:</span>
                      <span className="text-gray-600 text-right flex-1 ml-4">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Only show certifications if there are specifications */}
      {specifications.length > 0 && (
        <div className="pt-4">
          <h4 className="font-medium mb-3">Certifications & Quality</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              <Leaf className="w-3 h-3" />
              100% Natural
            </div>
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              <Shield className="w-3 h-3" />
              Dermatologist Tested
            </div>
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              <Award className="w-3 h-3" />
              Cruelty Free
            </div>
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
              <Leaf className="w-3 h-3" />
              Vegan Friendly
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
import React from "react";
import SectionHeader from "@/components/home/SectionHeader";
import { useProduct } from "@/hooks/useProduct";
import { Settings } from "lucide-react";

interface ProductSpecificationsProps {
  productId?: string;
  title?: string;
  titleTransform?: "uppercase" | "capitalize" | "none";
  titleSize?: "xs" | "sm" | "base" | "lg" | "xl";
  showViewAll?: boolean;
  viewAllLink?: string;
  viewAllText?: string;
  compact?: boolean;
  className?: string;
}

export default function ProductSpecifications({
  productId,
  title = "Specifications",
  titleTransform = "uppercase",
  titleSize = "xs",
  showViewAll = false,
  viewAllLink = "#specifications",
  viewAllText = "View All",
  compact = false,
  className = ""
}: ProductSpecificationsProps) {
  const { data: product, isLoading: loading, error } = useProduct(productId);

  console.log('🔧 ProductSpecifications Debug:', {
    productId,
    hasProduct: !!product,
    hasSpecifications: !!product?.specifications,
    specificationsLength: product?.specifications?.length || 0,
    loading,
    error
  });

  // Show loading state
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={Settings}
        />
        <div className="space-y-2 mt-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={Settings}
        />
        <p className="text-red-500 text-sm mt-2">Failed to load product specifications</p>
      </div>
    );
  }

  // Check if we have product but no productId was provided
  if (!productId) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={Settings}
        />
        <p className="text-yellow-600 text-sm mt-2">No product ID provided</p>
      </div>
    );
  }

  // Don't render anything if no product
  if (!product) {
    return (
      <div className={className}>
        <SectionHeader
          title={title}
          titleTransform={titleTransform}
          titleSize={titleSize}
          icon={Settings}
        />
        <p className="text-gray-500 text-sm mt-2">Product not found</p>
      </div>
    );
  }

  // Get specifications - check if they exist and have content
  const specifications = product.specifications || [];
  
  // Don't render if no specifications are available
  if (!specifications.length) {
    return null;
  }

  return (
    <section className={className}>
      <SectionHeader
        title={title}
        subtitle="Technical details and features"
        icon={Settings}
        viewAllLink={showViewAll ? viewAllLink : undefined}
        viewAllText={viewAllText}
        titleTransform={titleTransform}
        titleSize={titleSize}
        compact={compact}
      />
      
      <div className={`px-2 ${compact ? 'mt-1' : 'mt-3'}`}>
        <div className="space-y-2">
          {specifications.slice(0, compact ? 2 : 3).map((spec, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-900 text-sm mb-2">{spec.title}</h4>
              <div className="space-y-1">
                {spec.items.slice(0, compact ? 2 : 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-xs">
                    <span className="text-gray-600">{item.label}:</span>
                    <span className="text-gray-900 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {specifications.length > (compact ? 2 : 3) && (
            <p className="text-xs text-gray-500 text-center mt-2">
              +{specifications.length - (compact ? 2 : 3)} more specifications
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
