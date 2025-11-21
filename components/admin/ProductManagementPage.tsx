'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { ProductEditor } from './ProductEditor';
import { ProductTable } from './ProductTable';

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
  createdAt: string;
  updatedAt: string;
}

export function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateNew() {
    setEditingProduct(null);
    setIsEditorOpen(true);
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setIsEditorOpen(true);
  }

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await loadProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  }

  function handleEditorClose() {
    setIsEditorOpen(false);
    setEditingProduct(null);
    loadProducts();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afya-turquoise mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Products</h3>
        <p className="text-red-600">{error}</p>
        <Button onClick={loadProducts} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your shop products, inventory, and pricing
          </p>
        </div>
        <Button onClick={handleCreateNew} variant="primary">
          + Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-afya-turquoise">
              {products.length}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-afya-lavender">
              {products.filter(p => p.isDrop).length}
            </div>
            <div className="text-sm text-gray-600">Drops</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {products.filter(p => p.inventory < 10).length}
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
        </div>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isEditorOpen && (
        <ProductEditor
          product={editingProduct}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}
