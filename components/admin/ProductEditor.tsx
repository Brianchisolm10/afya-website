'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  inventory: number;
  isActive: boolean;
  isDrop: boolean;
  dropStartDate?: string;
  dropEndDate?: string;
  slug: string;
}

interface ProductEditorProps {
  product: Product | null;
  onClose: () => void;
}

const CATEGORIES = ['APPAREL', 'ACCESSORIES', 'DROPS', 'COLLECTIONS'];

export function ProductEditor({ product, onClose }: ProductEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'APPAREL',
    images: '',
    sizes: '',
    colors: '',
    inventory: '',
    isActive: true,
    isDrop: false,
    dropStartDate: '',
    dropEndDate: '',
    slug: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        images: product.images.join('\n'),
        sizes: product.sizes?.join(', ') || '',
        colors: product.colors?.join(', ') || '',
        inventory: product.inventory.toString(),
        isActive: product.isActive,
        isDrop: product.isDrop,
        dropStartDate: product.dropStartDate || '',
        dropEndDate: product.dropEndDate || '',
        slug: product.slug
      });
    }
  }, [product]);

  function handleChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images.split('\n').filter(url => url.trim()),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
        inventory: parseInt(formData.inventory),
        isActive: formData.isActive,
        isDrop: formData.isDrop,
        dropStartDate: formData.dropStartDate || null,
        dropEndDate: formData.dropEndDate || null,
        slug: formData.slug
      };

      const url = product 
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., AFYA Performance Tee"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the product..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="29.99"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent"
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory *
              </label>
              <Input
                type="number"
                min="0"
                value={formData.inventory}
                onChange={(e) => handleChange('inventory', e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <Input
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="afya-performance-tee"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Used in product URL: /shop/products/{formData.slug}
              </p>
            </div>

            {/* Images */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs (one per line)
              </label>
              <textarea
                value={formData.images}
                onChange={(e) => handleChange('images', e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-afya-turquoise focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter full image URLs, one per line
              </p>
            </div>

            {/* Variants */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants (Optional)</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <Input
                value={formData.sizes}
                onChange={(e) => handleChange('sizes', e.target.value)}
                placeholder="XS, S, M, L, XL, XXL"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated list
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <Input
                value={formData.colors}
                onChange={(e) => handleChange('colors', e.target.value)}
                placeholder="Black, White, Turquoise, Lavender"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated list
              </p>
            </div>

            {/* Drop Settings */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Drop Settings</h3>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isDrop}
                  onChange={(e) => handleChange('isDrop', e.target.checked)}
                  className="rounded border-gray-300 text-afya-turquoise focus:ring-afya-turquoise"
                />
                <span className="ml-2 text-sm text-gray-700">
                  This is a limited-time drop
                </span>
              </label>
            </div>

            {formData.isDrop && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop Start Date
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.dropStartDate}
                    onChange={(e) => handleChange('dropStartDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop End Date
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.dropEndDate}
                    onChange={(e) => handleChange('dropEndDate', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Status */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-afya-turquoise focus:ring-afya-turquoise"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Product is active and visible in shop
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
