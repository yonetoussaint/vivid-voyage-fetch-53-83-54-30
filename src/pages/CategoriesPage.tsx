import React, { useState } from "react";
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
      { id: "traditional", name: "Traditional Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "2in1", name: "2-in-1s", imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "allinone", name: "All-In-One", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "gaming", name: "Gaming Desktops", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "diy", name: "DIY", imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "fitness", name: "Fitness Trackers & Accessories", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "smart", name: "Smart Trackers", imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "console", name: "Console", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "games", name: "Console Games", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "accessories", name: "Console Gaming Accessories", imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=200&h=200&auto=format&fit=crop" },
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

  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="bg-gray-50 h-screen flex">
      {/* Left sidebar - Fixed height with independent scrolling */}
      <div 
        className="w-24 bg-white flex-shrink-0 h-screen flex flex-col"
      >
        <div 
          className="flex-1 overflow-y-auto py-2"
          style={{ overscrollBehavior: 'contain' }}
        >
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
      <div className="flex-1 h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
          <div className="p-4">
            {selectedCategoryData?.subCategories.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No subcategories available for {selectedCategoryData.name}</p>
              </div>
            ) : (
              <>
                {/* Section: Mobiles & Tablets */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Mobiles & Tablets</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&h=300&auto=format&fit=crop" alt="Mobiles" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Mobiles</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=300&h=300&auto=format&fit=crop" alt="Tablets" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Tablets</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300&h=300&auto=format&fit=crop" alt="Landline Phones" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Landline Phones</span>
                    </div>
                  </div>
                </div>

                {/* Section: Laptops */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Laptops</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&h=300&auto=format&fit=crop" alt="Traditional Laptops" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Traditional Laptops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=300&h=300&auto=format&fit=crop" alt="2-in-1s" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">2-in-1s</span>
                    </div>
                  </div>
                </div>

                {/* Section: Desktop Computers */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Desktop Computers</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=300&h=300&auto=format&fit=crop" alt="All-In-One" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">All-In-One</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=300&h=300&auto=format&fit=crop" alt="Gaming Desktops" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Gaming Desktops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=300&h=300&auto=format&fit=crop" alt="DIY" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">DIY</span>
                    </div>
                  </div>
                </div>

                {/* Section: Smartwatches & Accessories */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Smartwatches & Accessories</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=300&h=300&auto=format&fit=crop" alt="Fitness Trackers" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Fitness Trackers & Accessories</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=300&h=300&auto=format&fit=crop" alt="Smart Trackers" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Smart Trackers</span>
                    </div>
                  </div>
                </div>

                {/* Section: Console Gaming */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Console Gaming</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=300&h=300&auto=format&fit=crop" alt="Console" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Console</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop" alt="Console Games" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Console Games</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=300&h=300&auto=format&fit=crop" alt="Gaming Accessories" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-900">Console Gaming Accessories</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}