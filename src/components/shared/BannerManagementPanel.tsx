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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 relative group"
    >
      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute left-2 top-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 z-10"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="pl-6">
        <BannerThumbnail banner={banner} />
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <h4 className="font-medium text-gray-800">{banner.name}</h4>
            <p className="text-xs text-gray-500 capitalize">{banner.type}</p>
          </div>
          
          <div className="flex items-center gap-1">
            {!banner.is_primary && (
              <button
                onClick={() => onSetPrimary(banner.id)}
                className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                title="Set as primary"
                disabled={isEditing}
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => onEdit(banner)}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit banner"
              disabled={isEditing}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            {!banner.is_primary && (
              <button
                onClick={() => onDelete(banner.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete banner"
                disabled={isEditing}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {banner.is_primary && (
          <div className="bg-blue-50 text-blue-700 text-xs font-medium py-1 px-2 rounded inline-flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 fill-current" />
            Primary Banner
          </div>
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
  const [selectedTab, setSelectedTab] = useState<'manage' | 'add'>('manage');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
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

  // ... rest of your existing functions (handleAddBanner, handleUpdateBanner, uploadFile, handleFileUpload) remain the same

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
        <div className="w-full h-20 rounded-lg border-2 border-gray-200 overflow-hidden">
          {banner.type === 'image' ? (
            <img
              src={banner.thumbnail || banner.value}
              alt={banner.name}
              className="w-full h-full object-cover"
            />
          ) : banner.type === 'video' ? (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
          ) : (
            <div className={`w-full h-full ${banner.value}`} />
          )}
        </div>
        
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
                            <div key={banner.id} className="bg-white border border-gray-200 rounded-lg p-3">
                              <EditBannerForm banner={banner} />
                            </div>
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
                </>
              )}
            </div>
          )}

          {selectedTab === 'add' && (
            <div className="space-y-4">
              {/* Quick Add Options - keep your existing code here */}
              {/* ... */}
            </div>
          )}
        </div>
      </div>
    </SlideUpPanel>
  );
};

export default BannerManagementPanel;