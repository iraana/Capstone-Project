import { useState } from 'react';

export const Orderspage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const mockOrders = [
    {
      id: '1',
      displayId: '#1001',
      date: 'February 2, 2025',
      time: '2:30 PM',
      status: 'completed',
      total: 18.0,
      items: [
        {
          id: '1',
          name: 'Szechuan Shrimp Stir Fry with Rice',
          price: 9.0,
          quantity: 2,
          subtotal: 18.0,
        },
      ],
    },
    {
      id: '2',
      displayId: '#1002',
      date: 'January 28, 2025',
      time: '3:45 PM',
      status: 'completed',
      total: 15.5,
      items: [
        {
          id: '2',
          name: 'Cream of Broccoli and Cheddar Soup',
          price: 6.5,
          quantity: 1,
          subtotal: 6.5,
        },
        {
          id: '3',
          name: 'Szechuan Shrimp Stir Fry with Rice',
          price: 9.0,
          quantity: 1,
          subtotal: 9.0,
        },
      ],
    },
  ];

  const activeOrders = mockOrders.filter(
    (o) => o.status === 'pending' || o.status === 'in_progress'
  );
  const completedOrders = mockOrders.filter((o) => o.status === 'completed');
  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  const getStatusStyle = (status: string) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800';
    if (status === 'completed') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    if (status === 'pending') return 'Pending';
    if (status === 'in_progress') return 'In Progress';
    if (status === 'completed') return 'Completed';
    return 'Cancelled';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your Gourmet2Go orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-2 mb-8 inline-flex space-x-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'active' ? 'bg-sault-blue text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span className="ml-2 bg-sault-green text-white text-xs font-bold rounded-full px-2 py-0.5">
                {activeOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'history' ? 'bg-sault-blue text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Order History
          </button>
        </div>

        {activeTab === 'active' && activeOrders.length > 0 && (
          <div className="mb-6 bg-blue-50 border-l-4 border-sault-blue p-4 rounded-r-lg">
            <div className="flex items-center">
              <span className="text-sault-blue mr-3 text-xl shrink-0">ℹ️</span>
              <p className="text-sm text-blue-800">
                Orders can be canceled or altered until cutoff time.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {displayOrders.length > 0 ? (
            displayOrders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const totalWithTax = order.total * 1.13;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                        Order {order.displayId}
                      </h3>
                      <p className="text-sm text-gray-600">{order.date} at {order.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {(isExpanded ? order.items : order.items.slice(0, 2)).map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">🍽️</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    {!isExpanded && order.items.length > 2 && (
                      <p className="text-sm text-gray-500">
                        + {order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-lg">Total</span>
                        <span className="font-display font-bold text-lg text-sault-blue">
                          ${totalWithTax.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 text-right mt-1">Includes 13% HST</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200"
                    >
                      {isExpanded ? 'Show Less' : 'View Details'}
                    </button>
                    {activeTab === 'history' && (
                      <button className="flex-1 bg-sault-green text-white py-2 px-4 rounded-md font-medium hover:bg-sault-green-dark">
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-8xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'active' ? 'No active orders' : 'No order history'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'active' ? "You don't have any active orders." : "You haven't placed any orders yet."}
              </p>
              {activeTab === 'active' && (
                <a href="/menu" className="inline-block bg-sault-blue text-white px-6 py-3 rounded-md font-medium hover:bg-sault-blue-dark">
                  Browse Menu
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};