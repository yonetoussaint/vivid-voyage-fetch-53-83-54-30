
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Eye, Edit, 
  Trash2, Package, Star, DollarSign, Calendar,
  AlertTriangle, CheckCircle, Clock, Ban, Flag,
  Image, Video, Tag, Settings
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

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Rejected' | 'Out of Stock';
  stock: number;
  rating: number;
  reviewCount: number;
  sales: number;
  dateAdded: string;
  lastUpdated: string;
  reportsCount: number;
  isPromoted: boolean;
  hasVideo: boolean;
}

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB',
      seller: 'Tech Gadgets Pro',
      category: 'Electronics',
      price: 1199.99,
      originalPrice: 1299.99,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop',
      status: 'Active',
      stock: 25,
      rating: 4.8,
      reviewCount: 124,
      sales: 89,
      dateAdded: '2024-01-15',
      lastUpdated: '2 hours ago',
      reportsCount: 0,
      isPromoted: true,
      hasVideo: true
    },
    {
      id: '2',
      name: 'Nike Air Jordan 1 Retro High',
      seller: 'Fashion Forward',
      category: 'Fashion',
      price: 170.00,
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=150&h=150&fit=crop',
      status: 'Active',
      stock: 15,
      rating: 4.6,
      reviewCount: 67,
      sales: 45,
      dateAdded: '2024-01-10',
      lastUpdated: '1 day ago',
      reportsCount: 1,
      isPromoted: false,
      hasVideo: false
    },
    {
      id: '3',
      name: 'Smart Coffee Maker Pro',
      seller: 'Home Essentials',
      category: 'Home & Living',
      price: 299.99,
      originalPrice: 349.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=150&h=150&fit=crop',
      status: 'Pending',
      stock: 0,
      rating: 0,
      reviewCount: 0,
      sales: 0,
      dateAdded: '2024-01-05',
      lastUpdated: '3 hours ago',
      reportsCount: 0,
      isPromoted: false,
      hasVideo: true
    },
    {
      id: '4',
      name: 'Gaming Mechanical Keyboard',
      seller: 'Tech Gadgets Pro',
      category: 'Electronics',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=150&h=150&fit=crop',
      status: 'Suspended',
      stock: 8,
      rating: 3.2,
      reviewCount: 23,
      sales: 12,
      dateAdded: '2023-12-20',
      lastUpdated: '2 weeks ago',
      reportsCount: 3,
      isPromoted: false,
      hasVideo: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.seller.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return b.price - a.price;
        case 'sales': return b.sales - a.sales;
        case 'rating': return b.rating - a.rating;
        case 'dateAdded': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        default: return 0;
      }
    });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'Active').length,
    pending: products.filter(p => p.status === 'Pending').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    flagged: products.filter(p => p.reportsCount > 0).length,
    promoted: products.filter(p => p.isPromoted).length
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Product Management</h1>
              <p className="text-xs text-muted-foreground">Monitor and moderate marketplace products</p>
            </div>
            <div className="flex gap-2">
              {selectedProducts.size > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Package className="w-4 h-4 mr-1" />
                      Bulk Actions ({selectedProducts.size})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="w-4 h-4 mr-2" />
                      Suspend Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Ban className="w-4 h-4 mr-2" />
                      Reject Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">{stats.outOfStock}</div>
              <div className="text-xs text-muted-foreground">Out of Stock</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.flagged}</div>
              <div className="text-xs text-muted-foreground">Flagged</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.promoted}</div>
              <div className="text-xs text-muted-foreground">Promoted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-36 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Home & Living">Home & Living</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="price">Sort by Price</SelectItem>
              <SelectItem value="sales">Sort by Sales</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="dateAdded">Sort by Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products List */}
      <div className="p-3">
        <div className="grid gap-3">
          {filteredAndSortedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => {
                      const newSelected = new Set(selectedProducts);
                      if (newSelected.has(product.id)) {
                        newSelected.delete(product.id);
                      } else {
                        newSelected.add(product.id);
                      }
                      setSelectedProducts(newSelected);
                    }}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />

                  {/* Product Image and Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      {product.hasVideo && (
                        <div className="absolute top-1 right-1 bg-black/70 rounded-full p-1">
                          <Video className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {product.isPromoted && (
                        <div className="absolute -top-1 -left-1 bg-red-600 text-white text-xs px-1 rounded">
                          AD
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</h3>
                        {product.reportsCount > 0 && (
                          <Flag className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>by {product.seller}</span>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <span>Added {product.dateAdded}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Stats */}
                  <div className="hidden md:flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        ${product.price}
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through ml-1">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground">Price</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </div>
                      <div className="text-muted-foreground">Stock</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        {product.rating || 'N/A'}
                      </div>
                      <div className="text-muted-foreground">({product.reviewCount})</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{product.sales}</div>
                      <div className="text-muted-foreground">Sales</div>
                    </div>
                  </div>

                  {/* Status */}
                  <Badge variant="secondary" className={`${getStatusColor(product.status)} text-xs`}>
                    {product.status}
                  </Badge>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Product
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        View Reports ({product.reportsCount})
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Promotion
                      </DropdownMenuItem>
                      {product.status === 'Pending' && (
                        <>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Product
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Reject Product
                          </DropdownMenuItem>
                        </>
                      )}
                      {product.status === 'Active' && (
                        <DropdownMenuItem className="text-yellow-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Suspend Product
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
