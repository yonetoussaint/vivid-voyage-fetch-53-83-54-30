import React, { useState } from "react";
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
  icon: React.ElementType;
  subCategories: SubCategory[];
}

interface CategoryGroup {
  title: string;
  items: SubCategory[];
}

interface Product {
  id: string;
  title: string;
  price: string;
  soldCount: string;
  rating: string;
  imageUrl: string;
  tags: string[];
  description: string;
  note?: string;
  qualityNote?: string;
}

interface CategoriesPageProps {
  categories: Category[];
  products: Product[];
}

// Default Categories Data with all tabs populated
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "just",
    name: "Just for You",
    icon: User,
    subCategories: [
      { id: "recommended", name: "Recommended for You", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "trending", name: "Trending Now", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "personal", name: "Personal Picks", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "recent", name: "Recently Viewed", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "saved", name: "Saved Items", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "accessories",
    name: "Electronic Accessories",
    icon: Plug,
    subCategories: [
      { id: "chargers", name: "Chargers & Cables", imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "cases", name: "Phone Cases", imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "headphones", name: "Headphones", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "powerbanks", name: "Power Banks", imageUrl: "https://images.unsplash.com/photo-1609091839314-d8ad8e02782e?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "smartwatch", name: "Smartwatch Bands", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "speakers", name: "Bluetooth Speakers", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "cables", name: "Cables & Adapters", imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "screen", name: "Screen Protectors", imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
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
    subCategories: [
      { id: "televisions", name: "Televisions", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f81a1f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "refrigerators", name: "Refrigerators", imageUrl: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "ac", name: "Air Conditioners", imageUrl: "https://images.unsplash.com/photo-1560347879-9d2e3e7d21be?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "washing", name: "Washing Machines", imageUrl: "https://images.unsplash.com/photo-1626806819289-1d87f82a3b2c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "microwave", name: "Microwave Ovens", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "fans", name: "Fans & Coolers", imageUrl: "https://images.unsplash.com/photo-1589336155885-1c34c1c314f8?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "heaters", name: "Water Heaters", imageUrl: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "vacuum", name: "Vacuum Cleaners", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "beauty",
    name: "Health & Beauty",
    icon: Droplet,
    subCategories: [
      { id: "skincare", name: "Skincare", imageUrl: "https://images.unsplash.com/photo-1570197788418-6e9e0c3c3c3c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "makeup", name: "Makeup", imageUrl: "https://images.unsplash.com/photo-1591370874773-7068003e5c4c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "haircare", name: "Hair Care", imageUrl: "https://images.unsplash.com/photo-1596462515236-8a06c3e6c9e9?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "fragrance", name: "Perfumes", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "tools", name: "Beauty Tools", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "bath", name: "Bath & Body", imageUrl: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "oral", name: "Oral Care", imageUrl: "https://images.unsplash.com/photo-162179148c5-6b6c4c7f7a1b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "mens", name: "Men's Grooming", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "babies",
    name: "Babies & Toys",
    icon: Baby,
    subCategories: [
      { id: "diapers", name: "Diapers & Wipes", imageUrl: "https://images.unsplash.com/photo-1586281380344-450c3e1d5c2c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "feeding", name: "Feeding", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "toys", name: "Toys & Games", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "clothing", name: "Baby Clothing", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "strollers", name: "Strollers & Carriers", imageUrl: "https://images.unsplash.com/photo-1506123306783-3c8e56a5dd04?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "nursery", name: "Nursery Furniture", imageUrl: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "safety", name: "Baby Safety", imageUrl: "https://images.unsplash.com/photo-1586281380344-450c3e1d5c2c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "bathing", name: "Bathing & Changing", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "groceries",
    name: "Groceries & Pets",
    icon: ShoppingCart,
    subCategories: [
      { id: "snacks", name: "Snacks & Drinks", imageUrl: "https://images.unsplash.com/photo-1542834289-4359b3f1e7e8?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "rice-oil", name: "Rice & Oil", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "pet-food", name: "Pet Food", imageUrl: "https://images.unsplash.com/photo-1548767797-d8c6e7e7d8d8?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "dairy", name: "Dairy & Eggs", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "fruits", name: "Fruits & Vegetables", imageUrl: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "beverages", name: "Beverages", imageUrl: "https://images.unsplash.com/photo-1600271886742-f049cd5b8a7b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "pet-supplies", name: "Pet Supplies", imageUrl: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "frozen", name: "Frozen Foods", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "home",
    name: "Home & Lifestyle",
    icon: Home,
    subCategories: [
      { id: "furniture", name: "Furniture", imageUrl: "https://images.unsplash.com/photo-1555041469-c5f4d8f8d8d8?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "bedding", name: "Bedding & Bath", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b1c045efd9?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "decor", name: "Home Decor", imageUrl: "https://images.unsplash.com/photo-1618220048045-10a6a6d9d9d9?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "kitchen", name: "Kitchen & Dining", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "lighting", name: "Lighting", imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "storage", name: "Storage & Organization", imageUrl: "https://images.unsplash.com/photo-1586023492125-27b1c045efd9?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "garden", name: "Garden & Outdoor", imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "cleaning", name: "Cleaning Supplies", imageUrl: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "women",
    name: "Women's Fashion & Accessories",
    icon: Shirt,
    subCategories: [
      { id: "dresses", name: "Dresses", imageUrl: "https://images.unsplash.com/photo-1595776619627-1d9d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "tops", name: "Tops & Blouses", imageUrl: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "shoes-women", name: "Women's Shoes", imageUrl: "https://images.unsplash.com/photo-1562183241-b937e1a1822b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "bags", name: "Bags & Purses", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "jewelry", name: "Jewelry", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "activewear", name: "Activewear", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "lingerie", name: "Lingerie & Sleepwear", imageUrl: "https://images.unsplash.com/photo-1523380677598-64d85b8d6d8b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "accessories", name: "Accessories", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "men",
    name: "Men's Fashion & Accessories",
    icon: Users,
    subCategories: [
      { id: "shirts-men", name: "Shirts", imageUrl: "https://images.unsplash.com/photo-1596755096483-2d9d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "tshirts", name: "T-Shirts", imageUrl: "https://images.unsplash.com/photo-1521577352947-9d9d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "shoes-men", name: "Men's Shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "pants", name: "Pants & Jeans", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "suits", name: "Suits & Blazers", imageUrl: "https://images.unsplash.com/photo-1594938298603-0b8c7b7c7c7c?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "watches", name: "Watches", imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "underwear", name: "Underwear & Socks", imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "accessories-men", name: "Accessories", imageUrl: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "kids",
    name: "Kid's Fashion & Accessories",
    icon: Watch,
    subCategories: [
      { id: "boys", name: "Boys Clothing", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "girls", name: "Girls Clothing", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "shoes-kids", name: "Kids Shoes", imageUrl: "https://images.unsplash.com/photo-1542293241-b937e1a1822b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "school", name: "School Uniforms", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "accessories-kids", name: "Kids Accessories", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "baby-clothes", name: "Baby Clothes", imageUrl: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "outerwear", name: "Outerwear", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "swimwear", name: "Swimwear", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "sports",
    name: "Sports & Lifestyle",
    icon: Car,
    subCategories: [
      { id: "fitness", name: "Fitness & Gym", imageUrl: "https://images.unsplash.com/photo-1517838277536-9d9d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "cycling", name: "Cycling", imageUrl: "https://images.unsplash.com/photo-1558618046-9d9d9d9d9d9d?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "sports-shoes", name: "Sports Shoes", imageUrl: "https://images.unsplash.com/photo-1542293241-b937e1a1822b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "camping", name: "Camping & Hiking", imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "team-sports", name: "Team Sports", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "water-sports", name: "Water Sports", imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "yoga", name: "Yoga & Pilates", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&h=200&auto=format&fit=crop" },
      { id: "outdoor", name: "Outdoor Gear", imageUrl: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?q=80&w=200&h=200&auto=format&fit=crop" }
    ]
  },
];

// Default Products Data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones Noise Cancel",
    price: "79523",
    soldCount: "234",
    rating: "4.8",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Sale", "SuperDeals"],
    description: "Wireless Bluetooth Headphones Noise Cancel",
    note: ""
  },
  {
    id: "2",
    title: "Smart Watch Fitness Tracker Heart Rate",
    price: "67019",
    soldCount: "18081",
    rating: "4.7",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Sale"],
    description: "Smart Watch Fitness Tracker Heart Rate",
    note: "Top selling on AliExpress"
  },
  {
    id: "3",
    title: "Sport Smart Watch Fitness Call",
    price: "105730",
    soldCount: "1361",
    rating: "4.6",
    imageUrl: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Sale", "SuperDeals"],
    description: "Sport Smart Watch Fitness Call",
    qualityNote: "Premium Quality"
  },
  {
    id: "4",
    title: "30 36 Inch Curly Highlight Wig Human",
    price: "741510",
    soldCount: "637",
    rating: "4.7",
    imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Brand+", "Sale"],
    description: "30 36 Inch Curly Highlight Wig Human",
    note: "Top selling on AliExpress"
  },
  {
    id: "5",
    title: "Premium Wireless Speaker Deep Bass",
    price: "89990",
    soldCount: "432",
    rating: "4.8",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Sale"],
    description: "Premium Wireless Speaker Deep Bass",
    note: ""
  },
  {
    id: "6",
    title: "HD Webcam 1080P Built-in Microphone",
    price: "49990",
    soldCount: "789",
    rating: "5.0",
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Certified Original"],
    description: "HD Webcam 1080P Built-in Microphone",
    qualityNote: "Premium Quality"
  },
  {
    id: "7",
    title: "Mechanical Gaming Keyboard RGB",
    price: "767523",
    soldCount: "38",
    rating: "4.8",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Sale", "250%"],
    description: "Mechanical Gaming Keyboard RGB",
    qualityNote: "Premium Quality"
  },
  {
    id: "8",
    title: "Ergonomic Wireless Mouse Rechargeable",
    price: "24990",
    soldCount: "923",
    rating: "4.7",
    imageUrl: "https://images.unsplash.com/photo-1586864387634-97201e228378?q=80&w=300&h=300&auto=format&fit=crop",
    tags: ["Brand+"],
    description: "Ergonomic Wireless Mouse Rechargeable",
    note: ""
  }
];

// Default Category Groups for all categories
const DEFAULT_CATEGORY_GROUPS: Record<string, CategoryGroup[]> = {
  just: [
    { 
      title: "Personal Recommendations", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "just")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Your Activity", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "just")?.subCategories.slice(4) || []
    }
  ],
  accessories: [
    { 
      title: "Mobile Accessories", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "accessories")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Audio & Wearables", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "accessories")?.subCategories.slice(4) || []
    }
  ],
  devices: [
    { 
      title: "Mobiles & Tablets", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "devices")?.subCategories.slice(0, 3) || []
    },
    { 
      title: "Laptops", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "devices")?.subCategories.slice(3, 5) || []
    },
    { 
      title: "Desktop Computers", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "devices")?.subCategories.slice(5, 8) || []
    },
    { 
      title: "Wearables", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "devices")?.subCategories.slice(8, 10) || []
    },
    { 
      title: "Gaming", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "devices")?.subCategories.slice(10) || []
    }
  ],
  tv: [
    { 
      title: "Home Entertainment", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "tv")?.subCategories.slice(0, 1) || []
    },
    { 
      title: "Major Appliances", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "tv")?.subCategories.slice(1, 5) || []
    },
    { 
      title: "Home Comfort", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "tv")?.subCategories.slice(5) || []
    }
  ],
  beauty: [
    { 
      title: "Skincare & Makeup", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "beauty")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Personal Care", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "beauty")?.subCategories.slice(4) || []
    }
  ],
  babies: [
    { 
      title: "Baby Essentials", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "babies")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Nursery & Safety", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "babies")?.subCategories.slice(4) || []
    }
  ],
  groceries: [
    { 
      title: "Food & Beverages", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "groceries")?.subCategories.slice(0, 6) || []
    },
    { 
      title: "Pets", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "groceries")?.subCategories.slice(6) || []
    }
  ],
  home: [
    { 
      title: "Furniture & Decor", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "home")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Home Essentials", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "home")?.subCategories.slice(4) || []
    }
  ],
  women: [
    { 
      title: "Clothing", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "women")?.subCategories.slice(0, 3) || []
    },
    { 
      title: "Accessories", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "women")?.subCategories.slice(3) || []
    }
  ],
  men: [
    { 
      title: "Clothing", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "men")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Accessories", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "men")?.subCategories.slice(4) || []
    }
  ],
  kids: [
    { 
      title: "Clothing", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "kids")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Accessories", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "kids")?.subCategories.slice(4) || []
    }
  ],
  sports: [
    { 
      title: "Fitness & Sports", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "sports")?.subCategories.slice(0, 4) || []
    },
    { 
      title: "Outdoor Activities", 
      items: DEFAULT_CATEGORIES.find(c => c.id === "sports")?.subCategories.slice(4) || []
    }
  ]
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ 
  categories = DEFAULT_CATEGORIES, 
  products = DEFAULT_PRODUCTS 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("devices");

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const categoryGroups = DEFAULT_CATEGORY_GROUPS[selectedCategory] || [];

  // Helper function to render tag elements
  const renderTag = (tag: string) => {
    if (tag === "Sale") {
      return <span className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "SuperDeals") {
      return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "Brand+") {
      return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "Certified Original") {
      return <span className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    if (tag === "250%") {
      return <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-[10px] mr-1 inline-block align-middle">{tag}</span>;
    }
    return null;
  };

  // Helper function to render subcategory sections
  const renderSubCategorySection = (group: CategoryGroup) => (
    <div key={group.title} className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">{group.title}</h2>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {group.items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div className="w-full aspect-square bg-white rounded mb-1.5 overflow-hidden">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-gray-900 text-center">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Helper function to render product card
  const renderProductCard = (product: Product) => (
    <div key={product.id}>
      <div className="w-full aspect-square bg-white rounded overflow-hidden mb-1">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-[11px] text-gray-700 mb-0.5 line-clamp-2 leading-tight">
          {product.tags.map(tag => renderTag(tag))}
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] text-gray-500">{product.soldCount} sold</span>
          <span className="text-[10px] text-gray-400">|</span>
          <span className="text-[10px] text-gray-700">ˇú {product.rating}</span>
        </div>
        <p className="text-sm font-bold text-gray-900">{product.price}</p>
        {product.note && (
          <p className="text-[10px] text-gray-500">{product.note}</p>
        )}
        {product.qualityNote && (
          <p className="text-[10px] text-orange-600">{product.qualityNote}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 h-screen flex overflow-hidden">
      {/* Left sidebar - Shadow removed */}
      <div className="w-24 bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide py-4">
          <div className="min-h-full">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative w-full py-4 flex flex-col items-center gap-1 transition-all ${
                    isActive ? "text-orange-600 bg-gray-50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={`text-[8px] font-medium px-1 leading-tight text-center ${
                    isActive ? "text-gray-800" : "text-gray-800"
                  }`}>
                    {category.name.split(" ")[0]}
                    {category.name.includes(" ") && (
                      <>
                        <br />
                        {category.name.split(" ").slice(1).join(" ")}
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <div 
          className="flex-1 overflow-y-auto scroll-wheel" 
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
                {/* Render all category groups */}
                {categoryGroups.map(renderSubCategorySection)}

                {/* Product Suggestions Grid */}
                <div className="mt-8 mb-8">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">You May Also Like</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {products.map(renderProductCard)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <GlobalStyles />
    </div>
  );
};

// Separate GlobalStyles component for better organization
const GlobalStyles: React.FC = () => (
  <style jsx global>{`
    body {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
    }
    .scroll-wheel {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
    .scroll-wheel::-webkit-scrollbar {
      display: none;
    }
    .scroll-wheel {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
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
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `}</style>
);

CategoriesPage.defaultProps = {
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS
};

export default CategoriesPage;