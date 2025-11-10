import React, { useState, useEffect } from 'react';
import { Camera, Upload, Image, X, Check, Edit2, Trash2, Star, Plus, Palette } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Banner {
  id: string;
  name: string;
  type: 'color' | 'image' | 'gradient';
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

  // Predefined banner options for quick add
  const quickAddOptions: Omit<Banner, 'id' | 'is_primary' | 'created_at'>[] = [
    { name: 'Blue', type: 'color', value: 'bg-blue-500', thumbnail: 'bg-blue-500' },
    { name: 'Purple', type: 'color', value: 'bg-purple-500', thumbnail: 'bg-purple-500' },
    { name: 'Pink', type: 'color', value: 'bg-pink-500', thumbnail: 'bg-pink-500' },
    { name: 'Green', type: 'color', value: 'bg-green-500', thumbnail: 'bg-green-500' },
    { 
      name: 'Blue Gradient', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-blue-500 to-purple-600', 
      thumbnail: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    { 
      name: 'Sunset Gradient', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-orange-400 to-pink-500', 
      thumbnail: 'bg-gradient-to-r from-orange-400 to-pink-500'
    },
  ];

  // Fetch seller banners
  const fetchBanners = async () => {
    if (!sellerId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('seller_banners')
        .select('*')
        .eq('seller_id', sellerId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
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
    if (!sellerId) return;

    try {
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

      if (error) throw error;

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sellerId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${sellerId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('seller-banners')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('seller-banners')
        .getPublicUrl(fileName);

      // Add to database
      await handleAddBanner({
        name: 'Custom Banner',
        type: 'image',
        value: publicUrl,
        thumbnail: publicUrl
      });

    } catch (error) {
      toast.error('Failed to upload banner');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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
        />
      ) : (
        <div className={`w-full h-full ${banner.value}`} />
      )}
      
      {banner.is_primary && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
          <Star className="w-3 h-3 fill-current" />
        </div>
      )}
    </div>
  );

  const EditBannerForm = ({ banner }: { banner: Banner }) => {
    const [name, setName] = useState(banner.name);

    const handleSave = () => {
      if (name.trim()) {
        handleUpdateBanner(banner.id, { name: name.trim() });
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
              {/* Quick Add Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Quick Add Colors & Gradients
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {quickAddOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddBanner(option)}
                      className="text-left"
                    >
                      <div className="w-full h-16 rounded-lg border border-gray-200 overflow-hidden">
                        {option.type === 'image' ? (
                          <img
                            src={option.thumbnail}
                            alt={option.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full ${option.thumbnail || option.value}`} />
                        )}
                      </div>
                      <p className="text-xs font-medium text-gray-700 mt-1 text-center truncate">
                        {option.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Upload */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Custom Image
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
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">Upload Custom Banner</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1200×400px, max 5MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </label>

                <div className="bg-blue-50 rounded-lg p-3 mt-3">
                  <h5 className="text-sm font-medium text-blue-800 mb-1">Tips for best results:</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use high-quality images for best appearance</li>
                    <li>• Recommended size: 1200×400 pixels</li>
                    <li>• File formats: JPG, PNG, WebP</li>
                    <li>• Maximum file size: 5MB</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideUpPanel>
  );
};

export default BannerManagementPanel;