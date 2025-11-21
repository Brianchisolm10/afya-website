'use client';

import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface GearDriveFormData {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  itemTypes: string[];
  estimatedQuantity: string;
  condition: string;
  dropoffMethod: string;
  preferredDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}

interface GearDriveFormProps {
  onSuccess?: (confirmationNumber: string) => void;
  onCancel?: () => void;
}

const ITEM_TYPES = [
  { value: 'shirts', label: 'Athletic Shirts & Tanks' },
  { value: 'pants', label: 'Workout Pants & Leggings' },
  { value: 'shorts', label: 'Athletic Shorts' },
  { value: 'sports-bras', label: 'Sports Bras' },
  { value: 'jackets', label: 'Athletic Jackets & Hoodies' },
  { value: 'compression', label: 'Compression Wear' },
  { value: 'socks', label: 'Athletic Socks (new/unused only)' },
  { value: 'bags', label: 'Gym Bags' },
];

const CONDITIONS = [
  { value: 'EXCELLENT', label: 'Excellent - Like new, minimal wear' },
  { value: 'GOOD', label: 'Good - Gently used, no visible defects' },
  { value: 'FAIR', label: 'Fair - Shows wear but still functional' },
  { value: 'WORN', label: 'Worn - Suitable for recycling/upcycling only' },
];

const DROPOFF_METHODS = [
  { value: 'DROPOFF', label: 'I will drop off items' },
  { value: 'PICKUP', label: 'Please arrange pickup (address required)' },
  { value: 'SHIPPING', label: 'I will ship items' },
];

