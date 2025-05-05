import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const SubcontractorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Projects', value: '4', icon: 'fa-briefcase' },
    { name: 'Submitted Bids', value: '12', icon: 'fa-gavel' },
    { name: 'Completed Jobs', value: '47', icon: 'fa-check-circle' },
    { name: 'Earnings (MTD)', value: '$12,450', icon: 'fa-dollar-sign' }
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

          {/* Available Projects */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Projects</h3>
                <div className="flex space-x-3">
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option>All Trades</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>Carpentry</option>
                  </select>
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option>All Locations</option>
                    <option>Montreal</option>
                    <option>Quebec City</option>
                    <option>Laval</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {[
                    { title: 'Kitchen Renovation', location: 'Montreal', budget: '$25,000', deadline: '7 days' },
                    { title: 'Office Building Electrical', location: 'Laval', budget: '$45,000', deadline: '14 days' },
                    { title: 'Bathroom Remodel', location: 'Quebec City', budget: '$15,000', deadline: '5 days' },
                  ].map((project, i) => (
                    <div key={i} className="bg-white shadow rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-2"></i>
                            {project.location}
                          </p>
                        </div>
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                          Submit Bid
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <i className="fas fa-dollar-sign mr-2"></i>
                          Budget: {project.budget}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-2"></i>
                          Bid Deadline: {project.deadline}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current Projects */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Current Projects</h3>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {[
                    { name: 'Home Renovation', progress: 75, dueDate: 'Oct 15, 2023', payment: '$8,500' },
                    { name: 'Commercial Plumbing', progress: 30, dueDate: 'Oct 30, 2023', payment: '$12,000' },
                  ].map((project, i) => (
                    <div key={i} className="bg-white shadow rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                        <span className="text-sm text-gray-500">Due: {project.dueDate}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-gray-500">{project.progress}% Complete</span>
                        <span className="font-medium text-gray-900">Next Payment: {project.payment}</span>
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

export default SubcontractorDashboard;
