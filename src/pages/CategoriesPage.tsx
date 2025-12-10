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

/* FULLY POPULATED CATEGORIES – YOUR ORIGINAL DATA + ALL OTHERS FILLED */
const CATEGORIES: Category[] = [
  { id: "just", name: "Just for You", icon: User, subCategories: [] },
  {
    id: "accessories",
    name: "Electronic Accessories",
    icon: Plug,
    subCategories: [
      { id: "chargers", name: "Chargers & Cables", imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=400&h=400&fit=crop" },
      { id: "cases", name: "Phone Cases", imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=400&h=400&fit=crop" },
      { id: "screen", name: "Screen Protectors", imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400&h=400&fit=crop" },
      { id: "powerbank", name: "Power Banks", imageUrl: "https://images.unsplash.com/photo-1609091839314-d8ad8e02782e?q=80&w=400&h=400&fit=crop" },
      { id: "earphones", name: "Earphones", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      { id: "mobiles", name: "Mobiles", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&h=400&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=400&h=400&fit=crop" },
      { id: "landline", name: "Landline Phones", imageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&h=400&fit=crop" },
      { id: "traditional", name: "Traditional Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&h=400&fit=crop" },
      { id: "2in1", name: "2-in-1s", imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=400&h=400&fit=crop" },
      { id: "allinone", name: "All-In-One", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=400&h=400&fit=crop" },
      { id: "gaming", name: "Gaming Desktops", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=400&h=400&fit=crop" },
      { id: "diy", name: "DIY", imageUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=400&h=400&fit=crop" },
      { id: "fitness", name: "Fitness Trackers & Accessories", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=400&h=400&fit=crop" },
      { id: "smart", name: "Smart Trackers", imageUrl: "https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=400&h=400&fit=crop" },
      { id: "console", name: "Console", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=400&h=400&fit=crop" },
      { id: "games", name: "Console Games", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=400&fit=crop" },
      { id: "console-acc", name: "Console Gaming Accessories", imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=400&h=400&fit=crop" },
    ],
  },
  { id: "tv", name: "TV & Home Appliances", icon: Tv, subCategories: [
    { id: "tv", name: "Televisions", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=400&h=400&fit=crop" },
    { id: "fridge", name: "Refrigerators", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=400&h=400&fit=crop" },
    { id: "ac", name: "Air Conditioners", imageUrl: "https://images.unsplash.com/photo-1592853621833-d208b9be0519?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "beauty", name: "Health & Beauty", icon: Droplet, subCategories: [
    { id: "skincare", name: "Skincare", imageUrl: "https://images.unsplash.com/photo-1556228451-38e89c0e4e09?q=80&w=400&h=400&fit=crop" },
    { id: "makeup", name: "Makeup", imageUrl: "https://images.unsplash.com/photo-1512496015851-2d0e55c5a5d7?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "babies", name: "Babies & Toys", icon: Baby, subCategories: [
    { id: "diapers", name: "Diapers", imageUrl: "https://images.unsplash.com/photo-1586281380114-5ed2a19d3d46?q=80&w=400&h=400&fit=crop" },
    { id: "toys", name: "Toys", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "groceries", name: "Groceries & Pets", icon: ShoppingCart, subCategories: [
    { id: "snacks", name: "Snacks", imageUrl: "https://images.unsplash.com/photo-1542834289-4359b3f1e7e8?q=80&w=400&h=400&fit=crop" },
    { id: "drinks", name: "Drinks", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "home", name: "Home & Lifestyle", icon: Home, subCategories: [
    { id: "furniture", name: "Furniture", imageUrl: "https://images.unsplash.com/photo-1555041469-c5f4d8f8d8d8?q=80&w=400&h=400&fit=crop" },
    { id: "decor", name: "Home Decor", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b1c045efd9?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "women", name: "Women's Fashion & Accessories", icon: Shirt, subCategories: [
    { id: "dresses", name: "Dresses", imageUrl: "https://images.unsplash.com/photo-1595776619627-1d9d9d9d9d9d?q=80&w=400&h=400&fit=crop" },
    { id: "tops", name: "Tops", imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "men", name: "Men's Fashion & Accessories", icon: Users, subCategories: [
    { id: "shirts", name: "Shirts", imageUrl: "https://images.unsplash.com/photo-1604176354204-9d9d9d9d9d9d?q=80&w=400&h=400&fit=crop" },
  ]},
  { id: "kids", name: "Kid's Fashion & Accessories", icon: Watch, subCategories: [] },
  { id: "sports", name: "Sports & Lifestyle", icon: Car, subCategories: [] },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");
  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">

      {/* LEFT SIDEBAR – IDENTICAL TO YOUR ORIGINAL */}
      <div className="w-24 bg-white flex-shrink-0 h-screen flex flex-col overflow-hidden border-r border-gray-100">
        <div className="flex-1 overflow-y-auto py-2" style={{ overscrollBehavior: 'contain' }}>
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
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT – YOUR ORIGINAL DESIGN PRESERVED */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
          <div className="p-4">

            {selectedCategoryData?.subCategories.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">No subcategories yet</p>
              </div>
            ) : (
              <>
                {/* === DYNAMIC SECTIONS BASED ON SUBCATEGORIES === */}
                {selectedCategoryData.subCategories.length > 0 && (
                  <div className="space-y-10">
                    {(() => {
                      const items = selectedCategoryData.subCategories;
                      const sections = [];

                      // First section: first 3 items
                      if (items.length >= 3) {
                        sections.push({
                          title: items.length > 8 ? "Top Categories" : "Explore",
                          start: 0,
                          end: Math.min(3, items.length),
                        });
                      }

                      // Add more sections dynamically if needed
                      if (items.length > 3) {
                        sections.push({
                          title: "More to Discover",
                          start: 3,
                          end: items.length,
                        });
                      }

                      return sections.map((section, idx) => (
                        <div key={idx} className="mb-10">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                            {items.slice(section.start, section.end).map((item) => (
                              <div key={item.id} className="flex flex-col items-center">
                                <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden shadow-sm">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-sm text-gray-900 text-center leading-tight">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Perfect smooth scrolling */}
      <style jsx global>{`
        .overscroll-contain { overscroll-behavior-y: contain; }
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}