import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BidForm = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    timeline: '',
    description: '',
    materialCosts: '',
    laborCosts: '',
    startDate: '',
    documents: []
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, upload any documents
      const documentUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('http://localhost:5000/api/uploads', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          if (!response.ok) throw new Error('Failed to upload file');
          const { url } = await response.json();
          documentUrls.push(url);
        }
      }

      // Submit the bid with document URLs
      const response = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          projectId,
          documents: documentUrls
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit bid');
      }

      const bid = await response.json();
      navigate(`/projects/${projectId}/bids/${bid.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Submit Bid</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Total bid amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timeline (days)</label>
            <input
              type="number"
              name="timeline"
              required
              value={formData.timeline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Number of days"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Costs</label>
            <input
              type="number"
              name="materialCosts"
              required
              value={formData.materialCosts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Material costs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Labor Costs</label>
            <input
              type="number"
              name="laborCosts"
              required
              value={formData.laborCosts}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Labor costs"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Detailed description of your bid"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Supporting Documents</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload any supporting documents (quotes, certifications, etc.)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;
