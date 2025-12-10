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
  // ... other categories with subcategories (TV, Beauty, etc.) can be added later
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("devices");
  const selected = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">

      {/* LEFT SIDEBAR — EXACT ORIGINAL DESIGN + PERFECT SCROLL */}
      <div className="w-24 bg-white flex-shrink-0 h-full flex flex-col overflow-hidden border-r border-gray-100">
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
                <span className="text-[8px] text-gray-800 leading-tight">{cat.name}</span>
                {active && <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT — YOUR EXACT ORIGINAL LAYOUT + RECOMMENDATIONS */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain">
          <div className="p-4 pb-32">

            {/* 5 HARD-CODED SECTIONS — EXACTLY LIKE YOUR ORIGINAL */}
            {selected?.id === "devices" ? (
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

                {/* Desktop Computers */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Desktop Computers</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {selected.subCategories.slice(5, 8).map(item => (
                      <div key={item.id} className="flex flex-col items-center">
                        <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smartwatches & Accessories */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Smartwatches & Accessories</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {selected.subCategories.slice(8, 10).map(item => (
                      <div key={item.id} className="flex flex-col items-center">
                        <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Console Gaming */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Console Gaming</h2>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {selected.subCategories.slice(10).map(item => (
                      <div key={item.id} className="flex flex-col items-center">
                        <div className="w-full aspect-square bg-white rounded-lg mb-3 overflow-hidden">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No subcategories available for {selected?.name}</p>
              </div>
            )}

            {/* YOUR ORIGINAL "You May Also Like" SECTION — RESTORED */}
            <div className="mt-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4">You May Also Like</h2>
              <div className="grid grid-cols-2 gap-2">
                {/* 8 product cards — exactly like your original */}
                {[
                  { title: "Wireless Bluetooth Headphones Noise Cancel", price: "79523", sold: "234", rating: "4.8", sale: true },
                  { title: "Smart Watch Fitness Tracker Heart Rate", price: "67019", sold: "18k", rating: "4.7", top: true },
                  { title: "Sport Smart Watch Call", price: "105730", sold: "1.3k", rating: "4.6" },
                  { title: "Curly Highlight Wig Human", price: "741510", sold: "637", rating: "4.7", sale: true },
                  { title: "Premium Wireless Speaker Deep Bass", price: "89990", sold: "432", rating: "4.8" },
                  { title: "HD Webcam 1080P Microphone", price: "49990", sold: "789", rating: "5.0", premium: true },
                  { title: "Mechanical Gaming Keyboard RGB", price: "767523", sold: "38", rating: "4.8" },
                  { title: "Ergonomic Wireless Mouse", price: "24990", sold: "923", rating: "4.7" },
                ].map((p, i) => (
                  <div key={i} className="bg-white rounded overflow-hidden shadow-sm">
                    <div className="aspect-square">
                      <img
                        src={`https://images.unsplash.com/photo-15${i}00425175${i+1}-6d2b9e78d1f3?q=80&w=600&fit=crop`}
                        alt="product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] text-gray-700 line-clamp-2 leading-tight mb-1">
                        {p.sale && <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1">Sale</span>}
                        {p.top && <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1">Top</span>}
                        {p.premium && <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1">Premium</span>}
                        {p.title}
                      </p>
                      <div className="flex items-center text-[10px] text-gray-500 mb-1">
                        <span>{p.sold} sold</span>
                        <span className="mx-1">•</span>
                        <span className="text-gray-700">★ {p.rating}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₮{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAGIC SCROLL FIX — 2025 BEST PRACTICE */}
      <style jsx global>{`
        .overscroll-contain {
          overscroll-behavior-y: contain;
        }
        .overflow-y-auto {
          -webkit-overflow-scrolling: touch;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}