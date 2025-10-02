import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreHorizontal, Edit, Eye, 
  Trash2, Package, Star, TrendingUp, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const SellerProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const products = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      sku: 'WEP-001',
      price: 49.99,
      stock: 156,
      status: 'Active',
      sales: 234,
      rating: 4.8,
      category: 'Electronics',
      lastUpdated: '2024-01-20'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      sku: 'SWS-005',
      price: 299.99,
      stock: 43,
      status: 'Active',
      sales: 189,
      rating: 4.6,
      category: 'Electronics',
      lastUpdated: '2024-01-19'
    },
    {
      id: '3',
      name: 'USB-C Fast Charger',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      sku: 'UFC-020',
      price: 19.99,
      stock: 0,
      status: 'Out of Stock',
      sales: 156,
      rating: 4.4,
      category: 'Accessories',
      lastUpdated: '2024-01-18'
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      sku: 'BTS-012',
      price: 79.99,
      stock: 89,
      status: 'Active',
      sales: 123,
      rating: 4.7,
      category: 'Audio',
      lastUpdated: '2024-01-17'
    },
    {
      id: '5',
      name: 'Phone Case Premium',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop',
      sku: 'PCP-089',
      price: 24.99,
      stock: 234,
      status: 'Draft',
      sales: 98,
      rating: 4.3,
      category: 'Accessories',
      lastUpdated: '2024-01-16'
    },
    {
      id: '6',
      name: 'Wireless Mouse Pro',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      sku: 'WMP-033',
      price: 39.99,
      stock: 67,
      status: 'Active',
      sales: 145,
      rating: 4.5,
      category: 'Accessories',
      lastUpdated: '2024-01-15'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Products</h1>
              <p className="text-xs text-muted-foreground">Manage your catalog</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">89</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">76</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">12</div>
              <div className="text-xs text-muted-foreground">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">4.6</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="space-y-2">
              <div className="relative aspect-[3:4] overflow-hidden bg-gray-50 rounded-md">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Status badge */}
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(product.status)} absolute top-2 right-2 text-xs`}
                >
                  {product.status}
                </Badge>

                {/* Actions overlay */}
                <div className="absolute top-2 left-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stock indicator */}
                {product.stock === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs flex items-center justify-center py-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Out of Stock
                  </div>
                )}
                {product.stock > 0 && product.stock < 20 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 text-white text-xs flex items-center justify-center py-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Low Stock
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="space-y-1">
                <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                  {product.name}
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold text-base">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{product.stock} in stock</span>
                  <span>{product.sales} sold</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;