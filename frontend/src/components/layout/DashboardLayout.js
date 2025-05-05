import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout, isContractor, isVendor, isSubcontractor, isCustomer } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (isContractor) {
      return [
        { name: 'Projects', path: '/contractor/projects', icon: 'fa-briefcase' },
        { name: 'Bids', path: '/contractor/bids', icon: 'fa-gavel' },
        { name: 'Tasks', path: '/contractor/tasks', icon: 'fa-tasks' },
        { name: 'Documents', path: '/contractor/documents', icon: 'fa-file' }
      ];
    }
    if (isVendor) {
      return [
        { name: 'Inventory', path: '/vendor/inventory', icon: 'fa-box' },
        { name: 'Orders', path: '/vendor/orders', icon: 'fa-shopping-cart' },
        { name: 'Quotes', path: '/vendor/quotes', icon: 'fa-file-invoice-dollar' }
      ];
    }
    if (isSubcontractor) {
      return [
        { name: 'Available Projects', path: '/subcontractor/projects', icon: 'fa-briefcase' },
        { name: 'My Bids', path: '/subcontractor/bids', icon: 'fa-gavel' },
        { name: 'Schedule', path: '/subcontractor/schedule', icon: 'fa-calendar' }
      ];
    }
    if (isCustomer) {
      return [
        { name: 'My Projects', path: '/customer/projects', icon: 'fa-home' },
        { name: 'Contractors', path: '/customer/contractors', icon: 'fa-hard-hat' },
        { name: 'Reviews', path: '/customer/reviews', icon: 'fa-star' }
      ];
    }
    return [];
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:flex-shrink-0`}>
        <div className="fixed inset-y-0 flex flex-col w-64">
          {/* Sidebar component */}
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-indigo-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold text-white">Blueprint</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {getNavItems().map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="group flex items-center px-2 py-2 text-sm leading-6 font-medium rounded-md text-white hover:bg-indigo-600"
                >
                  <i className={`fas ${item.icon} mr-3 h-6 w-6`}></i>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Search bar can be added here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Language toggle */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Change language</span>
                <i className="fas fa-globe"></i>
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-2">{user?.firstName} {user?.lastName}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">Logout</span>
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
