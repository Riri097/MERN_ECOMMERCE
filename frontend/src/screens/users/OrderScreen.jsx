import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  usePayOrderMutation, 
} from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { FaBox, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return isNaN(d) ? '—' : d.toLocaleDateString();
};

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Marked as Delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const payHandler = async () => {
    try {
      await payOrder({ orderId, details: { payer: {} } });
      refetch();
      toast.success('Order Marked as Paid');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.error}</Message>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Order <span className="text-gray-500 text-lg font-normal">#{order._id}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" /> Shipping
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <p><strong className="text-gray-800 dark:text-gray-200">Name:</strong> {order.user?.name || 'Deleted User'}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Email:</strong> {order.user?.email}</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Address:</strong> {order.shippingAddress}</p>
            </div>
            <div className="mt-4">
              {order.isDelivered ? (
                <Message variant="success">Delivered on {formatDate(order.deliveredAt)}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaCreditCard className="text-gray-400" /> Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              <strong className="text-gray-800 dark:text-gray-200">Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">Paid on {formatDate(order.paidAt)}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>

          {!userInfo.isAdmin && !order.isPaid && (
             <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm border border-yellow-200 dark:border-yellow-700">
                <strong>Status:</strong> Use the "Pay on Delivery" method or contact support to finalize payment.
             </div>
          )}

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              <FaBox className="text-gray-400" /> Order Items
            </h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {order.orderItems.map((item, index) => (
                <div key={index} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <Link 
                      to={`/product/${item.product}`}
                      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.qty} x ${item.price} = <span className="font-bold text-gray-900 dark:text-white">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-6">
            <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>
            
            <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shippingPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>

            {userInfo?.isAdmin && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Actions</p>
                {!order.isPaid && (
                  <button
                    onClick={payHandler}
                    disabled={loadingPay}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    {loadingPay ? 'Processing...' : 'Mark As Paid'}
                  </button>
                )}
                {order.isPaid && !order.isDelivered && (
                  <button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    {loadingDeliver ? 'Processing...' : 'Mark As Delivered'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
