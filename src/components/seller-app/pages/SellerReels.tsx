import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Edit, Pause, Volume2, VolumeX, Heart, MessageCircle, 
  Share, MoreHorizontal, Plus, Music, Eye, TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';

interface Reel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  createdAt: string;
  products: string[];
  performance: number;
}

const SellerReels = () => {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState<{ [key: string]: boolean }>({});
  const [displayCount, setDisplayCount] = useState(8);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Add filter state matching BookGenreFlashDeals
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Define filter categories matching BookGenreFlashDeals structure
  const filterCategories = [
    {
      id: 'status',
      label: 'Status',
      options: ['All', 'Published', 'Draft', 'Scheduled']
    },
    {
      id: 'performance',
      label: 'Performance',
      options: ['All', 'High', 'Medium', 'Low']
    },
    {
      id: 'duration',
      label: 'Duration',
      options: ['All', 'Under 15s', '15-30s', '30-60s', 'Over 60s']
    },
    {
      id: 'date',
      label: 'Date',
      options: ['All', 'Today', 'This Week', 'This Month', 'Last 30 Days']
    }
  ];

  // Filter handler functions matching BookGenreFlashDeals
  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  const reels: Reel[] = [
    {
      id: '1',
      title: 'Summer Collection Preview',
      description: 'Check out our new summer arrivals with exclusive discounts',
      thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      views: 12500,
      likes: 890,
      comments: 45,
      shares: 120,
      duration: '0:30',
      status: 'Published',
      createdAt: '2024-01-20',
      products: ['Summer Dress', 'Sunglasses', 'Beach Bag'],
      performance: 85
    },
    {
      id: '2',
      title: 'Wireless Earbuds Unboxing',
      description: 'See the amazing sound quality of our new wireless earbuds',
      thumbnail: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      views: 8900,
      likes: 567,
      comments: 23,
      shares: 78,
      duration: '0:45',
      status: 'Published',
      createdAt: '2024-01-19',
      products: ['Wireless Earbuds Pro', 'Charging Case'],
      performance: 72
    },
    {
      id: '3',
      title: 'Smart Home Setup Guide',
      description: 'Learn how to set up your smart home in under 60 seconds',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25856cd25?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      duration: '0:55',
      status: 'Draft',
      createdAt: '2024-01-18',
      products: ['Smart Speaker', 'Smart Bulbs', 'Smart Plug'],
      performance: 0
    },
    {
      id: '4',
      title: 'Weekend Flash Sale',
      description: 'Don\'t miss our weekend flash sale with up to 50% off',
      thumbnail: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      views: 15600,
      likes: 1200,
      comments: 89,
      shares: 234,
      duration: '0:25',
      status: 'Published',
      createdAt: '2024-01-17',
      products: ['All Products'],
      performance: 92
    },
    {
      id: '5',
      title: 'Customer Review Highlights',
      description: 'See what our customers are saying about our products',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      duration: '1:10',
      status: 'Scheduled',
      createdAt: '2024-01-25',
      products: ['Various Products'],
      performance: 0
    }
  ];

  const stats = [
    {
      value: '12.5K',
      label: 'Total Views',
      color: 'text-blue-600'
    },
    {
      value: '2.6K',
      label: 'Engagements',
      color: 'text-green-600'
    },
    {
      value: '156',
      label: 'Comments',
      color: 'text-purple-600'
    },
    {
      value: '432',
      label: 'Shares',
      color: 'text-orange-600'
    }
  ];

  const getStatusColor = (status: Reel['status']) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 80) return 'text-green-600';
    if (performance >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const togglePlay = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (video) {
      if (isPlaying[reelId]) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(prev => ({ ...prev, [reelId]: !prev[reelId] }));
    }
  };

  const toggleMute = (reelId: string) => {
    const video = videoRefs.current[reelId];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(prev => ({ ...prev, [reelId]: !prev[reelId] }));
    }
  };

  const handleVideoEnd = (reelId: string) => {
    setIsPlaying(prev => ({ ...prev, [reelId]: false }));
  };

  // Infinite scroll logic matching BookGenreFlashDeals
  useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= reels.length) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, reels.length));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, reels.length]);

  // Reset display count when reels change
  useEffect(() => {
    setDisplayCount(8);
  }, [reels.length]);

  return (
    <div className="w-full bg-white">
      {/* Header & Stats Section - Same structure as BookGenreFlashDeals */}
      <SellerSummaryHeader
        title="Reels"
        subtitle="Create and manage video content"
        stats={stats}
        actionButton={{
          label: 'Create Reel',
          icon: Plus,
          onClick: () => console.log('Create reel clicked')
        }}
        showStats={reels.length > 0}
      />

      {/* Filter Bar Section - Same as BookGenreFlashDeals */}
      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

      {/* Reels Grid */}
      <div className="py-4">
        {reels.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reels.slice(0, displayCount).map((reel) => (
                <Card key={reel.id} className="overflow-hidden border border-gray-200">
                  <CardContent className="p-0">
                    {/* Video Player Section */}
                    <div 
                      className="relative aspect-[9/16] bg-black cursor-pointer group"
                      onMouseEnter={() => setActiveReel(reel.id)}
                      onMouseLeave={() => setActiveReel(null)}
                    >
                      <video
                        ref={el => videoRefs.current[reel.id] = el}
                        src={reel.videoUrl}
                        poster={reel.thumbnail}
                        className="w-full h-full object-cover"
                        muted={isMuted[reel.id]}
                        onEnded={() => handleVideoEnd(reel.id)}
                        loop
                      />

                      {/* Video Controls Overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        activeReel === reel.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                          onClick={() => togglePlay(reel.id)}
                        >
                          {isPlaying[reel.id] ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                      </div>

                      {/* Top Info Bar */}
                      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={getStatusColor(reel.status)}>
                            {reel.status}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20"
                              onClick={() => toggleMute(reel.id)}
                            >
                              {isMuted[reel.id] ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Reel
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share className="w-4 h-4 mr-2" />
                                  Share
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex items-center justify-between text-white text-xs">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{reel.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{reel.comments.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share className="h-3 w-3" />
                              <span>{reel.shares.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            <span>{reel.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reel Info Section */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                          {reel.title}
                        </h3>
                        <div className={`text-xs font-medium ${getPerformanceColor(reel.performance)}`}>
                          {reel.performance}%
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {reel.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{reel.views.toLocaleString()} views</span>
                        </div>
                        <span>{reel.createdAt}</span>
                      </div>

                      {/* Products Tags */}
                      <div className="flex flex-wrap gap-1">
                        {reel.products.map((product, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>

                      {/* Performance Progress */}
                      {reel.performance > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Performance</span>
                            <span>{reel.performance}%</span>
                          </div>
                          <Progress value={reel.performance} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium">No reels found</div>
            <div className="text-sm mt-1">Create your first reel to engage with customers</div>
            <Button size="sm" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Reel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerReels;