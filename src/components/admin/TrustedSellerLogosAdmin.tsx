import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, Save, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TrustedSellerLogo {
  id: string;
  logo_url: string;
  company_name?: string;
  website_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const TrustedSellerLogosAdmin: React.FC = () => {
  const [logos, setLogos] = useState<TrustedSellerLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingLogo, setEditingLogo] = useState<TrustedSellerLogo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLogo, setNewLogo] = useState({
    logo_url: '',
    company_name: '',
    website_url: '',
    is_active: true,
    display_order: 0
  });

  // Fetch all logos
  const fetchLogos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trusted_seller_logos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching logos:', error);
      alert('Error loading logos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Upload image to Supabase Storage bucket
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('trusted-seller-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('trusted-seller-logos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  // Delete image from storage when logo is deleted
  const deleteImageFromStorage = async (logoUrl: string) => {
    try {
      // Extract filename from URL
      const urlParts = logoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error } = await supabase.storage
        .from('trusted-seller-logos')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting image from storage:', error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      const logoUrl = await uploadImage(file);
      
      if (isEdit && editingLogo) {
        // Delete old image if we're replacing it
        if (editingLogo.logo_url) {
          await deleteImageFromStorage(editingLogo.logo_url);
        }
        setEditingLogo({ ...editingLogo, logo_url: logoUrl });
      } else {
        setNewLogo({ ...newLogo, logo_url: logoUrl });
      }
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Add new logo
  const handleAddLogo = async () => {
    if (!newLogo.logo_url) {
      alert('Please upload a logo image');
      return;
    }

    try {
      // Get the next display order
      const maxOrder = Math.max(...logos.map(logo => logo.display_order), 0);
      const logoData = {
        ...newLogo,
        display_order: maxOrder + 1
      };

      const { error } = await supabase
        .from('trusted_seller_logos')
        .insert([logoData]);

      if (error) throw error;

      setNewLogo({
        logo_url: '',
        company_name: '',
        website_url: '',
        is_active: true,
        display_order: 0
      });
      setShowAddForm(false);
      fetchLogos();
      alert('Logo added successfully!');
    } catch (error) {
      console.error('Error adding logo:', error);
      alert('Error adding logo');
    }
  };

  // Update logo
  const handleUpdateLogo = async () => {
    if (!editingLogo) return;

    try {
      const { error } = await supabase
        .from('trusted_seller_logos')
        .update({
          logo_url: editingLogo.logo_url,
          company_name: editingLogo.company_name,
          website_url: editingLogo.website_url,
          is_active: editingLogo.is_active,
          display_order: editingLogo.display_order
        })
        .eq('id', editingLogo.id);

      if (error) throw error;

      setEditingLogo(null);
      fetchLogos();
      alert('Logo updated successfully!');
    } catch (error) {
      console.error('Error updating logo:', error);
      alert('Error updating logo');
    }
  };

  // Delete logo
  const handleDeleteLogo = async (id: string, logoUrl: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('trusted_seller_logos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete from storage
      await deleteImageFromStorage(logoUrl);

      fetchLogos();
      alert('Logo deleted successfully!');
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Error deleting logo');
    }
  };

  // Toggle logo active status
  const handleToggleActive = async (logo: TrustedSellerLogo) => {
    try {
      const { error } = await supabase
        .from('trusted_seller_logos')
        .update({ is_active: !logo.is_active })
        .eq('id', logo.id);

      if (error) throw error;

      fetchLogos();
    } catch (error) {
      console.error('Error updating logo status:', error);
      alert('Error updating logo status');
    }
  };

  // Move logo up in order
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const logo = logos[index];
    const prevLogo = logos[index - 1];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('trusted_seller_logos')
        .update({ display_order: prevLogo.display_order })
        .eq('id', logo.id);

      const { error: error2 } = await supabase
        .from('trusted_seller_logos')
        .update({ display_order: logo.display_order })
        .eq('id', prevLogo.id);

      if (error1 || error2) throw error1 || error2;

      fetchLogos();
    } catch (error) {
      console.error('Error moving logo:', error);
      alert('Error moving logo');
    }
  };

  // Move logo down in order
  const handleMoveDown = async (index: number) => {
    if (index === logos.length - 1) return;

    const logo = logos[index];
    const nextLogo = logos[index + 1];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('trusted_seller_logos')
        .update({ display_order: nextLogo.display_order })
        .eq('id', logo.id);

      const { error: error2 } = await supabase
        .from('trusted_seller_logos')
        .update({ display_order: logo.display_order })
        .eq('id', nextLogo.id);

      if (error1 || error2) throw error1 || error2;

      fetchLogos();
    } catch (error) {
      console.error('Error moving logo:', error);
      alert('Error moving logo');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trusted Seller Logos</h1>
          <p className="text-gray-600">Manage logos displayed on the seller onboarding page</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Logo</span>
        </button>
      </div>

      {/* Rest of the component remains the same, just update the delete handler */}
      {/* ... (rest of the JSX remains unchanged) ... */}

      {/* In the actions section, update the delete button: */}
      <button
        onClick={() => handleDeleteLogo(logo.id, logo.logo_url)}
        className="text-red-600 hover:text-red-800 p-1"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>

    </div>
  );
};

export default TrustedSellerLogosAdmin;