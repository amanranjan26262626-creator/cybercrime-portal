'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { CRIME_TYPES } from '@/lib/constants';

export default function ComplaintForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    crime_type: '',
    description: '',
    amount: '',
    location: {
      state: '',
      city: '',
      address: '',
    },
    is_anonymous: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('crime_type', formData.crime_type);
      formDataToSend.append('description', formData.description);
      if (formData.amount) {
        formDataToSend.append('amount', formData.amount);
      }
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('is_anonymous', formData.is_anonymous.toString());

      files.forEach((file) => {
        formDataToSend.append('evidence', file);
      });

      const response = await apiClient.post('/complaints', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push(`/complaint/${response.data.data.complaint.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {step} of 3</span>
          <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Crime Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crime Type *
            </label>
            <select
              value={formData.crime_type}
              onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Select crime type</option>
              {CRIME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (if financial)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              min="0"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.crime_type || !formData.description}
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input
              type="text"
              value={formData.location.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, state: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.location.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value },
                })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.location.state || !formData.location.city}
              className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Evidence Upload</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Evidence (Images, Videos, Documents)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              accept="image/*,video/*,application/pdf"
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {files.length} file(s) selected
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={formData.is_anonymous}
              onChange={(e) =>
                setFormData({ ...formData, is_anonymous: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

