import React, { useState, useEffect } from 'react';
import { Camera, Upload, Image, X, Check, Edit2, Trash2, Star, Plus, Palette, Video } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  name: string;
  type: 'color' | 'image' | 'gradient' | 'video';
  value: string;
  thumbnail?: string;
  is_primary: boolean;
  created_at: string;
}

interface BannerManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId?: string;
  onBannerUpdate?: () => void;
}

const BannerManagementPanel: React.FC<BannerManagementPanelProps> = ({
  isOpen,
  onClose,
  sellerId,
  onBannerUpdate
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'manage' | 'add'>('manage');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');

  // Fetch seller banners
  const fetchBanners = async () => {
    if (!sellerId) {
      console.log('No sellerId provided');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Fetching banners for seller:', sellerId);
      
      const { data, error } = await supabase
        .from('seller_banners')
        .select('*')
        .eq('seller_id', sellerId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched banners:', data);
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sellerId) {
      fetchBanners();
    }
  }, [isOpen, sellerId]);

  const handleSetPrimary = async (bannerId: string) => {
    if (!sellerId) return;

    try {
      // First, set all banners to not primary
      const { error: updateError } = await supabase
        .from('seller_banners')
        .update({ is_primary: false })
        .eq('seller_id', sellerId);

      if (updateError) throw updateError;

      // Then set the selected banner as primary
      const { error: setPrimaryError } = await supabase
        .from('seller_banners')
        .update({ is_primary: true })
        .eq('id', bannerId)
        .eq('seller_id', sellerId);

      if (setPrimaryError) throw setPrimaryError;

      await fetchBanners();
      onBannerUpdate?.();
      toast.success('Primary banner updated');
    } catch (error) {
      console.error('Error setting primary banner:', error);
      toast.error('Failed to update primary banner');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!sellerId) return;

    try {
      const { error } = await supabase
        .from('seller_banners')
        .delete()
        .eq('id', bannerId)
        .eq('seller_id', sellerId);

      if (error) throw error;

      await fetchBanners();
      onBannerUpdate?.();
      toast.success('Banner deleted');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleAddBanner = async (bannerData: Omit<Banner, 'id' | 'is_primary' | 'created_at'>) => {
    if (!sellerId) {
      toast.error('Seller ID not found');
      return;
    }

    try {
      console.log('Adding banner:', bannerData);
      
      const { error } = await supabase
        .from('seller_banners')
        .insert({
          seller_id: sellerId,
          name: bannerData.name,
          type: bannerData.type,
          value: bannerData.value,
          thumbnail: bannerData.thumbnail,
          is_primary: banners.length === 0 // Set as primary if first banner
        });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      await fetchBanners();
      onBannerUpdate?.();
      setSelectedTab('manage');
      toast.success('Banner added successfully');
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error('Failed to add banner');
    }
  };

  const handleUpdateBanner = async (bannerId: string, updates: Partial<Banner>) => {
    if (!sellerId) return;

    try {
      const { error } = await supabase
        .from('seller_banners')
        .update(updates)
        .eq('id', bannerId)
        .eq('seller_id', sellerId);

      if (error) throw error;

      await fetchBanners();
      onBannerUpdate?.();
      setEditingBanner(null);
      toast.success('Banner updated successfully');
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Failed to update banner');
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
  try {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    
    // Use the authenticated user's ID as the folder name to match RLS policy
    const { data: { user } } = await supabase.auth.getUser();
    const userFolder = user?.id;
    
    if (!userFolder) {
      throw new Error('User not authenticated');
    }
    
    const fileName = `${userFolder}/${Date.now()}.${fileExt}`;

    console.log('Uploading file to bucket:', bucket, 'with name:', fileName);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sellerId) return;

    // Validate file type based on upload type
    if (uploadType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size
    const maxSize = uploadType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024; // 5MB for images, 20MB for videos
    if (file.size > maxSize) {
      toast.error(`File size should be less than ${uploadType === 'image' ? '5MB' : '20MB'}`);
      return;
    }

    setIsUploading(true);

    try {
      const bucket = uploadType === 'image' ? 'seller-banners' : 'seller-banner-videos';
      const publicUrl = await uploadFile(file, bucket);

      // Generate thumbnail for videos
      let thumbnailUrl = publicUrl;
      if (uploadType === 'video') {
        // For videos, we'll use a placeholder thumbnail or you can generate one
        // For now, we'll use a video icon placeholder
        thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA1MEw2NSA2MEw2NSA0MEw4MCA1MFoiIGZpbGw9IiM2QzY4N0QiLz4KPC9zdmc+';
      }

      // Add to database
      await handleAddBanner({
        name: file.name.split('.')[0] || `Custom ${uploadType === 'image' ? 'Image' : 'Video'}`,
        type: uploadType,
        value: publicUrl,
        thumbnail: thumbnailUrl
      });

      toast.success(`${uploadType === 'image' ? 'Image' : 'Video'} banner uploaded successfully`);

    } catch (error) {
      toast.error(`Failed to upload ${uploadType}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const BannerThumbnail = ({ banner }: { banner: Banner }) => (
    <div className={`w-full h-20 rounded-lg border-2 ${
      banner.is_primary ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    } overflow-hidden relative group`}>
      {banner.type === 'image' ? (
        <img
          src={banner.thumbnail || banner.value}
          alt={banner.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Error loading banner image:', banner.value);
            // Fallback to placeholder
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEg2NVY2MEg3NVY0MFoiIGZpbGw9IiM5Q0EwQUIiLz4KPHBhdGggZD0iTTgwIDUwTDY1IDYwVjQwTDgwIDUwWiIgZmlsbD0iIzlDQTBBQiIvPgo8L3N2Zz4=';
          }}
        />
      ) : banner.type === 'video' ? (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
          <video className="w-full h-full object-cover" muted>
            <source src={banner.value} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
        </div>
      ) : (
        <div className={`w-full h-full ${banner.value}`} />
      )}
      
      {banner.is_primary && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
          <Star className="w-3 h-3 fill-current" />
        </div>
      )}
      
      {banner.type === 'video' && (
        <div className="absolute top-1 left-1 bg-purple-500 text-white rounded-full px-2 py-1 text-xs font-medium">
          Video
        </div>
      )}
    </div>
  );

  const EditBannerForm = ({ banner }: { banner: Banner }) => {
    const [name, setName] = useState(banner.name);

    const handleSave = () => {
      if (name.trim()) {
        handleUpdateBanner(banner.id, { name: name.trim() });
      } else {
        toast.error('Please enter a banner name');
      }
    };

    return (
      <div className="space-y-3">
        <BannerThumbnail banner={banner} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter banner name"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setEditingBanner(null)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Banners"
      showCloseButton={true}
      preventBodyScroll={true}
      className="p-4"
      stickyFooter={null}
    >
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('manage')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Banners
          </button>
          <button
            onClick={() => setSelectedTab('add')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'add'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Add New
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto">
          {selectedTab === 'manage' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No banners yet</p>
                  <button
                    onClick={() => setSelectedTab('add')}
                    className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Add your first banner
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 space-y-3"
                    >
                      {editingBanner?.id === banner.id ? (
                        <EditBannerForm banner={banner} />
                      ) : (
                        <>
                          <BannerThumbnail banner={banner} />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">{banner.name}</h4>
                              <p className="text-xs text-gray-500 capitalize">{banner.type}</p>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {!banner.is_primary && (
                                <button
                                  onClick={() => handleSetPrimary(banner.id)}
                                  className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                                  title="Set as primary"
                                >
                                  <Star className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => setEditingBanner(banner)}
                                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Edit banner"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              
                              {!banner.is_primary && (
                                <button
                                  onClick={() => handleDeleteBanner(banner.id)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete banner"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {banner.is_primary && (
                            <div className="bg-blue-50 text-blue-700 text-xs font-medium py-1 px-2 rounded inline-flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Primary Banner
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'add' && (
            <div className="space-y-4">
              {/* Upload Type Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Upload Type</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUploadType('image')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      uploadType === 'image'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Image className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">Image</span>
                  </button>
                  <button
                    onClick={() => setUploadType('video')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                      uploadType === 'video'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-medium">Video</span>
                  </button>
                </div>
              </div>

              {/* Custom Upload */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Upload Custom {uploadType === 'image' ? 'Image' : 'Video'}
                </h4>
                
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                    {isUploading ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm font-medium text-gray-700">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        {uploadType === 'image' ? (
                          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        ) : (
                          <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        )}
                        <p className="text-sm font-medium text-gray-700">
                          Upload Custom {uploadType === 'image' ? 'Image' : 'Video'} Banner
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {uploadType === 'image' 
                            ? 'Recommended: 1200×400px, max 5MB (JPG, PNG, WebP)'
                            : 'Recommended: MP4, WebM, max 20MB'
                          }
                        </p>
                        <input
                          type="file"
                          accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideUpPanel>
  );
};

export default BannerManagementPanel;