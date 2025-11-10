import React, { useState } from 'react';
import { Camera, Upload, Image, X, Check, Palette, GripVertical } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { toast } from 'sonner';

interface BannerOption {
  id: string;
  type: 'color' | 'image' | 'gradient';
  value: string;
  label: string;
  thumbnail?: string;
}

interface BannerManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onBannerSelect: (banner: BannerOption) => void;
  currentBanner?: string;
}

const BannerManagementPanel: React.FC<BannerManagementPanelProps> = ({
  isOpen,
  onClose,
  onBannerSelect,
  currentBanner
}) => {
  const [selectedTab, setSelectedTab] = useState<'colors' | 'images' | 'upload'>('colors');
  const [isUploading, setIsUploading] = useState(false);

  // Predefined banner options
  const colorBanners: BannerOption[] = [
    { id: 'blue', type: 'color', value: 'bg-blue-500', label: 'Blue', thumbnail: 'bg-blue-500' },
    { id: 'purple', type: 'color', value: 'bg-purple-500', label: 'Purple', thumbnail: 'bg-purple-500' },
    { id: 'pink', type: 'color', value: 'bg-pink-500', label: 'Pink', thumbnail: 'bg-pink-500' },
    { id: 'green', type: 'color', value: 'bg-green-500', label: 'Green', thumbnail: 'bg-green-500' },
    { id: 'orange', type: 'color', value: 'bg-orange-500', label: 'Orange', thumbnail: 'bg-orange-500' },
    { id: 'indigo', type: 'color', value: 'bg-indigo-500', label: 'Indigo', thumbnail: 'bg-indigo-500' },
  ];

  const gradientBanners: BannerOption[] = [
    { 
      id: 'blue-purple', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-blue-500 to-purple-600', 
      label: 'Blue to Purple',
      thumbnail: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    { 
      id: 'pink-orange', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-pink-500 to-orange-400', 
      label: 'Pink to Orange',
      thumbnail: 'bg-gradient-to-r from-pink-500 to-orange-400'
    },
    { 
      id: 'green-teal', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-green-500 to-teal-600', 
      label: 'Green to Teal',
      thumbnail: 'bg-gradient-to-r from-green-500 to-teal-600'
    },
    { 
      id: 'purple-pink', 
      type: 'gradient', 
      value: 'bg-gradient-to-r from-purple-600 to-pink-500', 
      label: 'Purple to Pink',
      thumbnail: 'bg-gradient-to-r from-purple-600 to-pink-500'
    },
  ];

  const predefinedImages: BannerOption[] = [
    {
      id: 'abstract-1',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&h=400&fit=crop',
      label: 'Abstract Waves',
      thumbnail: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200&h=100&fit=crop'
    },
    {
      id: 'abstract-2',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop',
      label: 'Color Splash',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=100&fit=crop'
    },
    {
      id: 'geometric-1',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=400&fit=crop',
      label: 'Geometric',
      thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&h=100&fit=crop'
    },
    {
      id: 'gradient-1',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop',
      label: 'Soft Gradient',
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=100&fit=crop'
    },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a temporary URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      
      const customBanner: BannerOption = {
        id: `custom-${Date.now()}`,
        type: 'image',
        value: objectUrl,
        label: 'Custom Upload',
        thumbnail: objectUrl
      };

      onBannerSelect(customBanner);
      toast.success('Banner uploaded successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to upload banner');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerSelect = (banner: BannerOption) => {
    onBannerSelect(banner);
    toast.success('Banner updated successfully');
    onClose();
  };

  const isBannerSelected = (banner: BannerOption) => {
    return currentBanner === banner.value;
  };

  const BannerThumbnail = ({ banner }: { banner: BannerOption }) => (
    <div className="relative group">
      <div
        className={`w-full h-20 rounded-lg ${banner.thumbnail || banner.value} border-2 ${
          isBannerSelected(banner) 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-gray-200 group-hover:border-gray-300'
        } transition-all duration-200 overflow-hidden`}
      >
        {banner.type === 'image' && (
          <img
            src={banner.thumbnail || banner.value}
            alt={banner.label}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {isBannerSelected(banner) && (
        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      <div className="mt-2">
        <p className="text-xs font-medium text-gray-700 text-center truncate">
          {banner.label}
        </p>
      </div>
    </div>
  );

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Banner"
      showCloseButton={true}
      preventBodyScroll={true}
      className="p-4"
      stickyFooter={
        <div className="p-2">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('colors')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'colors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-4 h-4 mx-auto mb-1" />
            Colors
          </button>
          <button
            onClick={() => setSelectedTab('images')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'images'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image className="w-4 h-4 mx-auto mb-1" />
            Images
          </button>
          <button
            onClick={() => setSelectedTab('upload')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 mx-auto mb-1" />
            Upload
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-96 overflow-y-auto">
          {selectedTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Solid Colors</h4>
                <div className="grid grid-cols-3 gap-3">
                  {colorBanners.map(banner => (
                    <button
                      key={banner.id}
                      onClick={() => handleBannerSelect(banner)}
                      className="text-left"
                    >
                      <BannerThumbnail banner={banner} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Gradients</h4>
                <div className="grid grid-cols-2 gap-3">
                  {gradientBanners.map(banner => (
                    <button
                      key={banner.id}
                      onClick={() => handleBannerSelect(banner)}
                      className="text-left"
                    >
                      <BannerThumbnail banner={banner} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'images' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Predefined Images</h4>
              <div className="grid grid-cols-2 gap-3">
                {predefinedImages.map(banner => (
                  <button
                    key={banner.id}
                    onClick={() => handleBannerSelect(banner)}
                    className="text-left"
                  >
                    <BannerThumbnail banner={banner} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'upload' && (
            <div className="space-y-4">
              <div className="text-center">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
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
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="text-sm font-medium text-blue-800 mb-2">Tips for best results:</h5>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use high-quality images for best appearance</li>
                  <li>• Recommended size: 1200×400 pixels</li>
                  <li>• File formats: JPG, PNG, WebP</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Avoid text-heavy images as they may get cropped</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideUpPanel>
  );
};

export default BannerManagementPanel;