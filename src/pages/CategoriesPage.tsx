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
  Smartphone,
  Laptop,
  Headphones,
  Camera,
  Gamepad2,
  Refrigerator,
  WashingMachine,
  Microwave,
  Dumbbell,
  Heart,
  Palette,
  Sofa,
  BedDouble,
  Lamp,
  Wrench,
  Package,
  Gift,
  Bike,
  Tent,
  PawPrint,
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

// EXHAUSTIVE SUBCATEGORIES FOR ALL CATEGORIES
const CATEGORIES: Category[] = [
  {
    id: "just",
    name: "Just for You",
    icon: User,
    subCategories: [], // Personalized — usually loaded from API
  },
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
      { id: "cables", name: "Cables & Adapters", imageUrl: "https://images.unsplash.com/photo-1558618666-580f1e6e5c35?q=80&w=600&fit=crop" },
      { id: "stands", name: "Phone Stands & Holders", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=600&fit=crop" },
      { id: "selfie", name: "Selfie Sticks", imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "devices",
    name: "Electronic Devices",
    icon: Monitor,
    subCategories: [
      // Mobiles & Tablets
      { id: "smartphones", name: "Smartphones", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&fit=crop" },
      { id: "tablets", name: "Tablets", imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=600&fit=crop" },
      { id: "feature-phones", name: "Feature Phones", imageUrl: "https://images.unsplash.com/photo-1588872657578-39ef8c061684?q=80&w=600&fit=crop" },
      { id: "refurbished", name: "Refurbished Phones", imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=600&fit=crop" },

      // Laptops & Computers
      { id: "laptops", name: "Laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&fit=crop" },
      { id: "gaming-laptops", name: "Gaming Laptops", imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&fit=crop" },
      { id: "macbooks", name: "MacBooks", imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&fit=crop" },
      { id: "desktops", name: "Desktop PCs", imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=600&fit=crop" },
      { id: "all-in-one", name: "All-in-One PCs", imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=600&fit=crop" },
      { id: "monitors", name: "Monitors", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&fit=crop" },

      // Wearables & Gaming
      { id: "smartwatches", name: "Smartwatches", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&fit=crop" },
      { id: "fitness-bands", name: "Fitness Bands", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&fit=crop" },
      { id: "gaming-consoles", name: "Gaming Consoles", imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&fit=crop" },
      { id: "console-games", name: "Console Games", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&fit=crop" },
      { id: "gaming-accessories", name: "Gaming Accessories", imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "tv",
    name: "TV & Home Appliances",
    icon: Tv,
    subCategories: [
      { id: "tv", name: "Televisions", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=600&fit=crop" },
      { id: "fridge", name: "Refrigerators", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=600&fit=crop" },
      { id: "ac", name: "Air Conditioners", imageUrl: "https://images.unsplash.com/photo-1560347879-9d2e3a7d21be?q=80&w=600&fit=crop" },
      { id: "washing", name: "Washing Machines", imageUrl: "https://images.unsplash.com/photo-1626806819289-1d87f82a3b2c?q=80&w=600&fit=crop" },
      { id: "microwave", name: "Microwave Ovens", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&fit=crop" },
      { id: "fan", name: "Fans & Coolers", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=600&fit=crop" },
      { id: "water-purifier", name: "Water Purifiers", imageUrl: "https://images.unsplash.com/photo-1583259274703-9d32e6d68993?q=80&w=600&fit=crop" },
      { id: "vacuum", name: "Vacuum Cleaners", imageUrl: "https://images.unsplash.com/photo-1558317373-6d9c8d2d9c8f?q=80&w=600&fit=crop" },
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
      { id: "fragrance", name: "Perfumes & Fragrances", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop" },
      { id: "personal-care", name: "Personal Care", imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6fdfac4?q=80&w=600&fit=crop" },
      { id: "health-devices", name: "Health Devices", imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&fit=crop" },
      { id: "sexual-wellness", name: "Sexual Wellness", imageUrl: "https://images.unsplash.com/photo-1559755013-0b84d9d7d7d7?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "babies",
    name: "Babies & Toys",
    icon: Baby,
    subCategories: [
      { id: "diapers", name: "Diapers & Wipes", imageUrl: "https://images.unsplash.com/photo-1586281380344-450c3e1d5c2c?q=80&w=600&fit=crop" },
      { id: "feeding", name: "Feeding & Nursing", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=600&fit=crop" },
      { id: "strollers", name: "Strollers & Prams", imageUrl: "https://images.unsplash.com/photo-1554731617-6d78e0d6e8d8?q=80&w=600&fit=crop" },
      { id: "toys", name: "Toys & Games", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&fit=crop" },
      { id: "baby-clothing", name: "Baby Clothing", imageUrl: "https://images.unsplash.com/photo-1622290291469-7f1f9d7d1b1b?q=80&w=600&fit=crop" },
      { id: "nursery", name: "Nursery Furniture", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b1c045efd9?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "groceries",
    name: "Groceries & Pets",
    icon: ShoppingCart,
    subCategories: [
      { id: "snacks", name: "Snacks & Drinks", imageUrl: "https://images.unsplash.com/photo-1542834289-4359b3f1e7e8?q=80&w=600&fit=crop" },
      { id: "rice-oil", name: "Rice, Oil & Spices", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop" },
      { id: "dairy", name: "Dairy & Eggs", imageUrl: "https://images.unsplash.com/photo-1563636619-e2c3f99b5f9b?q=80&w=600&fit=crop" },
      { id: "pet-food", name: "Pet Food", imageUrl: "https://images.unsplash.com/photo-1548767797-d8c6e7e7d8d8?q=80&w=600&fit=crop" },
      { id: "pet-care", name: "Pet Accessories", imageUrl: "https://images.unsplash.com/photo-1583337130499-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
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
      { id: "kitchen", name: "Kitchen & Dining", imageUrl: "https://images.unsplash.com/photo-1556911220-b0b92d0d9d9d?q=80&w=600&fit=crop" },
      { id: "lighting", name: "Lighting", imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d9d?q=80&w=600&fit=crop" },
      { id: "storage", name: "Storage & Organization", imageUrl: "https://images.unsplash.com/photo-1595428774777-6d9d9d9d9d9d?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "women",
    name: "Women's Fashion",
    icon: Shirt,
    subCategories: [
      { id: "dresses", name: "Dresses", imageUrl: "https://images.unsplash.com/photo-1595776619627-1d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "tops", name: "Tops & Blouses", imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=600&fit=crop" },
      { id: "ethnic", name: "Ethnic Wear", imageUrl: "https://images.unsplash.com/photo-1629224228-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "jeans", name: "Jeans & Jeggings", imageUrl: "https://images.unsplash.com/photo-1542272604-787c7c7c7c7c?q=80&w=600&fit=crop" },
      { id: "shoes-women", name: "Women's Shoes", imageUrl: "https://images.unsplash.com/photo-1562183241-b937e1a1822b?q=80&w=600&fit=crop" },
      { id: "bags-women", name: "Bags & Wallets", imageUrl: "https://images.unsplash.com/photo-1551029506-0803e1b9d9d9?q=80&w=600&fit=crop" },
      { id: "jewelry", name: "Jewelry", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&fit=crop" },
      { id: "watches-women", name: "Women's Watches", imageUrl: "https://images.unsplash.com/photo-1523171137-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "men",
    name: "Men's Fashion",
    icon: Users,
    subCategories: [
      { id: "shirts-men", name: "Shirts", imageUrl: "https://images.unsplash.com/photo-1596755096483-2d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "tshirts", name: "T-Shirts & Polos", imageUrl: "https://images.unsplash.com/photo-1521577352947-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "jeans-men", name: "Jeans", imageUrl: "https://images.unsplash.com/photo-1604176354204-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "shoes-men", name: "Men's Shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "watches-men", name: "Men's Watches", imageUrl: "https://images.unsplash.com/photo-1524592094714-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "bags-men", name: "Bags & Backpacks", imageUrl: "https://images.unsplash.com/photo-1553062407-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
    ],
  },
  {
    id: "sports",
    name: "Sports & Outdoor",
    icon: Car,
    subCategories: [
      { id: "fitness", name: "Fitness & Gym", imageUrl: "https://images.unsplash.com/photo-1517838277536-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "cycling", name: "Cycling", imageUrl: "https://images.unsplash.com/photo-1558618046-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "camping", name: "Camping & Hiking", imageUrl: "https://images.unsplash.com/photo-1504280390516-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
      { id: "sports-shoes", name: "Sports Shoes", imageUrl: "https://images.unsplash.com/photo-1542293241-b937e1a1822b?q=80&w=600&fit=crop" },
      { id: "sportswear", name: "Sportswear", imageUrl: "https://images.unsplash.com/photo-1517838277536-9d9d9d9d9d9d?q=80&w=600&fit=crop" },
    ],
  },
];

// Dynamic grouping rules
const GROUP_RULES: Record<string, { title: string; items: string[] }[]> = {
  devices: [
    { title: "Phones & Tablets", items: ["smartphones", "tablets", "feature-phones", "refurbished"] },
    { title: "Laptops & Computers", items: ["laptops", "gaming-laptops", "macbooks", "desktops", "all-in-one", "monitors"] },
    { title: "Wearables", items: ["smartwatches", "fitness-bands"] },
    { title: "Gaming", items: ["gaming-consoles", "console-games", "gaming-accessories"] },
  ],
  accessories: [
    { title: "Mobile Accessories", items: ["chargers", "cases", "screen-pro", "powerbank", "earphones", "cables"] },
    { title: "Audio", items: ["earphones", "speakers"] },
    { title: "Wearable Accessories", items: ["smartwatch-bands"] },
  ],
  tv: [
    { title: "TV & Entertainment", items: ["tv"] },
    { title: "Large Appliances", items: ["fridge", "ac", "washing"] },
    { title: "Kitchen Appliances", items: ["microwave", "fan", "water-purifier", "vacuum"] },
  ],
  beauty: [
    { title: "Face & Skin", items: ["skincare", "makeup"] },
    { title: "Hair & Body", items: ["haircare", "personal-care"] },
    { title: "Fragrances & Wellness", items: ["fragrance", "health-devices", "sexual-wellness"] },
  ],
  // Add more rules as needed...
};

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");

  const selectedCat = CATEGORIES.find((cat) => cat.id === selectedCategory);

  const groups = GROUP_RULES[selectedCategory as keyof typeof GROUP_RULES] || [];

  const getGroupedItems = () => {
    if (!selectedCat || groups.length === 0) {
      // Fallback: show all in one grid if no group rules
      return [{ title: "All Products", items: selectedCat?.subCategories || [] }];
    }

    return groups.map((group) => ({
      title: group.title,
      items: group.items
        .map((id) => selectedCat.subCategories.find((s) => s.id === id))
        .filter(Boolean) as SubCategory[],
    }));
  };

  const groupedItems = getGroupedItems();

  return (
    <>
      <div className="bg-gray-100 h-screen flex overflow-hidden">

        {/* Sidebar */}
        <div className="w-24 bg-white shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide py-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full py-4 flex flex-col items-center gap-1 transition-all ${
                    active ? "text-orange-600 bg-orange-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium px-1 leading-tight text-center">
                    {cat.name.split(" ")[0]}
                    <br />
                    {cat.name.includes(" ") ? cat.name.split(" ").slice(1).join(" ") : ""}
                  </span>
                  {active && <div className="absolute right-0 inset-y-0 w-1 bg-orange-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <div className="h-full overflow-y-auto overscroll-contain pb-20">
            <div className="p-5">

              {selectedCat.subCategories.length === 0 ? (
                <div className="text-center pt-20 text-gray-400">
                  <User className="w-20 h-20 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Personalized recommendations coming soon...</p>
                </div>
              ) : (
                <>
                  {groupedItems.map((group) => (
                    <section key={group.title} className="mb-8">
                      {group.title === "All Products" && "mb-12"}>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">{group.title}</h2>
                        {group.items.length > 6 && <ChevronRight className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {group.items.map((item) => (
                          <div key={item.id} className="text-center group cursor-pointer">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md mb-3 aspect-square transition hover:shadow-lg hover:scale-105">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-medium text-gray-800 leading-tight px-2">
                              {item.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}

                  {/* Recommended Section */}
                  <section className="mt-12 border-t pt-8">
                    <h2 className="text-xl font-bold mb-6">Recommended For You</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Real products would come from API */}
                      {Array(8).fill(null).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden shadow">
                          <div className="aspect-square bg-gray-200" />
                          <div className="p-3">
                            <p className="text-xs text-gray-700 line-clamp-2">Premium Product {i + 1}</p>
                            <p className="text-sm font-bold mt-1">₮99,999</p>
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
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .overscroll-contain { overscroll-behavior-y: contain; }
      `}</style>
    </>
  );
}