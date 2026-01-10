import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return isNaN(d) ? '—' : d.toISOString().split('T')[0];
};

const MyOrdersScreen = () => {
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        My Orders
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-sm uppercase text-gray-700 dark:text-gray-200">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-center">Paid</th>
                <th className="p-3 text-center">Delivered</th>
                <th className="p-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="p-3">
                    ${order.totalPrice}
                  </td>
                  <td className="p-3 text-center">
                    {order.isPaid ? 'Yes' : 'No'}
                  </td>
                  <td className="p-3 text-center">
                    {order.isDelivered ? 'Yes' : 'No'}
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersScreen;
