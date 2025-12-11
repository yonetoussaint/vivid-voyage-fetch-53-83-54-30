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

/* ---------- ALL CATEGORIES WITH EXHAUSTIVE SUB-CATEGORIES ---------- */
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
      { id: "earphones", name: "Earphones & Headsets", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&fit=crop" },
      { id: "speakers", name: "Bluetooth Speakers", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&fit=crop" },
      { id: "smartwatch-bands", name: "Smartwatch Bands", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      { id: "smartphones", name: "Smartphones", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=600&fit=crop" },
      { id: "feature-phones", name: "Feature Phones", imageUrl: "https://images.unsplash.com/photo-1588872657578-39ef8c061684?q=80&w=600&fit=crop" },
      { id: "laptops", name: "Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&fit=crop" },
      { id: "gaming-laptops", name: "Gaming Laptops", imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&fit=crop" },
      { id: "macbooks", name: "MacBooks", imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&fit=crop" },
      { id: "desktops", name: "Desktop PCs", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=600&fit=crop" },
      { id: "monitors", name: "Monitors", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&fit=crop" },
      { id: "smartwatches", name: "Smartwatches", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&fit=crop" },
      { id: "fitness-bands", name: "Fitness Bands", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&fit=crop" },
      { id: "gaming-consoles", name: "Gaming Consoles", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&fit=crop" },
      { id: "console-games", name: "Console Games", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "tv",
    name: "TV & Home Appliances",
    icon: Tv,
    subCategories: [
      { id: "tv", name: "Televisions", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=600&fit=crop" },
      { id: "fridge", name: "Refrigerators", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=600&fit=crop" },
      { id: "ac", name: "Air Conditioners", imageUrl: "https://images.unsplash.com/photo-1560347879-9d2e3e7d21be?q=80&w=600&fit=crop" },
      { id: "washing", name: "Washing Machines", imageUrl: "https://images.unsplash.com/photo-1626806819289-1d87f82a3b2c?q=80&w=600&fit=crop" },
      { id: "microwave", name: "Microwave Ovens", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "beauty",
    name: "Health & Beauty",
    icon: Droplet,
    subCategories: [
      { id: "skincare", name: "Skincare", imageUrl: "https://images.unsplash.com/photo-1570197788418-6e9e0c3c3c3c?q=80&w=600&fit=crop" },
      { id: "makeup", name: "Makeup", imageUrl: "https://images.unsplash.com/photo-1591370874773-7068003e5c4c?q=80&w=600&fit=crop" },
      { id: "haircare", name: "Hair Care", imageUrl: "https://images.unsplash.com/photo-1596462515236-8a06c3e6c9e9?q=80&w=600&fit=crop" },
      { id: "fragrance", name: "Perfumes", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "babies",
    name: "Babies & Toys",
    icon: Baby,
    subCategories: [
      { id: "diapers", name: "Diapers & Wipes", imageUrl: "https://images.unsplash.com/photo-1586281380344-450c3e1d5c2c?q=80&w=600&fit=crop" },
      { id: "feeding", name: "Feeding", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=600&fit=crop" },
      { id: "toys", name: "Toys & Games", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "groceries",
    name: "Groceries & Pets",
    icon: ShoppingCart,
    subCategories: [
      { id: "snacks", name: "Snacks & Drinks", imageUrl: "https://images.unsplash.com/photo-1542834289-4359b3f1e7e8?q=80&w=600&fit=crop" },
      { id: "rice-oil", name: "Rice & Oil", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop" },
      { id: "pet-food", name: "Pet Food", imageUrl: "https://images.unsplash.com/photo-1548767797-d8c6e7e7d8d8?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "home",
    name: "Home & Lifestyle",
    icon: Home,
    subCategories: [
      { id: "furniture", name: "Furniture", imageUrl: "https://images.unsplash.com/photo-1555041469-c5f4d8f8d8d8?q=80&w=600&fit=crop" },
      { id: "bedding", name: "Bedding & Bath", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b1c045efd9?q=80&w=600&fit=crop" },
      { id: "decor", name: "Home Decor", imageUrl: "https://images.unsplash.com/photo-1618220048045-10a6a6d9d9d9?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "women",
    name: "Women's Fashion",
    icon: Shirt,
    subCategories: [
      { id: "dresses", name: "Dresses", imageUrl: "https://images.unsplash.com/photo-1595776619627-1d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "tops", name: "Tops & Blouses", imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=600&fit=crop" },
      { id: "shoes-women", name: "Women's Shoes", imageUrl: "https://images.unsplash.com/photo-1562183241-b937e1a1822b?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "men",
    name: "Men's Fashion",
    icon: Users,
    subCategories: [
      { id: "shirts-men", name: "Shirts", imageUrl: "https://images.unsplash.com/photo-1596755096483-2d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "tshirts", name: "T-Shirts", imageUrl: "https://images.unsplash.com/photo-1521577352947-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "shoes-men", name: "Men's Shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d9d9d9d9d?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Outdoor",
    icon: Car,
    subCategories: [
      { id: "fitness", name: "Fitness & Gym", imageUrl: "https://images.unsplash.com/photo-1517838277536-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "cycling", name: "Cycling", imageUrl: "https://images.unsplash.com/photo-1558618046-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "sports-shoes", name: "Sports Shoes", imageUrl: "https://images.unsplash.com/photo-1542293241-b937e1a1822b?q=80&w=600&fit=crop" },
    ],
  },
];

/* ---------- GROUPING RULES ---------- */
const GROUP_RULES: Record<string, { title: string; items: string[] }[]> = {
  devices: [
    { title: "Phones & Tablets", items: ["smartphones", "tablets", "feature-phones"] },
    { title: "Laptops & Computers", items: ["laptops", "gaming-laptops", "macbooks", "desktops", "monitors"] },
    { title: "Wearables", items: ["smartwatches", "fitness-bands"] },
    { title: "Gaming", items: ["gaming-consoles", "console-games"] },
  ],
  accessories: [
    { title: "Mobile Accessories", items: ["chargers", "cases", "screen-pro", "powerbank"] },
    { title: "Audio", items: ["earphones", "speakers"] },
    { title: "Wearable Accessories", items: ["smartwatch-bands"] },
  ],
  tv: [
    { title: "TV & Entertainment", items: ["tv"] },
    { title: "Large Appliances", items: ["fridge", "ac", "washing", "microwave"] },
  ],
  // add more categories as needed…
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");

  const selectedCat = CATEGORIES.find((c) => c.id === selectedCategory);

  const groups = GROUP_RULES[selectedCategory as keyof typeof GROUP_RULES] || [];

  const getGroupedItems = () => {
    if (!selectedCat) return [];

    if (groups.length === 0) {
      // fallback � show all in one group
      return [{ title: "All Categories", items: selectedCat.subCategories }];
    }

    return groups.map((g) => ({
      title: g.title,
      items: g.items
        .map((id) => selectedCat.subCategories.find((s) => s.id === id))
        .filter(Boolean) as SubCategory[],
    }));
  };

  const groupedItems = getGroupedItems();

  return (
    <>
      <div className="bg-gray-100 h-screen flex overflow-hidden">

        {/* ---------- SIDEBAR ---------- */}
        <div className="w-24 bg-white shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide py-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative w-full py-4 flex flex-col items-center gap-1 transition-all ${
                    active ? "text-orange-600 bg-orange-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium px-1 leading-tight text-center">
                    {cat.name.split(" ")[0]}
                    {cat.name.includes(" ") && (
                      <>
                        <br />
                        {cat.name.split(" ").slice(1).join(" ")}
                      </>
                    )}
                  </span>
                  {active && <div className="absolute right-0 inset-y-0 w-1 bg-orange-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto overscroll-contain pb-32">
            <div className="p-5">

              {selectedCat?.subCategories.length === 0 ? (
                <div className="text-center pt-20 text-gray-400">
                  <User className="w-20 h-20 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Personalized recommendations coming soon…</p>
                </div>
              ) : (
                <>
                  {groupedItems.map((group) => (
                    <section key={group.title} className="mb-10">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">{group.title}</h2>
                        {group.items.length > 6 && <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {group.items.map((item) => (
                          <div key={item.id} className="text-center group cursor-pointer">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-3 aspect-square transition hover:shadow-lg hover:scale-105">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-xs font-medium text-gray-800 leading-tight px-1">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}

                  {/* Recommended Products */}
                  <section className="mt-12 border-t pt-8">
                    <h2 className="text-xl font-bold mb-6">Recommended For You</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow">
                          <div className="aspect-square bg-gray-200" />
                          <div className="p-3">
                            <p className="text-xs text-gray-700 line-clamp-2">Amazing Product {i + 1}</p>
                            <p className="text-sm font-bold mt-1">�99,999</p>
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