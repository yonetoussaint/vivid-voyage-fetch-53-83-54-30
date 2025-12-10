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

/* FULL EXHAUSTIVE CATEGORIES — same data, just more complete */
const CATEGORIES: Category[] = [
  { id: "just", name: "Just for You", icon: User, subCategories: [] },
  {
    id: "accessories",
    name: "Electronic Accessories",
    icon: Plug,
    subCategories: [
      { id: "chargers", name: "Chargers & Cables", imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=600&fit=crop" },
      { id: "cases", name: "Phone Cases", imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=600&fit=crop" },
      { id: "screen-pro", name: "Screen Protectors", imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&fit=crop" },
      { id: "powerbank", name: "Power Banks", imageUrl: "https://images.unsplash.com/photo-1609091839314-d8ad8e02782e?q=80&w=600&fit=crop" },
      { id: "earphones-stands", name: "Phone Stands", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      { id: "mobiles", name: "Mobiles", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=600&fit=crop" },
      { id: "laptops", name: "Traditional Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&fit=crop" },
      { id: "2in1", name: "2-in-1s", imageUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600&fit=crop" },
      { id: "allinone", name: "All-In-One", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=600&fit=crop" },
      { id: "gaming-pc", name: "Gaming Desktops", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=600&fit=crop" },
      { id: "smartwatch", name: "Smartwatches", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&fit=crop" },
      { id: "console", name: "Gaming Consoles", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&fit=crop" },
    ],
  },
  { id: "tv", name: "TV & Home Appliances", icon: Tv, subCategories: [
    { id: "tv", name: "Televisions", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=600&fit=crop" },
    { id: "fridge", name: "Refrigerators", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=600&fit=crop" },
    { id: "ac", name: "Air Conditioners", imageUrl: "https://images.unsplash.com/photo-1592853621833-d208b9be0519?q=80&w=600&fit=crop" },
    { id: "washing", name: "Washing Machines", imageUrl: "https://images.unsplash.com/photo-1626806819289-1d87f82a3b2c?q=80&w=600&fit=crop" },
  ]},
  { id: "beauty", name: "Health & Beauty", icon: Droplet, subCategories: [
    { id: "skincare", name: "Skincare", imageUrl: "https://images.unsplash.com/photo-1591370873846-6f60d6e8d1b9?q=80&w=600&fit=crop" },
    { id: "makeup", name: "Makeup", imageUrl: "https://images.unsplash.com/photo-1591370874773-7068003e5c4c?q=80&w=600&fit=crop" },
    { id: "hair", name: "Hair Care", imageUrl: "https://images.unsplash.com/photo-1596462515236-8a06c3e6c9e9?q=80&w=600&fit=crop" },
  ]},
  { id: "babies", name: "Babies & Toys", icon: Baby, subCategories: [
    { id: "diapers", name: "Diapers", imageUrl: "https://images.unsplash.com/photo-1586281380114-5ed2a19d3d46?q=80&w=600&fit=crop" },
    { id: "toys", name: "Toys", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&fit=crop" },
  ]},
  { id: "groceries", name: "Groceries & Pets", icon: ShoppingCart, subCategories: [] },
  { id: "home", name: "Home & Lifestyle", icon: Home, subCategories: [] },
  { id: "women", name: "Women's Fashion", icon: Shirt, subCategories: [] },
  { id: "men", name: "Men's Fashion", icon: Users, subCategories: [] },
  { id: "kids", name: "Kids Fashion", icon: Watch, subCategories: [] },
  { id: "sports", name: "Sports & Outdoor", icon: Car, subCategories: [] },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");
  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">

      {/* LEFT SIDEBAR — Original Design Restored */}
      <div className="w-24 bg-white flex-shrink-0 h-screen flex flex-col overflow-hidden border-r">
        <div className="flex-1 overflow-y-auto overscroll-contain py-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full py-4 flex flex-col items-center gap-1 transition-all relative
                  ${isActive ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50"}
                `}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[9px] font-medium leading-tight px-1 text-center">
                  {category.name}
                </span>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT — Original Clean Design */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        <div className="h-full overflow-y-auto overscroll-contain">
          <div className="p-4 pb-32">

            {selectedCat?.subCategories.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <p className="text-lg">Coming soon...</p>
              </div>
            ) : (
              <>
                {/* Dynamic Sections — same as your original layout */}
                {selectedCat.id === "devices" && (
                  <>
                    {/* Mobiles & Tablets */}
                    <section className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Mobiles & Tablets</h2>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedCat.subCategories.slice(0, 3).map(item => (
                          <div key={item.id} className="text-center">
                            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-3 shadow-sm">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs text-gray-700">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Laptops */}
                    <section className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Laptops</h2>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedCat.subCategories.slice(2, 4).map(item => (
                          <div key={item.id} className="text-center">
                            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-3 shadow-sm">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs text-gray-700">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Desktop & Gaming */}
                    <section className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Desktop & Gaming</h2>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedCat.subCategories.slice(4).map(item => (
                          <div key={item.id} className="text-center">
                            <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-3 shadow-sm">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs text-gray-700">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {/* For other categories — show all in one grid (like your original) */}
                {selectedCat.id !== "devices" && selectedCat.subCategories.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCat.subCategories.map(item => (
                      <div key={item.id} className="text-center">
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-3 shadow-sm">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs text-gray-700 leading-tight">{item.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* You May Also Like — Original Style */}
                <section className="mt-12">
                  <h2 className="text-lg font-semibold mb-5">You May Also Like</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-square">
                          <img
                            src={`https://images.unsplash.com/photo-15${i}00425175${i + 1}-6d2b9e78d1f3?q=80&w=600&fit=crop`}
                            alt="product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-700 line-clamp-2 mb-1">
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-1">Sale</span>
                            Amazing Product {i + 1}
                          </p>
                          <p className="text-sm font-bold">₮99,999</p>
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

      {/* Clean Scroll Fixes */}
      <style jsx global>{`
        .overscroll-contain {
          overscroll-behavior-y: contain;
        }
        /* Hide scrollbar but keep scrolling */
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}