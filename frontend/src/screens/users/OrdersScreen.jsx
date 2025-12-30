import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import { Link } from 'react-router-dom';

const OrdersScreen = () => {
  const { data: orders, isLoading, isError, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">My Orders</h1>

      {isLoading ? (
        <div className="text-lg dark:text-white">Loading orders...</div>
      ) : isError ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error?.data?.message || 'Failed to fetch orders'}
        </div>
      ) : orders && orders.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          You have no orders yet. <Link to="/" className="font-bold underline">Shop Now</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col md:flex-row items-center justify-between border-b dark:border-gray-700 p-4 last:border-b-0"
            >
              <div className="flex-1">
                <div className="text-gray-800 dark:text-white font-bold">
                  Order ID: {order._id}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Total: ${order.totalPrice.toFixed(2)}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Status: {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <Link
                to={`/order/${order._id}`}
                className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
