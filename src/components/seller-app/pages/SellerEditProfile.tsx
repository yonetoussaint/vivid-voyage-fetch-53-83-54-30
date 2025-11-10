import React, { useState, useEffect, useRef } from 'react';
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
  
  // Use ref to always have latest formData in event listener
  const formDataRef = useRef({
    name: '',
    bio: '',
    business_type: '',
    location: '',
    website: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    business_type: '',
    location: '',
    website: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBannerPanelOpen, setIsBannerPanelOpen] = useState(false);

  // Update ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

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

      if (error) {
        console.error('Error fetching seller data:', error);
        throw error;
      }
      return data;
    },
  });

  // Initialize form with current data
  useEffect(() => {
    if (sellerData) {
      console.log('Initializing form with seller data:', sellerData);
      const newFormData = {
        name: sellerData.name || '',
        bio: sellerData.bio || '',
        business_type: sellerData.business_type || '',
        location: sellerData.location || '',
        website: sellerData.website || '',
        phone: sellerData.phone || '',
        email: sellerData.email || '',
        instagram: sellerData.instagram || '',
        facebook: sellerData.facebook || '',
        twitter: sellerData.twitter || '',
        tiktok: sellerData.tiktok || '',
      };
      setFormData(newFormData);
      formDataRef.current = newFormData;
    }
  }, [sellerData]);

  // Profile image upload function
  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      if (!user?.id) throw new Error('No user logged in');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading profile image to:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('seller-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('seller-logos')
        .getPublicUrl(filePath);

      console.log('Profile image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }
  };

  // Update mutation for seller data
  const updateSellerMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      if (!user?.id) throw new Error('No user logged in');

      console.log('Sending update to Supabase sellers table:', updatedData);
      
      const { data, error } = await supabase
        .from('sellers')
        .update(updatedData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Seller update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Mutation successful, updated seller:', data);
      queryClient.invalidateQueries({ queryKey: ['seller', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['seller-banners', sellerData?.id] });
      
      // Simply navigate back without showing alert
      navigate('/seller-dashboard/products');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      alert(`Error updating profile: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Separate mutation for profile image only
  const updateProfileImageMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      if (!user?.id) throw new Error('No user logged in');

      console.log('Updating profile image only:', imageUrl);
      
      const { data, error } = await supabase
        .from('sellers')
        .update({ 
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase image update error:', error);
        throw error;
      }
      
      console.log('Profile image update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Profile image saved successfully');
      queryClient.invalidateQueries({ queryKey: ['seller', user?.id] });
    },
    onError: (error: any) => {
      console.error('Profile image update error:', error);
      alert(`Error updating profile image: ${error.message}`);
    },
  });

  // Listen for save event from header
  useEffect(() => {
    const handleSave = () => {
      console.log('Save event received, current formData:', formDataRef.current);
      handleSubmit();
    };

    window.addEventListener('saveEditProfile', handleSave);
    return () => {
      window.removeEventListener('saveEditProfile', handleSave);
    };
  }, []);

  // Function to check if text contains emojis
  const containsEmoji = (text: string): boolean => {
    const emojiRegex = /[\p{Emoji}]/gu;
    return emojiRegex.test(text);
  };

  // Function to remove emojis from text
  const removeEmojis = (text: string): string => {
    const emojiRegex = /[\p{Emoji}]/gu;
    return text.replace(emojiRegex, '');
  };

  // Form validation
  const validateForm = () => {
    const currentData = formDataRef.current;
    
    if (!currentData.name.trim()) {
      alert('Business name is required');
      return false;
    }
    
    // Check for emojis in business name
    if (containsEmoji(currentData.name)) {
      alert('Business name cannot contain emojis. Please use only letters, numbers, and standard punctuation.');
      return false;
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For business name field, remove emojis automatically
    if (name === 'name') {
      const cleanValue = removeEmojis(value);
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      console.log('Profile image selected:', file.name);
      
      // Preview the image immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.querySelector('.profile-image') as HTMLImageElement;
        if (img && e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);

      // AUTO-SAVE: Upload and save profile image immediately
      try {
        console.log('Auto-saving profile image...');
        const uploadedImageUrl = await uploadProfileImage(file);
        if (uploadedImageUrl) {
          console.log('Profile image uploaded, saving to database...');
          await updateProfileImageMutation.mutateAsync(uploadedImageUrl);
          console.log('Profile image saved to database successfully!');
        }
      } catch (error) {
        console.error('Error auto-saving profile image:', error);
      }
    }
  };

  const handleBannerUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['seller-banners', sellerData?.id] });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isLoading) return;
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    console.log('Starting form submission...');

    try {
      // Get current data from ref
      const currentData = formDataRef.current;

      // Prepare update data - all columns now exist
      const updateData: any = {
        name: currentData.name,
        bio: currentData.bio,
        business_type: currentData.business_type,
        location: currentData.location,
        website: currentData.website,
        phone: currentData.phone,
        email: currentData.email,
        instagram: currentData.instagram,
        facebook: currentData.facebook,
        twitter: currentData.twitter,
        tiktok: currentData.tiktok,
        updated_at: new Date().toISOString(),
      };

      console.log('Final update data for sellers table:', updateData);
      
      await updateSellerMutation.mutateAsync(updateData);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
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
          showEditButton={true}
          onEditBanner={() => setIsBannerPanelOpen(true)}
          editButtonPosition="top-right"
          dataSource="seller_banners"
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
                className="w-full h-full object-cover profile-image"
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
          {updateProfileImageMutation.isPending && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6 mt-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          
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
              // Add pattern to prevent emojis at browser level
              pattern="[^\p{Emoji}]*"
              title="Emojis are not allowed in business name"
            />
            <div className="text-xs text-gray-500 mt-1">
              Letters, numbers, and standard punctuation only. Emojis are not allowed.
            </div>
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
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
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
        </div>

        {/* Social Media Links */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X (Twitter)
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://x.com/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TikTok
              </label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://tiktok.com/@yourprofile"
              />
            </div>
          </div>
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