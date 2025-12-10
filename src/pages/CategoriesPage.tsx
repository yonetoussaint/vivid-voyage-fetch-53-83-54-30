import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, User, Plug, Monitor, Tv, Droplet, Baby, ShoppingCart, Home, Shirt, Users, Watch, Car } from 'lucide-react';

// Type definitions
interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  subCategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    id: "just",
    name: "Just for You",
    icon: User,
    subCategories: []
  },
  {
    id: "accessories",
    name: "Electronic Accessories",
    icon: Plug,
    subCategories: []
  },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      { id: "mobiles", name: "Mobiles", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "landline", name: "Landline Phones", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=200&h=200&auto=format&fit=crop" },
    ]
  },
  {
    id: "tv",
    name: "TV & Home Appliances",
    icon: Tv,
    subCategories: []
  },
  {
    id: "beauty",
    name: "Health & Beauty",
    icon: Droplet,
    subCategories: []
  },
  {
    id: "babies",
    name: "Babies & Toys",
    icon: Baby,
    subCategories: []
  },
  {
    id: "groceries",
    name: "Groceries & Pets",
    icon: ShoppingCart,
    subCategories: []
  },
  {
    id: "home",
    name: "Home & Lifestyle",
    icon: Home,
    subCategories: []
  },
  {
    id: "women",
    name: "Women's Fashion & Accessories",
    icon: Shirt,
    subCategories: []
  },
  {
    id: "men",
    name: "Men's Fashion & Accessories",
    icon: Users,
    subCategories: []
  },
  {
    id: "kids",
    name: "Kid's Fashion & Accessories",
    icon: Watch,
    subCategories: []
  },
  {
    id: "sports",
    name: "Sports & Lifestyle",
    icon: Car,
    subCategories: []
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);

  // Prevent scroll propagation between containers
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const content = contentRef.current;

    const handleWheel = (e: WheelEvent) => {
      const target = e.currentTarget as HTMLDivElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;
      
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      
      // Prevent scroll from propagating when at boundaries
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
      }
    };

    if (sidebar) {
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
    }

    if (content) {
      content.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('wheel', handleWheel);
      }
      if (content) {
        content.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden select-none">
      {/* Left sidebar - Fixed height with independent scrolling */}
      <div 
        ref={sidebarRef}
        className="w-24 bg-white flex-shrink-0 h-screen overflow-y-auto py-2"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full px-1.5 py-3 flex flex-col items-center text-center cursor-pointer transition-colors relative ${
                  selectedCategory === category.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mb-1 text-gray-700" />
                <span className="text-[8px] text-gray-800 leading-tight">{category.name}</span>
                {selectedCategory === category.id && (
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Scrollable independently */}
      <div 
        ref={contentRef}
        className="flex-1 h-screen overflow-y-auto p-2"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <div>
          {selectedCategoryData?.subCategories.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No subcategories available for {selectedCategoryData.name}</p>
            </div>
          ) : (
            <>
              {/* Section: Mobiles & Tablets */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-gray-900">Mobiles & Tablets</h2>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&h=300&auto=format&fit=crop" alt="Mobiles" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-900 text-center">Mobiles</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=300&h=300&auto=format&fit=crop" alt="Tablets" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-900 text-center">Tablets</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300&h=300&auto=format&fit=crop" alt="Landline Phones" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-gray-900 text-center">Landline Phones</span>
                  </div>
                </div>
              </div>

              {/* Product Suggestions Grid */}
              <div className="mt-8">
                <h2 className="text-base font-semibold text-gray-900 mb-4">You May Also Like</h2>
                <div className="grid grid-cols-2 gap-2">
                  {/* Product 1 */}
                  <div>
                    <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                      <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                        <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                        <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">SuperDeals</span>
                        Wireless Bluetooth Headphones Noise Cancel
                      </p>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] text-gray-500">234 sold</span>
                        <span className="text-[10px] text-gray-400">|</span>
                        <span className="text-[10px] text-gray-700">★ 4.8</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">79523</p>
                    </div>
                  </div>

                  {/* Product 2 */}
                  <div>
                    <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                      <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                        <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                        Smart Watch Fitness Tracker Heart Rate
                      </p>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[10px] text-gray-500">18081 sold</span>
                        <span className="text-[10px] text-gray-400">|</span>
                        <span className="text-[10px] text-gray-700">★ 4.7</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">67019</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        /* Prevent body scroll */
        html, body {
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
          position: fixed;
          width: 100%;
          touch-action: none;
        }
        
        /* Custom scrollbar styling for independent scrolling */
        * {
          box-sizing: border-box;
        }
        
        /* Hide default scrollbars but keep functionality */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
          margin: 2px 0;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        
        /* For Firefox */
        @supports (scrollbar-width: thin) {
          .overflow-y-auto {
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
          }
        }
        
        /* Prevent text selection while scrolling for better UX */
        .select-none {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .select-none * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}