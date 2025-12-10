import React, { useState } from "react";
import {
  ChevronRight,
  User,
  Plug,
  Monitor,
  Tv,
  Droplet,
  Baby,
  ShoppingCart,
  Home,
  Shirt,
  Users,
  Watch,
  Car,
} from "lucide-react";

// Types
interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  subCategories: SubCategory[];
}

// Dynamic grouping config — change this to control how subcategories are grouped
const SUBCATEGORY_GROUPS = {
  devices: [
    { title: "Mobiles & Tablets", items: ["mobiles", "tablets", "landline"] },
    { title: "Laptops", items: ["traditional", "2in1"] },
    { title: "Desktop Computers", items: ["allinone", "gaming", "diy"] },
    { title: "Smartwatches & Trackers", items: ["fitness", "smart"] },
    { title: "Console Gaming", items: ["console", "games", "console-acc"] },
  ],
  // You can add more categories here later
} as const;

// Full Categories Data
const CATEGORIES: Category[] = [
  { id: "just", name: "Just for You", icon: User, subCategories: [] }, // Fixed: Removed extra }
  { id: "accessories", name: "Electronic Accessories", icon: Plug, subCategories: [] },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      { id: "mobiles", name: "Mobiles", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=600&fit=crop" },
      { id: "landline", name: "Landline Phones", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&fit=crop" },
      { id: "traditional", name: "Traditional Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&fit=crop" },
      { id: "2in1", name: "2-in-1s", imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600&fit=crop" },
      { id: "allinone", name: "All-In-One", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=600&fit=crop" },
      { id: "gaming", name: "Gaming Desktops", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=600&fit=crop" },
      { id: "diy", name: "DIY Desktops", imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=600&fit=crop" },
      { id: "fitness", name: "Fitness Trackers", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&fit=crop" },
      { id: "smart", name: "Smart Trackers", imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=600&fit=crop" },
      { id: "console", name: "Gaming Consoles", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&fit=crop" },
      { id: "games", name: "Console Games", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&fit=crop" },
      { id: "console-acc", name: "Gaming Accessories", imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&fit=crop" },
    ],
  },
  { id: "tv", name: "TV & Appliances", icon: Tv, subCategories: [] },
  { id: "beauty", name: "Health & Beauty", icon: Droplet, subCategories: [] },
  { id: "babies", name: "Babies & Toys", icon: Baby, subCategories: [] },
  { id: "groceries", name: "Groceries & Pets", icon: ShoppingCart, subCategories: [] },
  { id: "home", name: "Home & Lifestyle", icon: Home, subCategories: [] },
  { id: "women", name: "Women's Fashion", icon: Shirt, subCategories: [] },
  { id: "men", name: "Men's Fashion", icon: Users, subCategories: [] },
  { id: "kids", name: "Kids Fashion", icon: Watch, subCategories: [] },
  { id: "sports", name: "Sports & Outdoor", icon: Car, subCategories: [] },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");

  const selectedCat = CATEGORIES.find((cat) => cat.id === selectedCategory);

  // Get grouped subcategories for current category
  const getGroupedSubCategories = () => {
    if (!selectedCat || selectedCat.subCategories.length === 0) return [];

    const groups = SUBCATEGORY_GROUPS[selectedCategory as keyof typeof SUBCATEGORY_GROUPS];
    if (!groups) return [];

    return groups.map((group) => ({
      title: group.title,
      items: group.items
        .map((id) => selectedCat.subCategories.find((sub) => sub.id === id))
        .filter(Boolean) as SubCategory[],
    }));
  };

  const groupedSubCategories = getGroupedSubCategories();

  return (
    <>
      <div className="bg-gray-50 h-screen flex overflow-hidden">

        {/* Sidebar - Independent Scroll */}
        <div className="w-24 bg-white border-r border-gray-100 flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide py-3">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative w-full py-4 flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium px-1 leading-tight">
                    {category.name}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content - Independent Scroll */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
          <div className="flex-1 overflow-y-auto overscroll-contain pb-20">
            <div className="p-4">

              {/* Empty State */}
              {selectedCat?.subCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Monitor className="w-20 h-20 mb-4 opacity-20" />
                  <p className="text-lg">No subcategories yet</p>
                </div>
              ) : (
                <>
                  {/* Dynamic Subcategory Groups */}
                  {groupedSubCategories.map((group) => (
                    <section key={group.title} className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">{group.title}</h2>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {group.items.map((item) => (
                          <div key={item.id} className="text-center group cursor-pointer">
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-3 aspect-square transition-transform group-hover:scale-105">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs text-gray-700 leading-tight px-1">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}

                  {/* You May Also Like - Optional (can be dynamic too) */}
                  <section className="mt-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">You May Also Like</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "Wireless Headphones Pro", price: "89,990", sold: "12.3k", rating: "4.9" },
                        { title: "Smart Watch Ultra", price: "149,990", sold: "8.7k", rating: "4.8" },
                        { title: "Gaming Keyboard RGB", price: "76,523", sold: "3.2k", rating: "4.7" },
                        { title: "4K Webcam Pro", price: "49,990", sold: "5.1k", rating: "5.0" },
                      ].map((product, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                          <div className="aspect-square bg-gray-200">
                            <img
                              src={`https://images.unsplash.com/photo-1588872657${i}575-6d2b9e78d1f3?q=80&w=600&fit=crop`}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">Sale</span>
                              {product.title}
                            </p>
                            <div className="flex items-center text-[10px] text-gray-500 mb-1">
                              <span>{product.sold} sold</span>
                              <span className="mx-1">•</span>
                              <span>★ {product.rating}</span>
                            </div>
                            <p className="text-base font-bold">₮{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .overscroll-contain {
          overscroll-behavior-y: contain;
        }
      `}</style>
    </>
  );
}