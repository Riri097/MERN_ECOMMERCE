import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetOrderDetailsQuery, useDeliverOrderMutation } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader'; 
import Message from '../../components/Message'; 

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <Loader /> // ✅ Use Loader here
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message> // ✅ Use Message here
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Order ID: {order._id}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Shipping Status */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Shipping</h2>
                <p className="mb-2 text-gray-600 dark:text-gray-300">
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p className="mb-2 text-gray-600 dark:text-gray-300">
                  <strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500 hover:underline">{order.user.email}</a>
                </p>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  <strong>Address: </strong>
                  {order.shippingAddress}
                </p>
                
                {order.isDelivered ? (
                  <Message variant="success">Delivered on {order.deliveredAt.substring(0, 10)}</Message>
                ) : (
                  <Message variant="danger">Not Delivered</Message>
                )}
              </div>

              {/* Payment Status */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Payment Method</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  <strong>Method: </strong> {order.paymentMethod}
                </p>
                
                {/* ✅ Use Message for Status */}
                {order.isPaid ? (
                  <Message variant="success">Paid on {order.paidAt.substring(0, 10)}</Message>
                ) : (
                  <Message variant="danger">Not Paid</Message>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Order Items</h2>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 dark:border-gray-700 last:border-0">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline dark:text-blue-400">
                          {item.name}
                        </Link>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-4">
                <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Order Summary</h2>
                
                <div className="space-y-3 text-gray-600 dark:text-gray-300 border-b pb-4 dark:border-gray-700">
                  <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice}</span></div>
                  {/* ✅ TAX ROW REMOVED */}
                </div>

                {/* MARK AS DELIVERED BUTTON (Admin Only) */}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors"
                      onClick={deliverHandler}
                      disabled={loadingDeliver}
                    >
                      {loadingDeliver ? 'Loading...' : 'Mark As Delivered'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>    </>
  )}
</div>
);
};

export default OrderScreen;