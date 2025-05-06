import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DisputeManagement = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    reason: '',
    evidencePhotos: []
  });
  const [showForm, setShowForm] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchDisputes();
  }, [projectId]);

  const fetchDisputes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/disputes?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch disputes');
      const data = await response.json();
      setDisputes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      // Upload evidence photos
      const photoUrls = [];
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
          photoUrls.push(url);
        }
      }

      const response = await fetch('http://localhost:5000/api/disputes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          projectId,
          evidencePhotos: photoUrls
        })
      });

      if (!response.ok) throw new Error('Failed to create dispute');

      await fetchDisputes();
      setShowForm(false);
      setFormData({
        reason: '',
        evidencePhotos: []
      });
      setFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (disputeId, resolution) => {
    try {
      const response = await fetch(`http://localhost:5000/api/disputes/${disputeId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resolution })
      });

      if (!response.ok) throw new Error('Failed to resolve dispute');
      await fetchDisputes();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dispute Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Raise Dispute'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason for Dispute</label>
            <textarea
              name="reason"
              required
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe the reason for raising this dispute..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Evidence Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload photos as evidence for your dispute
            </p>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                    <span className="ml-3 text-sm text-gray-500">
                      Raised by {dispute.raisedBy.firstName} {dispute.raisedBy.lastName}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-900">{dispute.reason}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </div>
              </div>

              {dispute.evidencePhotos.length > 0 && (
                <div className="mt-4 flex space-x-4">
                  {dispute.evidencePhotos.map((photo, index) => (
                    <a
                      key={index}
                      href={photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={photo}
                        alt={`Evidence ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    </a>
                  ))}
                </div>
              )}

              {dispute.status === 'open' && user.role === 'contractor' && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleResolve(dispute.id, 'accepted')}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResolve(dispute.id, 'rejected')}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Reject
                  </button>
                </div>
              )}

              {dispute.resolution && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900">Resolution</h4>
                  <p className="mt-1 text-sm text-gray-600">{dispute.resolution}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Resolved on {new Date(dispute.resolvedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisputeManagement;
