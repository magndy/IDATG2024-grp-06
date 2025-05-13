// src/pages/MyOrdersPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { OrderFromDB, OrderStatusMap } from '../data/models'; // Import types and map
import { fetchUserOrders } from '../services/apiService'; // Import the new service function

const MyOrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<OrderFromDB[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt to fetch orders if there's a logged-in user
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      setOrders([]); // Clear previous orders

      const loadOrders = async () => {
        try {
          const data = await fetchUserOrders();
          // In a real app, the API would filter by currentUser.id.
          // For mock, we'll filter client-side or assume the mock file is user-specific.
          // For this example, let's assume user-orders.json contains orders for the "logged-in" mock user
          // or all orders if user_id is null (guest orders visible to anyone for now).
          // If your mock User has an ID, you could filter here:
          // const userSpecificOrders = data.filter(order => order.user_id === currentUser.id || order.user_id === null);
          // setOrders(userSpecificOrders);
          setOrders(data); // Using all orders from the mock file for now
        } catch (e) {
          console.error("Error fetching orders:", e);
          setError(e instanceof Error ? e.message : "Could not load your orders.");
        } finally {
          setIsLoading(false);
        }
      };

      loadOrders();
    } else {
      // If no user, ensure orders are cleared and not loading
      setOrders([]);
      setIsLoading(false);
    }
  }, [currentUser]); // Re-fetch if the currentUser changes

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <p className="mb-4">Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to view your order history.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading your orders...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.order_id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex flex-wrap justify-between items-center mb-3 pb-3 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-indigo-700">Order #{order.order_id}</h2>
                  <p className="text-xs text-gray-500">Placed on: {new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  OrderStatusMap[order.order_status_id] === 'Delivered' ? 'bg-green-100 text-green-700' :
                  OrderStatusMap[order.order_status_id] === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                  OrderStatusMap[order.order_status_id] === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                  OrderStatusMap[order.order_status_id] === 'Confirmed' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700' // Default for other statuses like Cancelled
                }`}>
                  {OrderStatusMap[order.order_status_id] || 'Unknown Status'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <p><span className="font-medium text-gray-900">Total Amount:</span> USD {order.total_amount.toFixed(2)}</p>
                <p><span className="font-medium text-gray-900">Items:</span> {order.itemCount || 'N/A'}</p>
                {order.tracking_number && (
                  <p><span className="font-medium text-gray-900">Tracking:</span> {order.tracking_number}</p>
                )}
                {/* <p><span className="font-medium text-gray-900">Address ID:</span> {order.shipping_address_id}</p> */}
              </div>
              {/* <div className="mt-4">
                <Link to={`/my-orders/${order.order_id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                  View Details &rarr;
                </Link>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;