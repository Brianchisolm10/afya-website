'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface DonationFormData {
  amount: number;
  donorName: string;
  donorEmail: string;
  allocation: 'FOUNDATIONS' | 'SPONSOR_A_CLIENT';
  isRecurring: boolean;
}

// Preset donation amounts
const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

function DonationFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 50,
    donorName: '',
    donorEmail: '',
    allocation: 'FOUNDATIONS',
    isRecurring: false,
  });
  
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const handleAmountSelect = (amount: number) => {
    setFormData({ ...formData, amount });
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setFormData({ ...formData, amount: numValue });
    }
  };
  
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    
    try {
      // Validate form
      if (!formData.donorName || !formData.donorEmail || formData.amount < 1) {
        throw new Error('Please fill in all required fields');
      }
      
      // Create payment intent
      const response = await fetch('/api/impact/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process donation');
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }
      
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/impact/donate/confirmation`,
        },
      });
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsProcessing(false);
    }
  };
  
  if (step === 'payment' && clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <button
            onClick={() => setStep('details')}
            className="text-[#40E0D0] hover:text-[#20B2AA] mb-6 flex items-center"
          >
            ← Back to Details
          </button>
          
          <h2 className="text-2xl font-bold mb-6">Complete Your Donation</h2>
          
          <div className="bg-gradient-to-br from-[#40E0D0]/10 to-[#9370DB]/10 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Donation Amount:</span>
              <span className="text-2xl font-bold text-[#40E0D0]">
                ${formData.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Supporting:</span>
              <span className="font-medium text-gray-900">
                {formData.allocation === 'FOUNDATIONS' 
                  ? 'Foundations & Donations' 
                  : 'Sponsor-A-Client Program'}
              </span>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <PaymentElement />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : `Donate $${formData.amount.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
        
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Donation Amount *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    formData.amount === amount && !customAmount
                      ? 'border-[#40E0D0] bg-[#40E0D0]/10 text-[#40E0D0]'
                      : 'border-gray-300 hover:border-[#40E0D0] text-gray-700'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              min="1"
              step="0.01"
            />
          </div>
          
          {/* Donor Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <Input
              type="text"
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.donorEmail}
              onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>
          
          {/* Allocation Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Where should your donation go? *
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, allocation: 'FOUNDATIONS' })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.allocation === 'FOUNDATIONS'
                    ? 'border-[#40E0D0] bg-[#40E0D0]/10'
                    : 'border-gray-300 hover:border-[#40E0D0]'
                }`}
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">❤️</div>
                  <div>
                    <div className="font-bold text-gray-900">Foundations & Donations</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Support AFYA's general operations, community programs, and foundational initiatives
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, allocation: 'SPONSOR_A_CLIENT' })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.allocation === 'SPONSOR_A_CLIENT'
                    ? 'border-[#40E0D0] bg-[#40E0D0]/10'
                    : 'border-gray-300 hover:border-[#40E0D0]'
                }`}
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🤝</div>
                  <div>
                    <div className="font-bold text-gray-900">Sponsor-A-Client Program</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Directly fund wellness packets for clients in need
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Recurring Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="w-4 h-4 text-[#40E0D0] border-gray-300 rounded focus:ring-[#40E0D0]"
            />
            <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
              Make this a monthly recurring donation
            </label>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function DonationForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  return (
    <Elements stripe={stripePromise} options={clientSecret ? { clientSecret } : undefined}>
      <DonationFormContent />
    </Elements>
  );
}
