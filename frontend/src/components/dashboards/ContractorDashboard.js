import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const ContractorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Active Projects', value: '12', icon: 'fa-briefcase' },
    { name: 'Pending Bids', value: '5', icon: 'fa-gavel' },
    { name: 'Open Tasks', value: '23', icon: 'fa-tasks' },
    { name: 'Team Members', value: '8', icon: 'fa-users' }
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

          {/* Recent Projects */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Projects</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <i className="fas fa-plus mr-2"></i>
                  New Project
                </button>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {/* Sample Project Items */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white shadow rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">Home Renovation Project {i}</h4>
                          <p className="text-sm text-gray-500">Client: John Doe</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          In Progress
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          Due: Dec 31, 2023
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-dollar-sign mr-2"></i>
                          Budget: $50,000
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-tasks mr-2"></i>
                          Tasks: 8/12
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      { type: 'bid', text: 'New bid received for Home Renovation Project', time: '2 hours ago' },
                      { type: 'task', text: 'Task "Install Windows" marked as complete', time: '4 hours ago' },
                      { type: 'message', text: 'New message from Subcontractor Team', time: '1 day ago' }
                    ].map((activity, i) => (
                      <li key={i}>
                        <div className="relative pb-8">
                          {i !== 2 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <i className={`fas fa-${activity.type === 'bid' ? 'gavel' : activity.type === 'task' ? 'check' : 'envelope'} text-white`}></i>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{activity.text}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{activity.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractorDashboard;
