import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Smartphone, Tv, Monitor, Home, Shirt, Baby, Gamepad2, 
  Car, Book, Dumbbell, Utensils, Sparkles, Heart, Watch,
  Camera, Headphones, Printer, Router, Speaker, Cpu,
  Keyboard, Mouse, Sofa, Lamp, Refrigerator,
  WashingMachine, Microwave, Blender, Toaster,
  Armchair, Bed, Pillow, Droplets, Bath,
  Dress, Shoe, Handbag, Sunglasses, Diamond, Crown,
  Package, Football, Basketball, Tennis,
  Bike, Tent, Fish, Wrench, BookOpen, Music, Palette,
  Flower2, TreePine, Sprout, Apple, Pizza, Wine,
  Coffee, IceCream, Cake, ShoppingBag, Scissors,
  ChevronRight, Zap, TrendingUp, Baby as BabyIcon,
  Dumbbell as DumbellIcon, Car as CarIcon
} from "lucide-react";

// Type definitions
interface SubCategory {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
  isHot?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  subCategories: SubCategory[];
}

// Icon components for categories
const CategoryIcon = ({ icon: Icon, className }: { icon: React.ComponentType<any>; className?: string }) => (
  <Icon className={cn("w-5 h-5", className)} />
);

const CATEGORIES: Category[] = [
  {
    id: "mobiles-tablets",
    name: "Mobiles & Tablets",
    icon: Smartphone,
    subCategories: [
      { id: "mobiles", name: "Mobiles", icon: Smartphone, isHot: true },
      { id: "tablets", name: "Tablets", icon: Tablet, isHot: true },
      { id: "landline", name: "Landline Phones", icon: Phone },
      { id: "accessories", name: "Mobile Accessories", icon: Headphones },
      { id: "smart-watches", name: "Smart Watches", icon: Watch, isHot: true },
    ]
  },
  {
    id: "electronics",
    name: "Electronic Devices",
    icon: Tv,
    subCategories: [
      { id: "tv", name: "TV & Home Appliances", icon: Tv },
      { id: "health-beauty", name: "Health & Beauty", icon: Heart },
      { id: "laptops", name: "Traditional Laptops", icon: Monitor },
      { id: "2in1", name: "2-in-1s", icon: Laptop, isHot: true },
      { id: "cameras", name: "Cameras", icon: CameraIcon },
      { id: "printers", name: "Printers", icon: Printer },
      { id: "routers", name: "Routers", icon: Router },
      { id: "speakers", name: "Speakers", icon: Speaker },
    ]
  },
  {
    id: "computers",
    name: "Desktop Computers",
    icon: Monitor,
    subCategories: [
      { id: "cpu", name: "CPU", icon: Cpu },
      { id: "monitors", name: "Monitors", icon: Monitor },
      { id: "keyboards", name: "Keyboards", icon: Keyboard },
      { id: "mice", name: "Mice", icon: Mouse },
      { id: "gaming-desktops", name: "Gaming Desktops", icon: GamepadIcon, isHot: true },
      { id: "allinone", name: "All-In-One", icon: Desktop },
    ]
  },
  {
  id: "home-lifestyle",
  name: "Home & Lifestyle",
  icon: Home,
  subCategories: [
    { id: "furniture", name: "Furniture", icon: Sofa },
    { id: "lighting", name: "Lighting", icon: Lamp },
    { id: "home-appliances", name: "Home Appliances", icon: WashingMachine },
    { id: "kitchen", name: "Kitchen", icon: Microwave },
    { id: "bedding", name: "Bedding", icon: Bed },
    { id: "bath", name: "Bath", icon: Droplets }, // Changed from ShowerHead
    { id: "decor", name: "Home Decor", icon: Sparkles }, // Changed from Mirror
  ]
},
  {
    id: "fashion",
    name: "Fashion & Accessories",
    icon: Shirt,
    subCategories: [
      { id: "women-fashion", name: "Women's Fashion", icon: Dress, isHot: true },
      { id: "men-fashion", name: "Men's Fashion", icon: Shirt, isHot: true },
      { id: "shoes", name: "Shoes", icon: Shoe },
      { id: "bags", name: "Bags", icon: Handbag },
      { id: "jewelry", name: "Jewelry", icon: Diamond, isHot: true },
      { id: "watches", name: "Watches", icon: Watch },
      { id: "sunglasses", name: "Sunglasses", icon: Sunglasses },
    ]
  },
  {
    id: "kids",
    name: "Kids Fashion & Accessories",
    icon: Baby,
    subCategories: [
      { id: "kids-clothing", name: "Kids Clothing", icon: Baby, isHot: true },
      { id: "toys", name: "Toys", icon: TeddyBear },
      { id: "baby-care", name: "Baby Care", icon: BabyBottle },
      { id: "school-supplies", name: "School Supplies", icon: BookOpen },
      { id: "outdoor-play", name: "Outdoor Play", icon: Bicycle },
    ]
  },
  {
    id: "sports-lifestyle",
    name: "Sports & Lifestyle",
    icon: Dumbbell,
    subCategories: [
      { id: "fitness", name: "Fitness", icon: DumbellIcon, isHot: true },
      { id: "outdoor", name: "Outdoor", icon: Camping },
      { id: "sports-gear", name: "Sports Gear", icon: Football },
      { id: "cycling", name: "Cycling", icon: Bike },
      { id: "water-sports", name: "Water Sports", icon: Fishing },
      { id: "winter-sports", name: "Winter Sports", icon: Ski },
    ]
  },
  {
    id: "gaming",
    name: "Console Gaming",
    icon: Gamepad2,
    subCategories: [
      { id: "console-games", name: "Console Games", icon: GamepadIcon, isHot: true },
      { id: "gaming-consoles", name: "Gaming Consoles", icon: Gamepad2 },
      { id: "gaming-accessories", name: "Gaming Accessories", icon: Headphones },
      { id: "vr", name: "VR Equipment", icon: Glasses, isHot: true },
      { id: "esports", name: "eSports", icon: Trophy },
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    subCategories: [
      { id: "car-parts", name: "Car Parts", icon: CarIcon },
      { id: "tools", name: "Tools", icon: Tools },
      { id: "car-care", name: "Car Care", icon: Sparkles },
      { id: "interior", name: "Interior", icon: Armchair },
      { id: "electronics", name: "Car Electronics", icon: Radio },
    ]
  },
  {
    id: "books-media",
    name: "Books & Media",
    icon: Book,
    subCategories: [
      { id: "books", name: "Books", icon: BookOpen },
      { id: "music", name: "Music", icon: Music },
      { id: "movies", name: "Movies", icon: Film },
      { id: "art", name: "Art & Craft", icon: Palette },
      { id: "stationery", name: "Stationery", icon: PenTool },
    ]
  },
  {
    id: "groceries-pets",
    name: "Groceries & Pets",
    icon: Utensils,
    subCategories: [
      { id: "groceries", name: "Groceries", icon: ShoppingBag },
      { id: "pets", name: "Pets", icon: PawPrint },
      { id: "food", name: "Food", icon: Pizza },
      { id: "beverages", name: "Beverages", icon: Wine },
      { id: "snacks", name: "Snacks", icon: IceCream },
    ]
  },
  {
    id: "beauty-health",
    name: "Beauty & Health",
    icon: Sparkles,
    subCategories: [
      { id: "beauty", name: "Beauty Products", icon: Sparkles, isHot: true },
      { id: "skincare", name: "Skincare", icon: Heart },
      { id: "haircare", name: "Haircare", icon: Scissors },
      { id: "makeup", name: "Makeup", icon: Palette },
      { id: "fragrances", name: "Fragrances", icon: Flower2 },
      { id: "wellness", name: "Wellness", icon: Apple },
    ]
  },
  {
    id: "diy-garden",
    name: "DIY & Garden",
    icon: Tools,
    subCategories: [
      { id: "tools", name: "Tools", icon: Tools },
      { id: "hardware", name: "Hardware", icon: Wrench },
      { id: "garden", name: "Garden", icon: TreePine },
      { id: "plants", name: "Plants", icon: Sprout },
      { id: "outdoor-living", name: "Outdoor Living", icon: Tent },
    ]
  },
];

// Additional icon components
const Tablet = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Laptop = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Desktop = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Radio = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const Film = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const PenTool = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const PawPrint = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Scissors = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

const Wrench = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Ski = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Glasses = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);

  // Filter subcategories based on the selected category
  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);
  const subCategories = selectedCategoryData?.subCategories || [];

  return (
    <div className="max-w-screen overflow-hidden pb-16 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-3">
        <div className="flex">
          {/* Left sidebar - Vertical category list */}
          <div className="w-1/3 md:w-1/4 lg:w-1/5 pr-2 md:pr-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <ScrollArea className="h-[calc(100vh-var(--header-height)-100px)]">
                <ul className="py-2">
                  {/* Featured section */}
                  <li>
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 font-semibold border-b border-orange-100">
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Featured Categories
                      </div>
                    </div>
                  </li>

                  {/* Category list */}
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            "w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center border-b border-gray-100",
                            selectedCategory === category.id 
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border-l-4 border-blue-500" 
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-l-2 hover:border-gray-300"
                          )}
                        >
                          <Icon className="w-5 h-5 mr-3 text-gray-500" />
                          <span className="flex-1">{category.name}</span>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform",
                            selectedCategory === category.id ? "text-blue-500 rotate-90" : "text-gray-400"
                          )} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          </div>

          {/* Right content - Grid of subcategories with icons */}
          <div className="w-2/3 md:w-3/4 lg:w-4/5 pl-2 md:pl-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedCategoryData?.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  Browse through our extensive collection of {selectedCategoryData?.name.toLowerCase()} and find exactly what you need.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {subCategories.map((subCategory) => {
                  const SubIcon = subCategory.icon || Smartphone;
                  return (
                    <a 
                      key={subCategory.id}
                      href={`/categories/${selectedCategory}/${subCategory.id}`}
                      className="flex flex-col items-center p-3 md:p-4 rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-[1.02] group bg-white"
                    >
                      <div className="relative mb-3">
                        <div className={cn(
                          "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center",
                          subCategory.isHot 
                            ? "bg-gradient-to-br from-orange-100 to-red-100 text-orange-600" 
                            : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                        )}>
                          <SubIcon className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        {subCategory.isHot && (
                          <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 border-none shadow-sm">
                            HOT
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs md:text-sm text-center text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                        {subCategory.name}
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Browse all link */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <a 
                  href={`/categories/${selectedCategory}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Browse all {selectedCategoryData?.name.toLowerCase()}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}