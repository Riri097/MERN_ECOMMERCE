import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';

const OrderListScreen = () => {
  const [page, setPage] = useState(1);
  const pageSize = 7; // show 7 orders per page

  const { data, isLoading, error } = useGetOrdersQuery({ pageNumber: page, pageSize });

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-950 dark:text-white">Orders</h1>

      {error ? (
        <div className="text-red-500">{error?.data?.message || error.error}</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-950 rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 uppercase text-sm">
                  <th className="py-3 px-6">USER</th>
                  <th className="py-3 px-6">DATE</th>
                  <th className="py-3 px-6">TOTAL</th>
                  <th className="py-3 px-6">PAID</th>
                  <th className="py-3 px-6">DELIVERED</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-200 text-sm">
                {data.orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  data.orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <td className="py-3 px-6">{order.user?.name || '—'}</td>
                      <td className="py-3 px-6">{order.createdAt?.substring(0, 10)}</td>
                      <td className="py-3 px-6">${order.totalPrice}</td>
                      <td className="py-3 px-6">
                        {order.isPaid ? (
                          <span className="text-green-500">{order.paidAt?.substring(0, 10)}</span>
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {order.isDelivered ? (
                          <span className="text-green-500">{order.deliveredAt?.substring(0, 10)}</span>
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <Link
                          to={`/order/${order._id}`}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-xs"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Paginate
            pages={data.pages}
            page={data.page}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
};

export default OrderListScreen;
