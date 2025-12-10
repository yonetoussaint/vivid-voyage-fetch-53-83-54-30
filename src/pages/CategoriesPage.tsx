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
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);

  // Prevent scroll propagation between containers
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const content = contentRef.current;

    const preventScrollPropagation = (e: WheelEvent) => {
      // Stop the event from bubbling up to parent containers
      e.stopPropagation();
      
      const target = e.currentTarget as HTMLDivElement;
      const isAtTop = target.scrollTop <= 0;
      const isAtBottom = Math.abs(target.scrollTop + target.clientHeight - target.scrollHeight) <= 1;
      
      // Only prevent default when at boundaries to maintain native scroll feel
      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
      }
    };

    const preventTouchScrollPropagation = (e: TouchEvent) => {
      // For touch devices, prevent the event from bubbling
      e.stopPropagation();
    };

    if (sidebar) {
      sidebar.addEventListener('wheel', preventScrollPropagation, { passive: false });
      sidebar.addEventListener('touchmove', preventTouchScrollPropagation, { passive: false });
    }

    if (content) {
      content.addEventListener('wheel', preventScrollPropagation, { passive: false });
      content.addEventListener('touchmove', preventTouchScrollPropagation, { passive: false });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('wheel', preventScrollPropagation);
        sidebar.removeEventListener('touchmove', preventTouchScrollPropagation);
      }
      if (content) {
        content.removeEventListener('wheel', preventScrollPropagation);
        content.removeEventListener('touchmove', preventTouchScrollPropagation);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden select-none">
      {/* Left sidebar - Fixed height with independent scrolling */}
      <div 
        ref={sidebarRef}
        className="w-24 bg-white flex-shrink-0 h-screen flex flex-col overflow-hidden"
      >
        <div 
          className="flex-1 overflow-y-auto py-2"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
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
      </div>

      {/* Main Content Area - Scrollable independently */}
      <div 
        ref={contentRef}
        className="flex-1 h-screen overflow-hidden flex flex-col"
      >
        <div 
          className="flex-1 overflow-y-auto" 
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
          }}
        >
          <div className="p-2">
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

                {/* Section: Laptops */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900">Laptops</h2>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&h=300&auto=format&fit=crop" alt="Traditional Laptops" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Traditional Laptops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=300&h=300&auto=format&fit=crop" alt="2-in-1s" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">2-in-1s</span>
                    </div>
                  </div>
                </div>

                {/* Section: Desktop Computers */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900">Desktop Computers</h2>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=300&h=300&auto=format&fit=crop" alt="All-In-One" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">All-In-One</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=300&h=300&auto=format&fit=crop" alt="Gaming Desktops" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Gaming Desktops</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=300&h=300&auto=format&fit=crop" alt="DIY" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">DIY</span>
                    </div>
                  </div>
                </div>

                {/* Section: Smartwatches & Accessories */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900">Smartwatches & Accessories</h2>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=300&h=300&auto=format&fit=crop" alt="Fitness Trackers" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Fitness Trackers & Accessories</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=300&h=300&auto=format&fit=crop" alt="Smart Trackers" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Smart Trackers</span>
                    </div>
                  </div>
                </div>

                {/* Section: Console Gaming */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-gray-900">Console Gaming</h2>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=300&h=300&auto=format&fit=crop" alt="Console" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Console</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop" alt="Console Games" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Console Games</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=300&h=300&auto=format&fit=crop" alt="Gaming Accessories" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-900 text-center">Console Gaming Accessories</span>
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
                        <p className="text-[10px] text-gray-500">Top selling on AliExpress</p>
                      </div>
                    </div>

                    {/* Product 3 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                          <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">SuperDeals</span>
                          Sport Smart Watch Fitness Call
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">1361 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 4.6</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">105730</p>
                        <p className="text-[10px] text-orange-600">Premium Quality</p>
                      </div>
                    </div>

                    {/* Product 4 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Brand+</span>
                          <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                          30 36 Inch Curly Highlight Wig Human
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">637 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 4.7</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">741510</p>
                        <p className="text-[10px] text-gray-500">Top selling on AliExpress</p>
                      </div>
                    </div>

                    {/* Product 5 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                          Premium Wireless Speaker Deep Bass
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">432 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 4.8</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">89990</p>
                      </div>
                    </div>

                    {/* Product 6 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Certified Original</span>
                          HD Webcam 1080P Built-in Microphone
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">789 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 5.0</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">49990</p>
                        <p className="text-[10px] text-orange-600">Premium Quality</p>
                      </div>
                    </div>

                    {/* Product 7 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Sale</span>
                          <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">250%</span>
                          Mechanical Gaming Keyboard RGB
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">38 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 4.8</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">767523</p>
                        <p className="text-[10px] text-orange-600">Premium Quality</p>
                      </div>
                    </div>

                    {/* Product 8 */}
                    <div>
                      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
                        <img src="https://images.unsplash.com/photo-1586864387634-97201e228378?q=80&w=300&h=300&auto=format&fit=crop" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
                          <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">Brand+</span>
                          Ergonomic Wireless Mouse Rechargeable
                        </p>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] text-gray-500">923 sold</span>
                          <span className="text-[10px] text-gray-400">|</span>
                          <span className="text-[10px] text-gray-700">★ 4.7</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">24990</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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