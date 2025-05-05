import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Projects', value: '2', icon: 'fa-home' },
    { name: 'Total Budget', value: '$45,000', icon: 'fa-dollar-sign' },
    { name: 'Pending Approvals', value: '3', icon: 'fa-clock' },
    { name: 'Completed Projects', value: '5', icon: 'fa-check-circle' }
  ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName}!</h1>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
              >
                <dt>
                  <div className="absolute bg-indigo-500 rounded-md p-3">
                    <i className={`fas ${stat.icon} text-white`}></i>
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </dd>
              </div>
            ))}
          </div>

          {/* Active Projects */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Projects</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <i className="fas fa-plus mr-2"></i>
                  New Project
                </button>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {[
                    {
                      name: 'Kitchen Renovation',
                      contractor: 'ABC Contractors',
                      progress: 65,
                      budget: '$25,000',
                      spent: '$16,250',
                      status: 'In Progress'
                    },
                    {
                      name: 'Bathroom Remodel',
                      contractor: 'XYZ Construction',
                      progress: 20,
                      budget: '$20,000',
                      spent: '$4,000',
                      status: 'In Progress'
                    }
                  ].map((project, i) => (
                    <div key={i} className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-500">Contractor: {project.contractor}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Budget</p>
                            <p className="font-medium text-gray-900">{project.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Spent</p>
                            <p className="font-medium text-gray-900">{project.spent}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-3">
                          <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            View Details
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            Contact Contractor
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Approvals</h3>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {[
                    { type: 'Change Order', project: 'Kitchen Renovation', amount: '+$1,500', reason: 'Additional electrical work required' },
                    { type: 'Timeline Extension', project: 'Bathroom Remodel', amount: 'N/A', reason: 'Weather delays - 5 additional days' },
                    { type: 'Material Change', project: 'Kitchen Renovation', amount: '-$300', reason: 'Alternative tile selection' }
                  ].map((approval, i) => (
                    <div key={i} className="bg-white shadow rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-indigo-600">{approval.type}</span>
                          <h4 className="text-sm font-medium text-gray-900 mt-1">{approval.project}</h4>
                          <p className="text-sm text-gray-500 mt-1">{approval.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{approval.amount}</p>
                          <div className="mt-2 space-x-2">
                            <button className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 hover:bg-green-200">
                              Approve
                            </button>
                            <button className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
