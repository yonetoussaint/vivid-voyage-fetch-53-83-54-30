
import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Search, Filter, MoreVertical, Image, 
  Plus, ArrowUp, ArrowDown, Trash2, 
  Eye, Edit, Calendar, Clock, CheckCircle,
  AlertTriangle, ChevronDown
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
}

const AdminBanners = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
    toast.success("Data refreshed");
  };

  const handleDeleteBanner = async (id: string, imagePath: string) => {
    try {
      // Extract just the filename if it's a full URL
      let filename = imagePath;
      if (imagePath.includes('/')) {
        try {
          const url = new URL(imagePath);
          filename = url.pathname.split('/').pop() || imagePath;
        } catch (e) {
          // If not a valid URL, try to extract the filename from the path
          filename = imagePath.split('/').pop() || imagePath;
        }
      }

      console.log(`Deleting banner ${id} with image: ${filename}`);

      // Delete from database
      await deleteHeroBanner(id);

      try {
        // Try to delete from storage
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
    const sortedBanners = [...banners].sort((a, b) => (a.position || 0) - (b.position || 0));
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

  const filteredAndSortedBanners = banners
    .filter(banner => 
      banner.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.image.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'position':
          return (a.position || 0) - (b.position || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.alt.localeCompare(b.alt);
        default:
          return (a.position || 0) - (b.position || 0);
      }
    });

  const stats = {
    total: banners.length,
    images: banners.filter(b => getFileType(b.image) === 'image').length,
    videos: banners.filter(b => getFileType(b.image) === 'video').length,
    gifs: banners.filter(b => getFileType(b.image) === 'gif').length
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
              <p className="text-sm text-gray-600">{stats.total} total banners</p>
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

          {/* Compact Stats */}
          <div className="flex space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.images} Images</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.videos} Videos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{stats.gifs} GIFs</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search banners..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
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
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          {getFileType(banner.image)}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5">
                          Pos: {banner.position}
                        </Badge>
                      </div>

                      {/* URL and info */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <span className="truncate max-w-xs">{banner.image.split('/').pop()}</span>
                        <span className="hidden sm:block">•</span>
                        <span className="hidden sm:block">{formatDuration(banner.duration)}</span>
                      </div>

                      {/* Actions and date */}
                      <div className="flex items-center justify-between">
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

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(banner.created_at).toLocaleDateString()}</span>
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
