import React, { useState, useEffect } from 'react';
import { Camera, Upload, Image, X, Check, Edit2, Trash2, Star, Plus, Palette, Video, GripVertical } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Banner {
  id: string;
  name: string;
  type: 'color' | 'image' | 'gradient' | 'video';
  value: string;
  thumbnail?: string;
  is_primary: boolean;
  created_at: string;
  sort_order?: number;
}

interface BannerManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId?: string;
  onBannerUpdate?: () => void;
}

// Sortable Banner Item Component
const SortableBannerItem = ({ banner, onSetPrimary, onEdit, onDelete, isEditing }: {
  banner: Banner;
  onSetPrimary: (id: string) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const BannerThumbnail = ({ banner, size = "small" }: { banner: Banner, size?: "small" | "medium" }) => {
    const dimensions = size === "small" ? "w-16 h-12" : "w-20 h-14";
    
    return (
      <div className={`${dimensions} rounded-lg border border-gray-200 overflow-hidden flex-shrink-0`}>
        {banner.type === 'image' ? (
          <img
            src={banner.thumbnail || banner.value}
            alt={banner.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA0MEg2NVY2MEg3NVY0MFoiIGZpbGw9IiM5Q0EwQUIiLz4KPHBhdGggZD0iTTgwIDUwTDY1IDYwVjQwTDgwIDUwWiIgZmlsbD0iIzlDQTBBQiIvPgo8L3N2Zz4=';
            }}
          />
        ) : banner.type === 'video' ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <Video className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        ) : (
          <div className={`w-full h-full ${banner.value}`} />
        )}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative group"
    >
      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <BannerThumbnail banner={banner} size="small" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900 truncate">{banner.name}</h4>
          {banner.is_primary && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              Primary
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="capitalize">{banner.type}</span>
          <span>•</span>
          <span>{new Date(banner.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!banner.is_primary && (
          <button
            onClick={() => onSetPrimary(banner.id)}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            title="Set as primary"
            disabled={isEditing}
          >
            <Star className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={() => onEdit(banner)}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          title="Edit banner"
          disabled={isEditing}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        
        {!banner.is_primary && (
          <button
            onClick={() => onDelete(banner.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete banner"
            disabled={isEditing}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const BannerManagementPanel: React.FC<BannerManagementPanelProps> = ({
  isOpen,
  onClose,
  sellerId,
  onBannerUpdate
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [isReordering, setIsReordering] = useState(false);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        .order('sort_order', { ascending: true })
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setIsReordering(true);

    try {
      const oldIndex = banners.findIndex((banner) => banner.id === active.id);
      const newIndex = banners.findIndex((banner) => banner.id === over.id);

      const reorderedBanners = arrayMove(banners, oldIndex, newIndex);
      setBanners(reorderedBanners);

      // Update sort_order in database
      const updates = reorderedBanners.map((banner, index) => ({
        id: banner.id,
        sort_order: index
      }));

      const { error } = await supabase
        .from('seller_banners')
        .upsert(updates);

      if (error) throw error;

      toast.success('Banner order updated');
    } catch (error) {
      console.error('Error reordering banners:', error);
      toast.error('Failed to update banner order');
      // Revert on error
      await fetchBanners();
    } finally {
      setIsReordering(false);
    }
  };

  const handleAddBanner = async (bannerData: Omit<Banner, 'id' | 'is_primary' | 'created_at'>) => {
    if (!sellerId) {
      toast.error('Seller ID not found');
      return;
    }

    try {
      console.log('Adding banner with seller ID:', sellerId);

      const { error } = await supabase
        .from('seller_banners')
        .insert({
          seller_id: sellerId,
          name: bannerData.name,
          type: bannerData.type,
          value: bannerData.value,
          thumbnail: bannerData.thumbnail,
          is_primary: banners.length === 0,
          sort_order: banners.length
        });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      await fetchBanners();
      onBannerUpdate?.();
      setShowMediaPicker(false);
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
      const fileExt = file.name.split('.').pop();
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

    if (uploadType === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (uploadType === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    const maxSize = uploadType === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size should be less than ${uploadType === 'image' ? '5MB' : '20MB'}`);
      return;
    }

    setIsUploading(true);

    try {
      const bucket = uploadType === 'image' ? 'seller-banners' : 'seller-banner-videos';
      const publicUrl = await uploadFile(file, bucket);

      let thumbnailUrl = publicUrl;
      if (uploadType === 'video') {
        thumbnailUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA1MEw2NSA2MEw2NSA0MEw4MCA1MFoiIGZpbGw9IiM2QzY4N0QiLz4KPC9zdmc+';
      }

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
      event.target.value = '';
    }
  };

  const AddNewBannerItem = () => (
    <button
      onClick={() => setShowMediaPicker(true)}
      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className="w-16 h-12 rounded-lg border-2 border-dashed border-gray-300 group-hover:border-blue-400 flex items-center justify-center transition-colors">
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
      </div>
      
      <div className="text-left">
        <h4 className="font-medium text-gray-900 group-hover:text-blue-700">Add New Banner</h4>
        <p className="text-sm text-gray-500 group-hover:text-blue-600">Upload image, video, or choose color</p>
      </div>
    </button>
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
      <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
            {banner.type === 'image' ? (
              <img
                src={banner.thumbnail || banner.value}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
            ) : banner.type === 'video' ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Video className="w-4 h-4 text-gray-600" />
              </div>
            ) : (
              <div className={`w-full h-full ${banner.value}`} />
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter banner name"
              autoFocus
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
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

  const MediaPicker = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowMediaPicker(false)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold">Add New Banner</h3>
      </div>

      {/* Media Type Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUploadType('image')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
            uploadType === 'image'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Image className="w-4 h-4" />
          Image
        </button>
        <button
          onClick={() => setUploadType('video')}
          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
            uploadType === 'video'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Video className="w-4 h-4" />
          Video
        </button>
      </div>

      {/* Quick Colors & Gradients */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Colors & Gradients
        </h4>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { name: 'Blue', value: 'bg-blue-500', type: 'color' as const },
            { name: 'Purple', value: 'bg-purple-500', type: 'color' as const },
            { name: 'Pink', value: 'bg-pink-500', type: 'color' as const },
            { name: 'Green', value: 'bg-green-500', type: 'color' as const },
            { name: 'Orange', value: 'bg-orange-500', type: 'color' as const },
            { name: 'Indigo', value: 'bg-indigo-500', type: 'color' as const },
            { name: 'Blue Gradient', value: 'bg-gradient-to-r from-blue-500 to-purple-600', type: 'gradient' as const },
            { name: 'Sunset Gradient', value: 'bg-gradient-to-r from-orange-400 to-pink-500', type: 'gradient' as const },
          ].map((option, index) => (
            <button
              key={index}
              onClick={() => handleAddBanner({
                name: option.name,
                type: option.type,
                value: option.value,
                thumbnail: option.value
              })}
              className="text-left"
            >
              <div className="w-full h-16 rounded-lg border border-gray-200 overflow-hidden">
                <div className={`w-full h-full ${option.value}`} />
              </div>
              <p className="text-xs font-medium text-gray-700 mt-1 text-center truncate">
                {option.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload {uploadType === 'image' ? 'Image' : 'Video'}
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
  );

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      title={showMediaPicker ? "Add New Banner" : "Manage Banners"}
      showCloseButton={true}
      preventBodyScroll={true}
      className="p-4"
      stickyFooter={null}
    >
      <div className="space-y-4">
        {showMediaPicker ? (
          <MediaPicker />
        ) : (
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-8">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-2">No banners yet</p>
                <AddNewBannerItem />
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 text-center">
                    💡 Drag and drop banners to reorder them
                  </p>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={banners.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {banners.map((banner) => (
                        editingBanner?.id === banner.id ? (
                          <EditBannerForm key={banner.id} banner={banner} />
                        ) : (
                          <SortableBannerItem
                            key={banner.id}
                            banner={banner}
                            onSetPrimary={handleSetPrimary}
                            onEdit={setEditingBanner}
                            onDelete={handleDeleteBanner}
                            isEditing={!!editingBanner}
                          />
                        )
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                
                {isReordering && (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-gray-500 ml-2">Updating order...</span>
                  </div>
                )}
                
                {/* Add New Banner as last item */}
                <AddNewBannerItem />
              </>
            )}
          </div>
        )}
      </div>
    </SlideUpPanel>
  );
};

export default BannerManagementPanel;