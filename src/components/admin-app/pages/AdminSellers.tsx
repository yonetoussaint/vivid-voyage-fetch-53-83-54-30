
import React, { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, Mail, Phone, 
  MapPin, Star, ShoppingBag, Calendar, Eye, Plus,
  Shield, AlertTriangle, Ban, CheckCircle, Clock,
  UserCheck, Settings, MessageSquare, Flag, Store
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface Seller {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Rejected';
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  totalProducts: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  joinDate: string;
  lastActivity: string;
  commission: number;
  reportsCount: number;
}

const AdminSellers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedSellers, setSelectedSellers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('businessName');
  
  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: '1',
      businessName: 'Tech Gadgets Pro',
      ownerName: 'Michael Chen',
      email: 'mike@techgadgets.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      status: 'Active',
      verificationStatus: 'Verified',
      totalProducts: 124,
      totalSales: 15420.99,
      rating: 4.8,
      reviewCount: 89,
      joinDate: '2023-06-15',
      lastActivity: '2 hours ago',
      commission: 8.5,
      reportsCount: 0
    },
    {
      id: '2',
      businessName: 'Fashion Forward',
      ownerName: 'Sarah Wilson',
      email: 'sarah@fashionforward.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e1b4?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      status: 'Active',
      verificationStatus: 'Verified',
      totalProducts: 89,
      totalSales: 22150.75,
      rating: 4.9,
      reviewCount: 156,
      joinDate: '2023-03-10',
      lastActivity: '1 day ago',
      commission: 7.0,
      reportsCount: 1
    },
    {
      id: '3',
      businessName: 'Home Essentials',
      ownerName: 'David Rodriguez',
      email: 'david@homeessentials.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      status: 'Pending',
      verificationStatus: 'Under Review',
      totalProducts: 45,
      totalSales: 0,
      rating: 0,
      reviewCount: 0,
      joinDate: '2024-01-05',
      lastActivity: '3 hours ago',
      commission: 10.0,
      reportsCount: 0
    },
    {
      id: '4',
      businessName: 'Sports Zone',
      ownerName: 'Lisa Thompson',
      email: 'lisa@sportszone.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      location: 'Chicago, IL',
      status: 'Suspended',
      verificationStatus: 'Verified',
      totalProducts: 67,
      totalSales: 8750.25,
      rating: 3.2,
      reviewCount: 45,
      joinDate: '2023-07-08',
      lastActivity: '2 weeks ago',
      commission: 9.0,
      reportsCount: 5
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedSellers = sellers
    .filter(seller => {
      const matchesSearch = seller.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           seller.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || seller.status === statusFilter;
      const matchesVerification = verificationFilter === 'all' || seller.verificationStatus === verificationFilter;
      return matchesSearch && matchesStatus && matchesVerification;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'businessName': return a.businessName.localeCompare(b.businessName);
        case 'sales': return b.totalSales - a.totalSales;
        case 'rating': return b.rating - a.rating;
        case 'joinDate': return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default: return 0;
      }
    });

  const stats = {
    total: sellers.length,
    active: sellers.filter(s => s.status === 'Active').length,
    pending: sellers.filter(s => s.status === 'Pending').length,
    verified: sellers.filter(s => s.verificationStatus === 'Verified').length,
    suspended: sellers.filter(s => s.status === 'Suspended').length,
    flagged: sellers.filter(s => s.reportsCount > 0).length
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Seller Management</h1>
              <p className="text-xs text-muted-foreground">Review and manage marketplace sellers</p>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-1" />
              Invite Seller
            </Button>
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
              <div className="text-lg font-bold text-emerald-600">{stats.verified}</div>
              <div className="text-xs text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.suspended}</div>
              <div className="text-xs text-muted-foreground">Suspended</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.flagged}</div>
              <div className="text-xs text-muted-foreground">Flagged</div>
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
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-full sm:w-36 h-9">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="businessName">Sort by Name</SelectItem>
              <SelectItem value="sales">Sort by Sales</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="joinDate">Sort by Join Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sellers List */}
      <div className="p-3">
        <div className="grid gap-3">
          {filteredAndSortedSellers.map((seller) => (
            <Card key={seller.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar and Basic Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={seller.avatar} />
                      <AvatarFallback>{seller.businessName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{seller.businessName}</h3>
                        {seller.verificationStatus === 'Verified' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                        <Store className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{seller.ownerName}</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {seller.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {seller.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Stats */}
                  <div className="hidden md:flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{seller.totalProducts}</div>
                      <div className="text-muted-foreground">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">${seller.totalSales.toFixed(2)}</div>
                      <div className="text-muted-foreground">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        {seller.rating || 'N/A'}
                      </div>
                      <div className="text-muted-foreground">({seller.reviewCount})</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">{seller.commission}%</div>
                      <div className="text-muted-foreground">Commission</div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className={`${getStatusColor(seller.status)} text-xs`}>
                      {seller.status}
                    </Badge>
                    <Badge variant="secondary" className={`${getVerificationColor(seller.verificationStatus)} text-xs`}>
                      {seller.verificationStatus}
                    </Badge>
                  </div>

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
                        View Store
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Seller
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Seller
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="w-4 h-4 mr-2" />
                        View Reports
                      </DropdownMenuItem>
                      {seller.status === 'Pending' && (
                        <>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Seller
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Reject Seller
                          </DropdownMenuItem>
                        </>
                      )}
                      {seller.status === 'Active' && (
                        <DropdownMenuItem className="text-yellow-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Suspend Seller
                        </DropdownMenuItem>
                      )}
                      {seller.status === 'Suspended' && (
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reactivate Seller
                        </DropdownMenuItem>
                      )}
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

export default AdminSellers;
