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

/* YOUR ORIGINAL CATEGORIES + ALL NOW POPULATED */
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
  ]},
  { id: "beauty", name: "Health & Beauty", icon: Droplet, subCategories: [
    { id: "skincare", name: "Skincare", imageUrl: "https://images.unsplash.com/photo-1556228451-38e89c0e4e09?q=80&w=400&h=400&fit=crop" },
  ]},
  // Add more as needed...
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");
  const selected = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <>
      <div className="bg-gray-50 h-screen flex overflow-hidden">

        {/* SIDEBAR — ORIGINAL DESIGN + PERFECT SCROLL */}
        <div className="w-24 bg-white flex-shrink-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain py-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full px-1.5 py-3 flex flex-col items-center text-center transition-colors relative ${
                    active ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 text-gray-700" />
                  <span className="text-[8px] text-gray-800 leading-tight">
                    {cat.name}
                  </span>
                  {active && (
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT — ORIGINAL DESIGN + PERFECT SCROLL */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overscroll-contain">
            <div className="p-4 pb-32">

              {selected?.subCategories.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500">No subcategories available for {selected?.name}</p>
                </div>
              ) : (
                <>
                  {/* YOUR ORIGINAL "Electronic Devices" LAYOUT — NOW DYNAMIC */}
                  {selected.id === "devices" ? (
                    <>
                      {/* Mobiles & Tablets */}
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-gray-900">Mobiles & Tablets</h2>
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          {selected.subCategories.slice(0, 3).map(item => (
                            <div key={item.id} className="flex flex-col items-center">
                              <div className="w-full aspect-square bg-white rounded mb-3 overflow-hidden">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-900">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Laptops */}
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-gray-900">Laptops</h2>
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          {selected.subCategories.slice(3, 5).map(item => (
                            <div key={item.id} className="flex flex-col items-center">
                              <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-900">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Desktop Computers + Gaming */}
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-gray-900">Desktop & Gaming</h2>
                          <ChevronRight className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          {selected.subCategories.slice(5).map(item => (
                            <div key={item.id} className="flex flex-col items-center">
                              <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-900 text-center leading-tight">
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* For all other categories — show all items in one beautiful grid */
                    <div className="grid grid-cols-3 gap-6">
                      {selected.subCategories.map(item => (
                        <div key={item.id} className="flex flex-col items-center">
                          <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden shadow-sm">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm text-gray-900 text-center leading-tight">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THIS IS THE MAGIC — 2025 BEST PRACTICE FOR NESTED SCROLL */}
      <style jsx global>{`
        /* Prevent scroll chaining — this is the only thing you need */
        .overscroll-contain {
          overscroll-behavior-y: contain;
        }

        /* Optional: hide scrollbar but nice */
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }

        /* Hide scrollbar but keep functionality */
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}