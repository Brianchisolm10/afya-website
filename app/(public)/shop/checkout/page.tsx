'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { DynamicDonationAllocationModal } from '@/lib/dynamic-imports';
import CheckoutForm from '@/components/shop/CheckoutForm';

type DonationAllocation = 'FOUNDATIONS' | 'SPONSOR_A_CLIENT';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  images: string[];
  slug: string;
  subtotal: number;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<DonationAllocation | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Fetch cart data
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/shop/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
        
        // Redirect if cart is empty
        if (data.items.length === 0) {
          router.push('/shop');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    setShowAllocationModal(true);
  };

  const handleAllocationSelect = async (allocation: DonationAllocation) => {
    setSelectedAllocation(allocation);
    
    // Automatically proceed to create payment intent
    if (cart) {
      await createPaymentIntent(allocation);
    }
  };

  const createPaymentIntent = async (allocation: DonationAllocation) => {
    if (!cart) return;

    try {
      const subtotal = cart.subtotal;
      const donationAmount = subtotal * 0.25;
      const tax = subtotal * 0.08;
      const shipping = 10;
      const total = subtotal + tax + shipping;

      const response = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items,
          donationAllocation: allocation,
          subtotal,
          donationAmount,
          tax,
          shipping,
          total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40E0D0] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const donationAmount = cart.subtotal * 0.25;
  const tax = cart.subtotal * 0.08;
  const shipping = 10;
  const total = cart.subtotal + tax + shipping;

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#40E0D0',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section variant="default" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Checkout
          </h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items & Payment */}
            <div className="md:col-span-2 space-y-4">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      {item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
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
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donation Allocation Display */}
              {selectedAllocation && (
                <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl shadow-sm p-6 border-2 border-[#40E0D0]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Your Impact Choice
                      </h3>
                      <p className="text-gray-700">
                        {selectedAllocation === 'FOUNDATIONS' 
                          ? 'Foundations & Donations' 
                          : 'Sponsor-A-Client Program'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        ${donationAmount.toFixed(2)} will support this cause
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAllocationModal(true)}
                      className="text-[#40E0D0] hover:text-[#9370DB] font-semibold text-sm"
                      disabled={!!clientSecret}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {clientSecret && orderId && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h2>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <CheckoutForm orderId={orderId} />
                  </Elements>
                </div>
              )}
            </div>

            {/* Order Total Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Total
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#40E0D0] font-semibold pt-3 border-t border-gray-200">
                    <span>Community Impact (25%)</span>
                    <span>${donationAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {!selectedAllocation && (
                  <Button
                    onClick={handleProceedToCheckout}
                    variant="primary"
                    className="w-full"
                  >
                    Choose Your Impact
                  </Button>
                )}

                {selectedAllocation && !clientSecret && (
                  <div className="text-center text-gray-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40E0D0] mx-auto mb-2"></div>
                    <p className="text-sm">Preparing checkout...</p>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout • Accepts cards, Apple Pay, Google Pay
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Donation Allocation Modal */}
      <DynamicDonationAllocationModal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        onSelect={handleAllocationSelect}
        donationAmount={donationAmount}
      />
    </div>
  );
}
