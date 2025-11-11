import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Upload, Package, DollarSign, Tag, FileText, Box, Layers } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductImageGallery from '@/components/ProductImageGallery';

const SellerProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const formDataRef = useRef({
    name: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    inventory: '',
    location: '',
    tags: '',
    status: 'active',
    product_type: 'single',
    specifications: '[]',
    bundle_deals: '[]',
    color_variants: '[]',
    storage_variants: '[]',
    variant_templates: '[]',
    variant_options: '{}',
    variant_names: '[]'
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    inventory: '',
    location: '',
    tags: '',
    status: 'active',
    product_type: 'single',
    specifications: '[]',
    bundle_deals: '[]',
    color_variants: '[]',
    storage_variants: '[]',
    variant_templates: '[]',
    variant_options: '{}',
    variant_names: '[]'
  });

  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewProduct] = useState(productId === 'new');

  // Update ref whenever formData changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Fetch current product data only if editing existing product
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId || productId === 'new') return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product data:', error);
        throw error;
      }
      return data;
    },
    enabled: !!productId && productId !== 'new',
  });

  // Fetch product images only if editing existing product
  const { data: imagesData } = useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      if (!productId || productId === 'new') return [];
      
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('created_at');

      if (error) {
        console.error('Error fetching product images:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!productId && productId !== 'new',
  });

  // Initialize form with current data only if editing
  useEffect(() => {
    if (productData && productId !== 'new') {
      console.log('Initializing form with product data:', productData);
      const newFormData = {
        name: productData.name || '',
        description: productData.description || '',
        short_description: productData.short_description || '',
        price: productData.price?.toString() || '',
        discount_price: productData.discount_price?.toString() || '',
        inventory: productData.inventory?.toString() || '100',
        location: productData.location || '',
        tags: Array.isArray(productData.tags) ? productData.tags.join(', ') : '',
        status: productData.status || 'active',
        product_type: productData.product_type || 'single',
        specifications: typeof productData.specifications === 'string' 
          ? productData.specifications 
          : JSON.stringify(productData.specifications || []),
        bundle_deals: typeof productData.bundle_deals === 'string'
          ? productData.bundle_deals
          : JSON.stringify(productData.bundle_deals || []),
        color_variants: typeof productData.color_variants === 'string'
          ? productData.color_variants
          : JSON.stringify(productData.color_variants || []),
        storage_variants: typeof productData.storage_variants === 'string'
          ? productData.storage_variants
          : JSON.stringify(productData.storage_variants || []),
        variant_templates: typeof productData.variant_templates === 'string'
          ? productData.variant_templates
          : JSON.stringify(productData.variant_templates || []),
        variant_options: typeof productData.variant_options === 'string'
          ? productData.variant_options
          : JSON.stringify(productData.variant_options || {}),
        variant_names: typeof productData.variant_names === 'string'
          ? productData.variant_names
          : JSON.stringify(productData.variant_names || [])
      };
      setFormData(newFormData);
      formDataRef.current = newFormData;
    }
  }, [productData, productId]);

  // Set existing images when images data loads
  useEffect(() => {
    if (imagesData && imagesData.length > 0 && productId !== 'new') {
      setExistingImages(imagesData.map(img => img.src));
    }
  }, [imagesData, productId]);

  // Prepare images for ProductImageGallery
  const galleryImages = React.useMemo(() => {
    const images = [];
    
    // Add existing images
    if (existingImages.length > 0) {
      images.push(...existingImages.map(src => ({ src, alt: formData.name || 'Product image' })));
    }
    
    // Add new uploaded images
    if (productImages.length > 0) {
      images.push(...productImages.map(file => ({ 
        src: URL.createObjectURL(file), 
        alt: 'New product image' 
      })));
    }
    
    // If no images, add placeholder
    if (images.length === 0) {
      images.push({ 
        src: "https://placehold.co/600x600?text=No+Image", 
        alt: "No product image available" 
      });
    }
    
    return images;
  }, [existingImages, productImages, formData.name]);

  // Product images upload function
  const uploadProductImages = async (files: File[]): Promise<string[]> => {
    try {
      if (!user?.id) throw new Error('No user logged in');
      
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/products/${productId === 'new' ? 'new' : productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        console.log('Uploading product image to:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        console.log('Product image uploaded successfully:', publicUrl);
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading product images:', error);
      return [];
    }
  };

  // Create mutation for new product
  const createProductMutation = useMutation({
    mutationFn: async (newProductData: any) => {
      if (!user?.id) throw new Error('No user logged in');

      console.log('Creating new product:', newProductData);
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...newProductData,
          seller_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase create error:', error);
        throw error;
      }
      
      console.log('Product creation successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Product created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      navigate('/seller-dashboard/products');
    },
    onError: (error: any) => {
      console.error('Product creation error:', error);
      alert(`Error creating product: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Update mutation for existing product
  const updateProductMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      if (!productId || productId === 'new') throw new Error('No product ID');

      console.log('Updating product:', updatedData);
      
      const { data, error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Product update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Product updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      navigate('/seller-dashboard/products');
    },
    onError: (error: any) => {
      console.error('Product update error:', error);
      alert(`Error updating product: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Mutation for product images
  const updateProductImagesMutation = useMutation({
    mutationFn: async (imageUrls: string[], targetProductId: string) => {
      if (!targetProductId) throw new Error('No product ID');

      // First, delete existing images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', targetProductId);

      // Then insert new images
      const imageRecords = imageUrls.map((url, index) => ({
        product_id: targetProductId,
        src: url,
        alt: formData.name || 'Product image',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('product_images')
        .insert(imageRecords)
        .select();

      if (error) {
        console.error('Supabase images update error:', error);
        throw error;
      }
      
      console.log('Product images update successful:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Product images saved successfully');
      if (productId && productId !== 'new') {
        queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      }
    },
    onError: (error: any) => {
      console.error('Product images update error:', error);
      alert(`Error updating product images: ${error.message}`);
    },
  });

  // Listen for save event from header (same as SellerEditProfile)
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

  // Handle back button click - navigate to products page
  const handleBackClick = () => {
    navigate('/seller-dashboard/products');
  };

  // Form validation
  const validateForm = () => {
    const currentData = formDataRef.current;
    
    if (!currentData.name.trim()) {
      alert('Product name is required');
      return false;
    }
    
    if (!currentData.price || parseFloat(currentData.price) <= 0) {
      alert('Valid price is required');
      return false;
    }
    
    if (!currentData.description.trim()) {
      alert('Product description is required');
      return false;
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProductImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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
    console.log('Starting product form submission...');

    try {
      // Get current data from ref
      const currentData = formDataRef.current;

      // Prepare product data
      const productData: any = {
        name: currentData.name,
        description: currentData.description,
        short_description: currentData.short_description,
        price: parseFloat(currentData.price),
        discount_price: currentData.discount_price ? parseFloat(currentData.discount_price) : null,
        inventory: parseInt(currentData.inventory) || 100,
        location: currentData.location,
        tags: currentData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: currentData.status,
        product_type: currentData.product_type,
        specifications: JSON.parse(currentData.specifications),
        bundle_deals: JSON.parse(currentData.bundle_deals),
        color_variants: JSON.parse(currentData.color_variants),
        storage_variants: JSON.parse(currentData.storage_variants),
        variant_templates: JSON.parse(currentData.variant_templates),
        variant_options: JSON.parse(currentData.variant_options),
        variant_names: JSON.parse(currentData.variant_names),
        updated_at: new Date().toISOString(),
      };

      let targetProductId = productId;

      if (isNewProduct) {
        // Create new product
        console.log('Creating new product with data:', productData);
        const newProduct = await createProductMutation.mutateAsync(productData);
        targetProductId = newProduct.id;
      } else {
        // Update existing product
        console.log('Updating product with data:', productData);
        await updateProductMutation.mutateAsync(productData);
      }

      // Handle image uploads if there are new images and we have a product ID
      if (productImages.length > 0 && targetProductId) {
        console.log('Uploading new product images...');
        const uploadedImageUrls = await uploadProductImages(productImages);
        
        if (uploadedImageUrls.length > 0) {
          // Combine existing images (that weren't removed) with new uploaded images
          const allImageUrls = [...existingImages, ...uploadedImageUrls];
          await updateProductImagesMutation.mutateAsync(allImageUrls, targetProductId);
        }
      } else if (existingImages.length > 0 && targetProductId && targetProductId !== 'new') {
        // Just update with existing images (in case some were removed)
        await updateProductImagesMutation.mutateAsync(existingImages, targetProductId);
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
      setIsLoading(false);
    }
  };

  if (productLoading && !isNewProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Product Images Section with ProductImageGallery */}
      <div className="relative bg-gray-100">
        <ProductImageGallery 
          images={galleryImages}
          product={{
            name: formData.name,
            inventory: parseInt(formData.inventory) || 0,
            sold_count: 0 // You might want to fetch this from productData if editing
          }}
        />
        
        {/* Upload Button Overlay */}
        <label className="absolute bottom-4 right-4 z-30 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white shadow-lg">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Management Section */}
      {(existingImages.length > 0 || productImages.length > 0) && (
        <div className="px-4 py-3 bg-white border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Manage Images</h4>
          <div className="flex gap-2 overflow-x-auto">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative">
                <img 
                  src={url} 
                  alt={`Product ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {productImages.map((file, index) => (
              <div key={`new-${index}`} className="relative">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`New image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description (appears in listings)"
              maxLength={150}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.short_description.length}/150
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price ($)
              </label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inventory *
              </label>
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
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
              placeholder="Product location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tag1, tag2, tag3"
            />
            <div className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </div>
          </div>
        </div>

        {/* Product Type */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Product Type
          </h3>
          <div className="mt-3">
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single">Single Product</option>
              <option value="bundle">Product Bundle</option>
              <option value="variable">Variable Product</option>
            </select>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Advanced Settings
          </h3>
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specifications (JSON)
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder='[{"name": "Color", "value": "Black"}]'
              />
            </div>
          </div>
        </div>

        <button type="submit" className="hidden">
          Save
        </button>
      </form>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">
              {isNewProduct ? 'Creating product...' : 'Saving product...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductEdit;