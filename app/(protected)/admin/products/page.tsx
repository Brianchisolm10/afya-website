import { Suspense } from 'react';
import { ProductManagementPage } from '@/components/admin/ProductManagementPage';

export const metadata = {
  title: 'Product Management | AFYA Admin',
  description: 'Manage shop products, inventory, and pricing'
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductManagementPage />
      </Suspense>
    </div>
  );
}
