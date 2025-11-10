import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroBanner from '@/components/home/HeroBanner';
import BannerManagementPanel from '@/components/shared/BannerManagementPanel';

const SellerEditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    business_type: '',
    location: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBannerPanelOpen, setIsBannerPanelOpen] = useState(false);

  // Fetch current seller data
  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Initialize form with current data
  useEffect(() => {
    if (sellerData) {
      setFormData({
        name: sellerData.name || '',
        bio: sellerData.bio || '',
        business_type: sellerData.business_type || '',
        location: sellerData.location || '',
        website: sellerData.website || '',
      });
    }
  }, [sellerData]);

  // Listen for save event from header
  useEffect(() => {
    const handleSave = () => {
      handleSubmit();
    };

    window.addEventListener('saveEditProfile', handleSave);
    return () => {
      window.removeEventListener('saveEditProfile', handleSave);
    };
  }, [formData, profileImage]);

  // Update mutation
  const updateSellerMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      if (!user?.id) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('sellers')
        .update(updatedData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['seller-banners', sellerData?.id] });
      navigate('/seller-dashboard/products');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      setIsLoading(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      console.log('Profile image selected:', file.name);
      // TODO: Implement actual upload
    }
  };

  const handleBannerUpdate = () => {
    // Refresh any banner-related data
    queryClient.invalidateQueries({ queryKey: ['seller-banners', sellerData?.id] });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      let image_url = sellerData?.image_url;
      if (profileImage) {
        console.log('Would upload profile image:', profileImage.name);
        // TODO: Implement actual upload
      }

      await updateSellerMutation.mutateAsync({
        ...formData,
        ...(image_url && { image_url }),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section with HeroBanner Component */}
      <div className="relative">
        <HeroBanner 
          asCarousel={false} 
          showNewsTicker={false} 
          customHeight="180px" 
          sellerId={sellerData?.id}
          // Enable edit button functionality
          showEditButton={true}
          onEditBanner={() => setIsBannerPanelOpen(true)}
          editButtonPosition="top-right"
        />
      </div>

      {/* Profile Image Section */}
      <div className="relative z-30 -mt-12 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden shadow-lg">
            {sellerData?.image_url ? (
              <img 
                src={sellerData.image_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white shadow-lg">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Edit Form - Rest of the form remains the same */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6 mt-4">
        {/* ... existing form fields ... */}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your business name"
            />
          </div>

          {/* ... other form fields ... */}
        </div>

        <button type="submit" className="hidden">
          Save
        </button>
      </form>

      {/* Banner Management Panel */}
      <BannerManagementPanel
        isOpen={isBannerPanelOpen}
        onClose={() => setIsBannerPanelOpen(false)}
        sellerId={sellerData?.id}
        onBannerUpdate={handleBannerUpdate}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerEditProfile;