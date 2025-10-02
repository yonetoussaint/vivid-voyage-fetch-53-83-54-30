
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight, TrendingUp, CircleDollarSign, Package, Heart, Store, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileDashboardProps {
  user: any;
  profile: any;
  viewMode?: "buyer" | "seller";
}

export default function ProfileDashboard({ user, profile, viewMode = "buyer" }: ProfileDashboardProps) {

  // Sample data - in a real app, this would come from API calls
  const recentOrders = [
    { id: "ORD-1234", date: "2023-05-10", status: "Delivered", total: 124.99 },
    { id: "ORD-1235", date: "2023-05-08", status: "Shipped", total: 74.50 },
    { id: "ORD-1236", date: "2023-05-05", status: "Processing", total: 249.99 },
  ];
  
  const recentSales = [
    { id: "SAL-8765", date: "2023-05-09", product: "Premium Headphones", amount: 89.99 },
    { id: "SAL-8766", date: "2023-05-07", product: "Smart Watch", amount: 199.99 },
  ];

  // Sample owned stores data - buyers can own up to 5 stores
  const ownedStores = [
    {
      id: "store-1",
      name: "TechHub Electronics",
      description: "Premium electronics and gadgets",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
      rating: 4.8,
      products: 45,
      sales: 892,
      revenue: 12500
    },
    {
      id: "store-2", 
      name: "Fashion Forward",
      description: "Trendy clothing and accessories",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
      rating: 4.6,
      products: 78,
      sales: 1240,
      revenue: 8900
    },
    {
      id: "store-3",
      name: "Home & Garden Plus",
      description: "Everything for your home and garden",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
      rating: 4.7,
      products: 32,
      sales: 456,
      revenue: 6200
    }
  ];

  
  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {viewMode === "buyer" ? (
        // Buyer Dashboard - Show Owned Stores
        <>
          <div className="grid grid-cols-1 gap-6">
            {/* My Stores Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    My Stores
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/seller/new" className="flex items-center gap-1 text-xs">
                      Create Store <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Manage your stores and track their performance</CardDescription>
              </CardHeader>
              <CardContent>
                {ownedStores.length > 0 ? (
                  <div className="space-y-4">
                    {ownedStores.slice(0, 5).map((store) => (
                      <Card 
                        key={store.id} 
                        className="hover:shadow-md transition-shadow border border-border hover:border-primary/50"
                      >
                        <Link to="/seller-dashboard/overview" className="block">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={store.image}
                              alt={store.name}
                              className="w-16 h-16 rounded-lg object-cover border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-base truncate">{store.name}</h3>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium">{store.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{store.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {store.products} products
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingBag className="h-3 w-3" />
                                  {store.sales} sales
                                </span>
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                  <CircleDollarSign className="h-3 w-3" />
                                  ${store.revenue.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardContent>
                        </Link>
                      </Card>
                    ))}
                    {ownedStores.length > 5 && (
                      <div className="text-center py-2 border-t mt-4 pt-4">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/account/stores" className="text-xs text-muted-foreground">
                            View all {ownedStores.length} stores <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-lg font-medium mb-1">No stores yet</p>
                    <p className="text-sm mb-4">Create your first store to start selling</p>
                    <Button asChild>
                      <Link to="/seller/new">Create Your First Store</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders - Secondary for buyers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/account/orders" className="flex items-center gap-1 text-xs">
                      View all <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Your most recent purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-xs ${statusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                          <span className="font-medium">${order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No orders yet</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/browse">Start shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        // Seller Dashboard - Existing Content
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Sales</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/account/sales" className="flex items-center gap-1 text-xs">
                      View all <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Your most recent sales</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSales.length > 0 ? (
                  <div className="space-y-4">
                    {recentSales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{sale.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{sale.date}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm">{sale.product}</span>
                          <span className="font-medium text-green-600">${sale.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No sales yet</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/account/products/new">Add a product</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders for sellers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/account/orders" className="flex items-center gap-1 text-xs">
                      View all <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>Orders from your customers</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-xs ${statusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                          <span className="font-medium">${order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No orders yet</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/browse">Start shopping</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Quick Actions - Only show for seller mode */}
      {viewMode === "seller" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="group hover:border-primary transition-colors">
            <Link to="/account/products/new" className="block p-4">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Add New Product</h3>
                <p className="text-xs text-muted-foreground mt-1">List a new item for sale</p>
              </div>
            </Link>
          </Card>
          
          <Card className="group hover:border-primary transition-colors">
            <Link to="/browse" className="block p-4">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Browse Products</h3>
                <p className="text-xs text-muted-foreground mt-1">Discover new items</p>
              </div>
            </Link>
          </Card>
          
          <Card className="group hover:border-primary transition-colors">
            <Link to="/account/wishlist" className="block p-4">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">Wishlist</h3>
                <p className="text-xs text-muted-foreground mt-1">View saved items</p>
              </div>
            </Link>
          </Card>
          
          <Card className="group hover:border-primary transition-colors">
            <Link to="/account/analytics" className="block p-4">
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium">View Analytics</h3>
                <p className="text-xs text-muted-foreground mt-1">Track your performance</p>
              </div>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
