import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const VendorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Products', value: '156', icon: 'fa-box' },
    { name: 'Active Orders', value: '23', icon: 'fa-shopping-cart' },
    { name: 'Pending Quotes', value: '8', icon: 'fa-file-invoice-dollar' },
    { name: 'Low Stock Items', value: '12', icon: 'fa-exclamation-triangle' }
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

          {/* Inventory Overview */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Overview</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <i className="fas fa-plus mr-2"></i>
                  Add Product
                </button>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: 'Lumber 2x4', stock: 250, price: '$8.99', status: 'In Stock' },
                        { name: 'Drywall Sheets', stock: 45, price: '$15.99', status: 'Low Stock' },
                        { name: 'Paint - White', stock: 12, price: '$29.99', status: 'Critical' },
                      ].map((product, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock} units</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                                product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {[
                    { contractor: 'ABC Construction', items: 5, total: '$1,250', status: 'Processing' },
                    { contractor: 'XYZ Builders', items: 3, total: '$890', status: 'Shipped' },
                    { contractor: 'City Renovations', items: 8, total: '$2,340', status: 'Delivered' },
                  ].map((order, i) => (
                    <div key={i} className="bg-white shadow rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{order.contractor}</h4>
                          <p className="text-sm text-gray-500">{order.items} items · {order.total}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full 
                          ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                          {order.status}
                        </span>
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

export default VendorDashboard;