export default function GearDriveForm({ onSuccess, onCancel }: GearDriveFormProps) {
  const [formData, setFormData] = useState<GearDriveFormData>({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    itemTypes: [],
    estimatedQuantity: '',
    condition: '',
    dropoffMethod: '',
    preferredDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GearDriveFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GearDriveFormData, string>> = {};

    // Required fields
    if (!formData.donorName.trim()) {
      newErrors.donorName = 'Name is required';
    }

    if (!formData.donorEmail.trim()) {
      newErrors.donorEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      newErrors.donorEmail = 'Please enter a valid email address';
    }

    if (formData.itemTypes.length === 0) {
      newErrors.itemTypes = 'Please select at least one item type';
    }

    if (!formData.estimatedQuantity) {
      newErrors.estimatedQuantity = 'Please estimate the quantity';
    } else if (parseInt(formData.estimatedQuantity) < 1) {
      newErrors.estimatedQuantity = 'Quantity must be at least 1';
    }

    if (!formData.condition) {
      newErrors.condition = 'Please select the condition of items';
    }

    if (!formData.dropoffMethod) {
      newErrors.dropoffMethod = 'Please select a dropoff method';
    }

    // Conditional validation for pickup
    if (formData.dropoffMethod === 'PICKUP') {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required for pickup';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required for pickup';
      }
      if (!formData.state.trim()) {
        newErrors.state = 'State is required for pickup';
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required for pickup';
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Please enter a valid ZIP code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof GearDriveFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleItemTypeToggle = (itemType: string) => {
    const currentTypes = formData.itemTypes;
    const newTypes = currentTypes.includes(itemType)
      ? currentTypes.filter((t) => t !== itemType)
      : [...currentTypes, itemType];
    handleChange('itemTypes', newTypes);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/impact/gear-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName: formData.donorName,
          donorEmail: formData.donorEmail,
          donorPhone: formData.donorPhone || undefined,
          itemTypes: formData.itemTypes,
          estimatedQuantity: parseInt(formData.estimatedQuantity),
          condition: formData.condition,
          dropoffMethod: formData.dropoffMethod,
          preferredDate: formData.preferredDate || undefined,
          address: formData.dropoffMethod === 'PICKUP' ? {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          } : undefined,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit gear drive form');
      }

      // Success - redirect or show confirmation
      if (onSuccess) {
        onSuccess(data.confirmationNumber);
      } else {
        // Redirect to confirmation page
        window.location.href = `/impact/gear-drive/confirmation?id=${data.submissionId}`;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Submission failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showAddressFields = formData.dropoffMethod === 'PICKUP';

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donate Your Gear</h2>
          <p className="text-gray-600">
            Fill out this form to donate your used workout clothing. We'll contact you with next steps.
          </p>
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
          
          <Input
            label="Full Name"
            type="text"
            value={formData.donorName}
            onChange={(e) => handleChange('donorName', e.target.value)}
            error={errors.donorName}
            required
            fullWidth
            placeholder="John Doe"
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.donorEmail}
            onChange={(e) => handleChange('donorEmail', e.target.value)}
            error={errors.donorEmail}
            required
            fullWidth
            placeholder="your.email@example.com"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.donorPhone}
            onChange={(e) => handleChange('donorPhone', e.target.value)}
            error={errors.donorPhone}
            fullWidth
            placeholder="(555) 123-4567"
            helperText="Optional - for pickup coordination"
          />
        </div>

        {/* Donation Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Donation Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What types of items are you donating? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {ITEM_TYPES.map((item) => (
                <label key={item.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.itemTypes.includes(item.value)}
                    onChange={() => handleItemTypeToggle(item.value)}
                    className="h-4 w-4 text-[#40E0D0] focus:ring-[#40E0D0] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
            {errors.itemTypes && (
              <p className="mt-1 text-sm text-red-600">{errors.itemTypes}</p>
            )}
          </div>

          <Input
            label="Estimated Quantity"
            type="number"
            min="1"
            value={formData.estimatedQuantity}
            onChange={(e) => handleChange('estimatedQuantity', e.target.value)}
            error={errors.estimatedQuantity}
            required
            fullWidth
            placeholder="10"
            helperText="Approximate number of items"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Condition <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CONDITIONS.map((cond) => (
                <label key={cond.value} className="flex items-start">
                  <input
                    type="radio"
                    name="condition"
                    value={cond.value}
                    checked={formData.condition === cond.value}
                    onChange={(e) => handleChange('condition', e.target.value)}
                    className="h-4 w-4 mt-0.5 text-[#40E0D0] focus:ring-[#40E0D0] border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{cond.label}</span>
                </label>
              ))}
            </div>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
            )}
          </div>
        </div>

        {/* Logistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Logistics</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you like to donate? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {DROPOFF_METHODS.map((method) => (
                <label key={method.value} className="flex items-start">
                  <input
                    type="radio"
                    name="dropoffMethod"
                    value={method.value}
                    checked={formData.dropoffMethod === method.value}
                    onChange={(e) => handleChange('dropoffMethod', e.target.value)}
                    className="h-4 w-4 mt-0.5 text-[#40E0D0] focus:ring-[#40E0D0] border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
            {errors.dropoffMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.dropoffMethod}</p>
            )}
          </div>

          <Input
            label="Preferred Date"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleChange('preferredDate', e.target.value)}
            error={errors.preferredDate}
            fullWidth
            helperText="Optional - when you'd like to drop off or have items picked up"
            min={new Date().toISOString().split('T')[0]}
          />

          {/* Conditional Address Fields */}
          {showAddressFields && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                Pickup Address
              </p>
              
              <Input
                label="Street Address"
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                error={errors.address}
                required
                fullWidth
                placeholder="123 Main St"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  error={errors.city}
                  required
                  fullWidth
                  placeholder="City"
                />

                <Input
                  label="State"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  error={errors.state}
                  required
                  fullWidth
                  placeholder="CA"
                  maxLength={2}
                />
              </div>

              <Input
                label="ZIP Code"
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                error={errors.zipCode}
                required
                fullWidth
                placeholder="12345"
              />
            </div>
          )}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40E0D0] focus:border-transparent bg-white text-gray-900"
              placeholder="Any additional information about your donation..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="sm:ml-auto sm:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Donation'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
