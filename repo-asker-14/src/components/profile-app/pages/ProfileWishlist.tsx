import React, { useState } from 'react';
import { 
  Heart, Search, Filter, MoreHorizontal, ShoppingCart, 
  Trash2, Share2, Star, DollarSign, Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ProfileWishlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const wishlistItems = [
    {
      id: '1',
      name: 'Gaming Headset Pro',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=300&h=300&fit=crop',
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      seller: 'AudioTech Store',
      rating: 4.8,
      reviews: 142,
      category: 'Electronics',
      inStock: true,
      dateAdded: '2024-01-15',
      priceDropped: true,
      lastPriceCheck: '2024-01-20'
    },
    {
      id: '2',
      name: 'Ergonomic Office Chair',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      price: 299.99,
      originalPrice: 299.99,
      discount: 0,
      seller: 'Office Comfort',
      rating: 4.6,
      reviews: 89,
      category: 'Furniture',
      inStock: true,
      dateAdded: '2024-01-10',
      priceDropped: false,
      lastPriceCheck: '2024-01-20'
    },
    {
      id: '3',
      name: 'Wireless Charging Pad',
      image: 'https://images.unsplash.com/photo-1609592094521-de091bfb5df4?w=300&h=300&fit=crop',
      price: 45.99,
      originalPrice: 59.99,
      discount: 23,
      seller: 'TechAccessories',
      rating: 4.4,
      reviews: 234,
      category: 'Electronics',
      inStock: false,
      dateAdded: '2024-01-08',
      priceDropped: true,
      lastPriceCheck: '2024-01-19'
    },
    {
      id: '4',
      name: 'Running Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      price: 129.99,
      originalPrice: 149.99,
      discount: 13,
      seller: 'Athletic Gear',
      rating: 4.7,
      reviews: 567,
      category: 'Sports',
      inStock: true,
      dateAdded: '2024-01-05',
      priceDropped: false,
      lastPriceCheck: '2024-01-20'
    },
    {
      id: '5',
      name: 'Coffee Maker Deluxe',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
      price: 189.99,
      originalPrice: 220.99,
      discount: 14,
      seller: 'Kitchen Pro',
      rating: 4.5,
      reviews: 123,
      category: 'Home',
      inStock: true,
      dateAdded: '2024-01-01',
      priceDropped: true,
      lastPriceCheck: '2024-01-18'
    }
  ];

  const categories = ['All', 'Electronics', 'Furniture', 'Sports', 'Home', 'Fashion'];

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleRemoveFromWishlist = (itemId: string) => {
    // Handle remove from wishlist logic
    console.log('Remove item:', itemId);
  };

  const handleAddToCart = (itemId: string) => {
    // Handle add to cart logic
    console.log('Add to cart:', itemId);
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">My Wishlist</h1>
              <p className="text-xs text-muted-foreground">{wishlistItems.length} items saved</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
              <Button size="sm">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add All to Cart
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search wishlist items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.filter(cat => cat !== 'All').map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              <Package className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="px-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {item.discount > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                        -{item.discount}%
                      </Badge>
                    )}
                    {item.priceDropped && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                        Price Drop!
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Product</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            Remove from Wishlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">by {item.seller}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor(item.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'fill-gray-200 text-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold">${item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-8 text-xs"
                        disabled={!item.inStock}
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Added {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">by {item.seller}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.priceDropped && (
                            <Badge className="bg-green-500 text-white text-xs">
                              Price Drop!
                            </Badge>
                          )}
                          {item.discount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              -{item.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < Math.floor(item.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'fill-gray-200 text-gray-200'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.rating} ({item.reviews} reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${item.price}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(item.dateAdded).toLocaleDateString()}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm"
                            disabled={!item.inStock}
                            onClick={() => handleAddToCart(item.id)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items in your wishlist</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== 'all' 
                  ? 'No items match your search criteria' 
                  : "Start adding products you love to your wishlist"}
              </p>
              <Button>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileWishlist;