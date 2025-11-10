import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SellerEditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    business_type: '',
    location: '',
    website: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64); // Default height

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

  // Calculate header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('[class*="fixed top-0"]');
      if (header) {
        const height = header.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    // Initial calculation
    updateHeaderHeight();

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Update after a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  // Listen for save event from header
  useEffect(() => {
    const handleSave = () => {
      handleSubmit();
    };

    window.addEventListener('saveEditProfile', handleSave);
    return () => {
      window.removeEventListener('saveEditProfile', handleSave);
    };
  }, [formData, profileImage, bannerImage]);

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
      navigate(-1); // Go back to previous page
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
      // Here you would upload to Supabase Storage
      console.log('Profile image selected:', file.name);
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      // Here you would upload to Supabase Storage
      console.log('Banner image selected:', file.name);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Upload images first if selected
      let image_url = sellerData?.image_url;
      if (profileImage) {
        // Upload profile image logic here
        // const { data } = await supabase.storage.from('seller-logos').upload(...)
        // image_url = data?.path;
        console.log('Would upload profile image:', profileImage.name);
      }

      let banner_url = sellerData?.banner_url;
      if (bannerImage) {
        // Upload banner image logic here
        // const { data } = await supabase.storage.from('seller-banners').upload(...)
        // banner_url = data?.path;
        console.log('Would upload banner image:', bannerImage.name);
      }

      // Update seller data
      await updateSellerMutation.mutateAsync({
        ...formData,
        ...(image_url && { image_url }),
        ...(banner_url && { banner_url }),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (sellerLoading) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ paddingTop: `${headerHeight}px` }}
    >
      {/* Edit Form - No header here, using the one from SellerLayout */}
      <form ref={formRef} onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Banner Image */}
        <div className="relative">
          <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
            {/* Current banner or placeholder */}
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white opacity-70" />
            </div>
          </div>
          <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer hover:bg-white transition-colors">
            <Upload className="w-4 h-4" />
            Change Banner
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center -mt-16 relative">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
              {/* Current profile image or placeholder */}
              <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
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

        {/* Form Fields */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell customers about your business..."
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.bio.length}/500
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <input
              type="text"
              name="business_type"
              value={formData.business_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Fashion, Electronics, Food"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where are you located?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Hidden submit button for form submission */}
        <button type="submit" className="hidden">
          Save
        </button>
      </form>

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