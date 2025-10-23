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
  duration?: number;
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
      case 'active': return { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle };
      case 'pending': return { color: 'bg-amber-100 text-amber-800', icon: AlertTriangle };
      case 'rejected': return { color: 'bg-red-100 text-red-800', icon: X };
      default: return { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'system': return { color: 'bg-blue-100 text-blue-800', icon: Globe, label: 'System' };
      case 'seller_premium': return { color: 'bg-purple-100 text-purple-800', icon: Crown, label: 'Premium' };
      case 'seller_standard': return { color: 'bg-green-100 text-green-800', icon: User, label: 'Standard' };
      case 'promotional': return { color: 'bg-orange-100 text-orange-800', icon: DollarSign, label: 'Promo' };
      default: return { color: 'bg-gray-100 text-gray-800', icon: Building, label: 'Other' };
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
      <div className="space-y-4 bg-gray-50 min-h-screen p-3">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 bg-gray-50 min-h-screen p-3">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-red-700 text-sm mb-3">Failed to load banners</p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="border-red-200 text-xs">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {/* Compact Header & Stats */}
      <div className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-foreground">Banner Management</h1>
              <p className="text-xs text-muted-foreground">Manage hero banners and promotions</p>
            </div>
            <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Banner
            </Button>
          </div>

          {/* Ultra compact stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">${stats.revenue.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
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
              placeholder="Search banners..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40 h-9">
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
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 gap-3">
          {filteredBanners.map((banner, index) => {
            const statusInfo = getStatusInfo(banner.status || 'active');
            const typeInfo = getTypeInfo(banner.banner_type || 'system');
            const StatusIcon = statusInfo.icon;
            const TypeIcon = typeInfo.icon;

            return (
              <Card key={banner.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Banner Preview */}
                      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 border">
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
                        <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 py-0 rounded">
                          #{banner.position}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{banner.alt}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={`${typeInfo.color} text-xs`}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                          <Badge variant="secondary" className={`${statusInfo.color} text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {banner.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          {banner.seller_name && (
                            <span>by {banner.seller_name}</span>
                          )}
                          {banner.price_paid && (
                            <span className="text-green-600 font-medium">${banner.price_paid}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveBanner(banner.id, banner.position || 0, 'down')}
                        disabled={index === filteredBanners.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{banner.duration / 1000}s duration</span>
                    <span>Updated: {new Date(banner.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredBanners.length === 0 && (
        <div className="p-8 text-center">
          <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No banners found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters.
          </p>
          <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>
      )}

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