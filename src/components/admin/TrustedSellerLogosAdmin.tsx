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

      const { error: uploadError } = await supabase.storage
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

      {/* Add Logo Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Logo</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image *
              </label>
              {newLogo.logo_url ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={newLogo.logo_url}
                    alt="Logo preview"
                    className="w-24 h-16 object-contain border border-gray-200 rounded"
                  />
                  <button
                    onClick={() => setNewLogo({ ...newLogo, logo_url: '' })}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload logo'}
                    </span>
                    <span className="text-xs text-gray-500">PNG, JPG, SVG (max 2MB)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newLogo.company_name}
                  onChange={(e) => setNewLogo({ ...newLogo, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newLogo.website_url}
                  onChange={(e) => setNewLogo({ ...newLogo, website_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newLogo.is_active}
                  onChange={(e) => setNewLogo({ ...newLogo, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLogo}
              disabled={!newLogo.logo_url || uploading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Add Logo</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit Logo Form */}
      {editingLogo && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Logo</h3>
            <button
              onClick={() => setEditingLogo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Image *
              </label>
              {editingLogo.logo_url ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={editingLogo.logo_url}
                    alt="Logo preview"
                    className="w-24 h-16 object-contain border border-gray-200 rounded"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      id="edit-logo-upload"
                    />
                    <label
                      htmlFor="edit-logo-upload"
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                    >
                      Change
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                    id="edit-logo-upload"
                  />
                  <label
                    htmlFor="edit-logo-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload logo'}
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editingLogo.company_name || ''}
                  onChange={(e) => setEditingLogo({ ...editingLogo, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editingLogo.website_url || ''}
                  onChange={(e) => setEditingLogo({ ...editingLogo, website_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingLogo.is_active}
                  onChange={(e) => setEditingLogo({ ...editingLogo, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingLogo.display_order}
                  onChange={(e) => setEditingLogo({ ...editingLogo, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setEditingLogo(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateLogo}
              disabled={!editingLogo.logo_url || uploading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Update Logo</span>
            </button>
          </div>
        </div>
      )}

      {/* Logos List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
          <div className="col-span-1">Order</div>
          <div className="col-span-2">Logo</div>
          <div className="col-span-3">Company</div>
          <div className="col-span-3">Website</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {logos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No logos found. Add your first logo to get started.
          </div>
        ) : (
          logos.map((logo, index) => (
            <div
              key={logo.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
            >
              {/* Display Order */}
              <div className="col-span-1">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{logo.display_order}</span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === logos.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="col-span-2">
                <img
                  src={logo.logo_url}
                  alt={logo.company_name || 'Logo'}
                  className="w-16 h-10 object-contain border border-gray-200 rounded"
                />
              </div>

              {/* Company Name */}
              <div className="col-span-3">
                <div className="font-medium text-gray-900">
                  {logo.company_name || 'N/A'}
                </div>
              </div>

              {/* Website */}
              <div className="col-span-3">
                {logo.website_url ? (
                  <a
                    href={logo.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                  >
                    {logo.website_url}
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">N/A</span>
                )}
              </div>

              {/* Status */}
              <div className="col-span-1">
                <button
                  onClick={() => handleToggleActive(logo)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    logo.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {logo.is_active ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                  <span>{logo.is_active ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              {/* Actions */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingLogo(logo)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteLogo(logo.id, logo.logo_url)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Section */}
      {logos.filter(logo => logo.is_active).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex flex-wrap gap-6 justify-center">
              {logos
                .filter(logo => logo.is_active)
                .sort((a, b) => a.display_order - b.display_order)
                .map(logo => (
                  <div key={logo.id} className="flex flex-col items-center">
                    <img
                      src={logo.logo_url}
                      alt={logo.company_name || 'Logo'}
                      className="w-24 h-16 object-contain mb-2"
                    />
                    {logo.company_name && (
                      <span className="text-xs text-gray-600 text-center max-w-24 truncate">
                        {logo.company_name}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedSellerLogosAdmin;