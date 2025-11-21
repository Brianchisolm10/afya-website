'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  priceAtPurchase: number;
  product: {
    name: string;
    images: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  donationAmount: number;
  donationAllocation: 'FOUNDATIONS' | 'SPONSOR_A_CLIENT';
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/shop/orders/${orderId}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40E0D0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Section variant="default" spacing="lg">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              {error || 'We couldn\'t find the order you\'re looking for.'}
            </p>
            <Button onClick={() => router.push('/shop')} variant="primary">
              Continue Shopping
            </Button>
          </div>
        </Section>
      </div>
    );
  }

  const allocationTitle = order.donationAllocation === 'FOUNDATIONS'
    ? 'Foundations & Donations'
    : 'Sponsor-A-Client Program';

  const allocationDescription = order.donationAllocation === 'FOUNDATIONS'
    ? 'Your contribution will support AFYA\'s general operations, community programs, and foundational initiatives that make movement accessible to everyone.'
    : 'Your contribution will directly fund wellness packets for clients in need, helping individuals access personalized health and fitness guidance.';

  return (
    <div className="min-h-screen bg-gray-50">
      <Section variant="default" spacing="lg">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for supporting AFYA
            </p>
          </div>

          {/* Order Number */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">{order.orderNumber}</p>
              <p className="text-sm text-gray-600 mt-2">
                Confirmation sent to {order.customerEmail}
              </p>
            </div>
          </div>

          {/* Donation Allocation Highlight */}
          <div className="bg-gradient-to-br from-[#40E0D0]/20 to-[#9370DB]/20 rounded-xl shadow-sm p-6 mb-6 border-2 border-[#40E0D0]">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {order.donationAllocation === 'FOUNDATIONS' ? '❤️' : '🤝'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Your Impact: {allocationTitle}
              </h2>
              <p className="text-3xl font-bold text-[#40E0D0] mb-2">
                ${order.donationAmount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-700">
                {allocationDescription}
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Details
            </h2>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item) => {
                const images = item.product.images ? JSON.parse(item.product.images) : [];
                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {images[0] && (
                      <img
                        src={images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#40E0D0] font-semibold pt-2 border-t border-gray-200">
                <span>Community Impact (25%)</span>
                <span>${order.donationAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.paymentStatus.toLowerCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fulfillment Status</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.fulfillmentStatus.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/shop')}
              variant="primary"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => router.push('/dashboard')}
              variant="secondary"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
