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
  const sidebarRef = useRef<HTMLDivElement>(null);

  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Categories</h1>
        </div>
        {/* Mobile Category Tabs */}
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex space-x-3 min-w-max">
            {CATEGORIES.slice(0, 6).map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center px-3 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{category.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Fixed position */}
      <div className="hidden md:block w-64 bg-white border-r flex-shrink-0 h-screen sticky top-0">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900">All Categories</h1>
        </div>
        <div 
          ref={sidebarRef}
          className="overflow-y-auto h-[calc(100vh-73px)]"
          style={{ 
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full px-4 py-3 flex items-center cursor-pointer transition-colors relative group ${
                  selectedCategory === category.id 
                    ? 'bg-blue-50 border-r-2 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <span className={`text-sm ${
                  selectedCategory === category.id ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}>{category.name}</span>
                {category.subCategories.length > 0 && (
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen">
        {/* Desktop Category Header */}
        <div className="hidden md:block bg-white border-b p-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategoryData?.name || "Categories"}
            </h2>
            <span className="ml-2 text-sm text-gray-500">
              ({selectedCategoryData?.subCategories.length || 0} subcategories)
            </span>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {selectedCategoryData?.subCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No subcategories available</p>
              <p className="text-sm text-gray-500">Check back later for updates</p>
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
                {selectedCategoryData?.subCategories.map((subCategory) => (
                  <div key={subCategory.id} className="group cursor-pointer">
                    <div className="aspect-square bg-white rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <img 
                        src={subCategory.imageUrl} 
                        alt={subCategory.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {subCategory.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">Browse products</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Featured Products Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
                    <p className="text-sm text-gray-600 mt-1">Popular items in {selectedCategoryData?.name}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Product Card 1 */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&h=600&auto=format&fit=crop" 
                        alt="Wireless Headphones" 
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">Sale</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                        Wireless Bluetooth Headphones Noise Cancelling
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">234 sold</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-700 ml-1">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">$79.52</span>
                        <span className="text-xs text-gray-400 line-through">$99.99</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Card 2 */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&h=600&auto=format&fit=crop" 
                        alt="Smart Watch" 
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">Top Seller</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                        Smart Watch Fitness Tracker Heart Rate Monitor
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">18,081 sold</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-700 ml-1">4.7</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">$67.01</span>
                        <span className="text-xs text-green-600 font-medium">-20%</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Card 3 */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=600&auto=format&fit=crop" 
                        alt="Wireless Speaker" 
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-medium">Premium</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                        Premium Wireless Speaker with Deep Bass
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">432 sold</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-700 ml-1">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">$89.99</span>
                        <span className="text-xs text-green-600 font-medium">Free Shipping</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Card 4 */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&h=600&auto=format&fit=crop" 
                        alt="Gaming Keyboard" 
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">Deal</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                        Mechanical Gaming Keyboard RGB Backlit
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">38 sold</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-700 ml-1">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">$76.75</span>
                        <span className="text-xs text-gray-400 line-through">$109.99</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended For You */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
                    <p className="text-sm text-gray-600 mt-1">Based on your browsing history</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    See more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        <img 
                          src={`https://images.unsplash.com/photo-${150000000 + item}?q=80&w=200&h=200&auto=format&fit=crop`}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        Product Title Here {item}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">$49.99</span>
                        <span className="text-xs text-gray-500">★ 4.5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}