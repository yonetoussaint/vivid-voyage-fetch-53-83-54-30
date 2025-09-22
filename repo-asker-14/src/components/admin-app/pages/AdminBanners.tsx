

import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, Filter, MoreVertical, Image, 
  Plus, ArrowUp, ArrowDown, Trash2, 
  Eye, Edit, Calendar, Clock, CheckCircle,
  AlertTriangle, ChevronDown, DollarSign,
  User, Building, Globe, Crown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  fetchHeroBanners, 
  deleteHeroBanner, 
  updateHeroBannerPosition 
} from "@/integrations/supabase/hero";
import HeroBannerUploadDialog from "@/components/admin/dialogs/HeroBannerUploadDialog";

interface Banner {
  id: string;
  image: string;
  alt: string;
  position: number;
  duration: number;
  created_at: string;
  updated_at: string;
  banner_type?: 'system' | 'seller_premium' | 'seller_standard' | 'promotional';
  status?: 'active' | 'pending' | 'approved' | 'rejected' | 'expired' | 'scheduled';
  seller_id?: string;
  seller_name?: string;
  payment_status?: 'paid' | 'pending' | 'failed' | 'refunded';
  promotion_start?: string;
  promotion_end?: string;
  price_paid?: number;
}

const AdminBanners = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerTypeFilter, setBannerTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('position');
  const [showFilters, setShowFilters] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch hero banners
  const { data: banners = [], isLoading, error, refetch } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 30000,
  });

  // Transform banners to include mock data for demonstration
  const transformedBanners: Banner[] = banners.map((banner, index) => ({
    ...banner,
    banner_type: index % 4 === 0 ? 'system' : 
                index % 4 === 1 ? 'seller_premium' : 
                index % 4 === 2 ? 'seller_standard' : 'promotional',
    status: index % 5 === 0 ? 'pending' : 
           index % 5 === 1 ? 'approved' : 
           index % 5 === 2 ? 'rejected' : 
           index % 5 === 3 ? 'expired' : 'active',
    seller_id: index % 4 !== 0 ? `seller_${index}` : undefined,
    seller_name: index % 4 !== 0 ? `Seller ${index + 1}` : undefined,
    payment_status: index % 4 !== 0 ? (index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'pending' : 'failed') : undefined,
    promotion_start: index % 4 !== 0 ? new Date().toISOString() : undefined,
    promotion_end: index % 4 !== 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    price_paid: index % 4 !== 0 ? (index % 4 === 1 ? 299.99 : 99.99) : undefined
  }));

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
    toast.success("Data refreshed");
  };

  const handleDeleteBanner = async (id: string, imagePath: string) => {
    try {
      let filename = imagePath;
      if (imagePath.includes('/')) {
        try {
          const url = new URL(imagePath);
          filename = url.pathname.split('/').pop() || imagePath;
        } catch (e) {
          filename = imagePath.split('/').pop() || imagePath;
        }
      }

      console.log(`Deleting banner ${id} with image: ${filename}`);

      await deleteHeroBanner(id);

      try {
        await supabase.storage
          .from('hero-banners')
          .remove([filename]);
        console.log(`Deleted file ${filename} from storage`);
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }

      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error("There was an error deleting the banner.");
    }
  };

  const handleMoveBanner = async (id: string, currentPosition: number, direction: 'up' | 'down') => {
    const sortedBanners = [...transformedBanners].sort((a, b) => (a.position || 0) - (b.position || 0));
    const currentIndex = sortedBanners.findIndex(banner => banner.id === id);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sortedBanners.length) return;
    
    const otherBanner = sortedBanners[newIndex];
    const otherPosition = otherBanner.position || 0;
    
    try {
      await Promise.all([
        updateHeroBannerPosition(id, otherPosition),
        updateHeroBannerPosition(otherBanner.id, currentPosition)
      ]);
      
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      toast.success("Banner position updated successfully");
    } catch (error) {
      console.error('Error updating banner position:', error);
      toast.error("There was an error updating the banner position.");
    }
  };

  const handleStatusChange = async (bannerId: string, newStatus: string) => {
    // This would be implemented with actual API calls
    toast.success(`Banner status updated to ${newStatus}`);
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(extension || '')) return 'video';
    if (['gif'].includes(extension || '')) return 'gif';
    return 'image';
  };

  const formatDuration = (duration: number) => {
    if (duration >= 1000) {
      return `${duration / 1000}s`;
    }
    return `${duration}ms`;
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'seller_premium': return 'bg-purple-100 text-purple-800';
      case 'seller_standard': return 'bg-green-100 text-green-800';
      case 'promotional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBannerTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Globe className="w-3 h-3" />;
      case 'seller_premium': return <Crown className="w-3 h-3" />;
      case 'seller_standard': return <User className="w-3 h-3" />;
      case 'promotional': return <DollarSign className="w-3 h-3" />;
      default: return <Building className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedBanners = transformedBanners
    .filter(banner => {
      const matchesSearch = banner.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           banner.image.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (banner.seller_name && banner.seller_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBannerType = bannerTypeFilter === 'all' || banner.banner_type === bannerTypeFilter;
      const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || banner.payment_status === paymentStatusFilter;
      return matchesSearch && matchesBannerType && matchesStatus && matchesPaymentStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return (a.position || 0) - (b.position || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.alt.localeCompare(b.alt);
        case 'seller':
          return (a.seller_name || '').localeCompare(b.seller_name || '');
        case 'price':
          return (b.price_paid || 0) - (a.price_paid || 0);
        default:
          return (a.position || 0) - (b.position || 0);
      }
    });

  const stats = {
    total: transformedBanners.length,
    system: transformedBanners.filter(b => b.banner_type === 'system').length,
    sellerPremium: transformedBanners.filter(b => b.banner_type === 'seller_premium').length,
    sellerStandard: transformedBanners.filter(b => b.banner_type === 'seller_standard').length,
    promotional: transformedBanners.filter(b => b.banner_type === 'promotional').length,
    pending: transformedBanners.filter(b => b.status === 'pending').length,
    active: transformedBanners.filter(b => b.status === 'active').length,
    revenue: transformedBanners.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.price_paid || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
            <p className="text-red-500">Error loading banners</p>
            <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Banner Management</h1>
              <p className="text-sm text-gray-600">{stats.total} total banners • ${stats.revenue.toFixed(2)} revenue</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                Refresh
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add Banner
              </Button>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.system} System</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.sellerPremium} Premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.sellerStandard} Standard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.promotional} Promo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.pending} Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.active} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-3 h-3 text-green-600" />
              <span className="text-sm text-gray-600">${stats.revenue.toFixed(0)}</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search banners, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filters
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-2 border-t">
                <Select value={bannerTypeFilter} onValueChange={setBannerTypeFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Banner Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="seller_premium">Seller Premium</SelectItem>
                    <SelectItem value="seller_standard">Seller Standard</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div className="p-4">
        {filteredAndSortedBanners.length === 0 ? (
          <div className="text-center py-8">
            <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No banners found</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsUploadDialogOpen(true)}
            >
              Add Your First Banner
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedBanners.map((banner, index) => (
              <Card key={banner.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Banner Preview */}
                    <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {getFileType(banner.image) === 'video' ? (
                        <video 
                          src={banner.image}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img 
                          src={banner.image}
                          alt={banner.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name and badges */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate text-sm">{banner.alt}</h3>
                        <div className="flex items-center space-x-1">
                          {getBannerTypeIcon(banner.banner_type || 'system')}
                          <Badge className={`${getBannerTypeColor(banner.banner_type || 'system')} text-xs px-1.5 py-0.5`}>
                            {banner.banner_type?.replace('_', ' ') || 'system'}
                          </Badge>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5">
                          Pos: {banner.position}
                        </Badge>
                      </div>

                      {/* Seller info and file info */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        {banner.seller_name && (
                          <>
                            <span className="truncate">by {banner.seller_name}</span>
                            <span>•</span>
                          </>
                        )}
                        <span className="truncate max-w-xs">{banner.image.split('/').pop()}</span>
                        <span className="hidden sm:block">•</span>
                        <span className="hidden sm:block">{formatDuration(banner.duration)}</span>
                      </div>

                      {/* Status and actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(banner.status || 'active')} text-xs px-2 py-0.5`}>
                            {banner.status || 'active'}
                          </Badge>
                          {banner.payment_status && (
                            <Badge className={`${getPaymentStatusColor(banner.payment_status)} text-xs px-2 py-0.5`}>
                              {banner.payment_status}
                            </Badge>
                          )}
                          {banner.price_paid && (
                            <span className="text-xs text-green-600 font-medium">${banner.price_paid}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'up')}
                            disabled={index === 0}
                            className="h-6 px-2 text-xs"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'down')}
                            disabled={index === filteredAndSortedBanners.length - 1}
                            className="h-6 px-2 text-xs"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Banner
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        {banner.status === 'pending' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleStatusChange(banner.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Banner
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleStatusChange(banner.id, 'rejected')}
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Reject Banner
                            </DropdownMenuItem>
                          </>
                        )}
                        {banner.payment_status === 'pending' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-green-600"
                              onClick={() => handleStatusChange(banner.id, 'payment_confirmed')}
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              Confirm Payment
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteBanner(banner.id, banner.image)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Banner
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <HeroBannerUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["hero-banners"] })}
      />
    </div>
  );
};

export default AdminBanners;

