
import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, MoreVertical, Image, 
  Plus, ArrowUp, ArrowDown, Trash2, 
  Eye, Edit, CheckCircle, X,
  AlertTriangle, DollarSign,
  User, Building, Globe, Crown, Filter
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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
    seller_name: index % 4 !== 0 ? `Store ${index + 1}` : undefined,
    payment_status: index % 4 !== 0 ? (index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'pending' : 'failed') : undefined,
    promotion_start: index % 4 !== 0 ? new Date().toISOString() : undefined,
    promotion_end: index % 4 !== 0 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    price_paid: index % 4 !== 0 ? (index % 4 === 1 ? 299.99 : 99.99) : undefined
  }));

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

      await deleteHeroBanner(id);

      try {
        await supabase.storage
          .from('hero-banners')
          .remove([filename]);
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }

      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error("Failed to delete banner");
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
      toast.success("Position updated");
    } catch (error) {
      console.error('Error updating banner position:', error);
      toast.error("Failed to update position");
    }
  };

  const handleStatusChange = async (bannerId: string, newStatus: string) => {
    toast.success(`Status updated to ${newStatus}`);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle };
      case 'pending': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle };
      case 'rejected': return { color: 'bg-red-50 text-red-700 border-red-200', icon: X };
      default: return { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertTriangle };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'system': return { color: 'bg-blue-50 text-blue-700', icon: Globe, label: 'System' };
      case 'seller_premium': return { color: 'bg-purple-50 text-purple-700', icon: Crown, label: 'Premium' };
      case 'seller_standard': return { color: 'bg-green-50 text-green-700', icon: User, label: 'Standard' };
      case 'promotional': return { color: 'bg-orange-50 text-orange-700', icon: DollarSign, label: 'Promo' };
      default: return { color: 'bg-gray-50 text-gray-700', icon: Building, label: 'Other' };
    }
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(extension || '')) return 'video';
    if (['gif'].includes(extension || '')) return 'gif';
    return 'image';
  };

  const filteredBanners = transformedBanners.filter(banner => {
    const matchesSearch = banner.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (banner.seller_name && banner.seller_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
    const matchesType = typeFilter === 'all' || banner.banner_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => (a.position || 0) - (b.position || 0));

  const stats = {
    total: transformedBanners.length,
    active: transformedBanners.filter(b => b.status === 'active').length,
    pending: transformedBanners.filter(b => b.status === 'pending').length,
    revenue: transformedBanners.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.price_paid || 0), 0)
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-700 mb-4">Failed to load banners</p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-200">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Banner Management</h1>
              <p className="text-gray-600 text-sm">
                {stats.total} banners • {stats.active} active • ${stats.revenue.toFixed(0)} revenue
              </p>
            </div>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-200 text-gray-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {showFilters && (
                <>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 border-gray-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 border-gray-200">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="seller_premium">Premium</SelectItem>
                      <SelectItem value="seller_standard">Standard</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Banner List */}
      <div className="p-6">
        {filteredBanners.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first banner</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBanners.map((banner, index) => {
              const statusInfo = getStatusInfo(banner.status || 'active');
              const typeInfo = getTypeInfo(banner.banner_type || 'system');
              const StatusIcon = statusInfo.icon;
              const TypeIcon = typeInfo.icon;

              return (
                <Card key={banner.id} className="border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Banner Preview */}
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200/50">
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
                        <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                          #{banner.position}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title and badges */}
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{banner.alt}</h3>
                          <Badge className={`${typeInfo.color} border text-xs px-2 py-1`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                          <Badge className={`${statusInfo.color} border text-xs px-2 py-1`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {banner.status}
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {banner.seller_name && (
                            <span>by {banner.seller_name}</span>
                          )}
                          {banner.price_paid && (
                            <span className="text-green-600 font-medium">${banner.price_paid}</span>
                          )}
                          <span>{banner.duration / 1000}s duration</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'up')}
                          disabled={index === 0}
                          className="w-8 h-8 p-0 border-gray-200"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'down')}
                          disabled={index === filteredBanners.length - 1}
                          className="w-8 h-8 p-0 border-gray-200"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 border-gray-200">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            
                            {banner.status === 'pending' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleStatusChange(banner.id, 'approved')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleStatusChange(banner.id, 'rejected')}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteBanner(banner.id, banner.image)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
