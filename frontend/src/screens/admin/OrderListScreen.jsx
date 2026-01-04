import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Orders</h1>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error?.data?.message || error.error}</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                {/* REMOVED ID COLUMN */}
                <th className="py-3 px-6">USER</th>
                <th className="py-3 px-6">DATE</th>
                <th className="py-3 px-6">TOTAL</th>
                <th className="py-3 px-6">PAID</th>
                <th className="py-3 px-6">DELIVERED</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  {/* REMOVED ID CELL */}
                  <td className="py-3 px-6">{order.user && order.user.name}</td>
                  <td className="py-3 px-6">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-3 px-6">${order.totalPrice}</td>
                  <td className="py-3 px-6">
                    {order.isPaid ? (
                      <span className="text-green-500">{order.paidAt.substring(0, 10)}</span>
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {order.isDelivered ? (
                      <span className="text-green-500">{order.deliveredAt.substring(0, 10)}</span>
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-6">
                    <Link to={`/order/${order._id}`} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-xs">
                      Details
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

export default OrderListScreen;