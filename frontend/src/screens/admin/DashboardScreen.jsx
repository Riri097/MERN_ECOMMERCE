import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaBox, 
  FaClipboardList, 
  FaDollarSign, 
  FaArrowRight, 
  FaExclamationTriangle,
  FaPlus
} from 'react-icons/fa';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';

const DashboardScreen = () => {
  const { data: usersData, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({ pageNumber: 1 });
  const { data: ordersData, isLoading: loadingOrders } = useGetOrdersQuery();

  if (loadingUsers || loadingProducts || loadingOrders) return <Loader />;

  const usersCount = Array.isArray(usersData) ? usersData.length : usersData?.users?.length || 0;
  const productsCount = productsData?.products?.length || 0;

  const ordersArray = ordersData?.orders || [];
  const ordersCount = ordersData?.ordersCount || ordersArray.length;
  const totalSales = ordersArray.reduce(
    (acc, order) => acc + (order.isPaid ? order.totalPrice : 0),
    0
  );

  const recentOrders = [...ordersArray]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7);

  const lowStockProducts = productsData?.products?.filter(p => p.countInStock <= 5) || [];

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <Link to="/admin/product/create" className="mt-4 md:mt-0 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-gray-200">
          <FaPlus size={12} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={FaDollarSign} title="Revenue" value={`$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="bg-green-500" />
        <StatCard icon={FaClipboardList} title="Orders" value={ordersCount} color="bg-blue-500" />
        <StatCard icon={FaBox} title="Products" value={productsCount} color="bg-orange-500" />
        <StatCard icon={FaUsers} title="Customers" value={usersCount} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orderlist" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1">
              View All <FaArrowRight size={10} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b dark:border-gray-700">
                  <th className="pb-3 pl-2">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="4" className="py-4 text-center text-gray-500">No orders yet.</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order._id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-950/50 transition-colors">
                      <td className="py-4 pl-2 font-medium text-gray-800 dark:text-gray-200">
                        {order.user?.name || 'Guest'} 
                        <div className="text-xs text-gray-500">#{order._id.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 text-gray-500 dark:text-gray-400">{order.createdAt?.substring(0,10)}</td>
                      <td className="py-4 font-bold text-gray-800 dark:text-white">${order.totalPrice}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" /> Low Stock Items
            </h2>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <div className="text-gray-500 text-sm italic">Inventory looks good!</div>
              ) : (
                lowStockProducts.map(p => (
                  <div key={p._id} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-red-600 font-bold">Only {p.countInStock} Left!</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {lowStockProducts.length > 0 && (
              <Link to="/admin/productlist" className="block mt-4 text-center text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition">
                Manage Inventory
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-2 transition-transform hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-full ${color} text-white`}>
          <Icon size={22} />
        </div>
        <span className="text-md font-semibold text-gray-800 dark:text-white">{title}</span>
      </div>
      <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
    </div>
  );
};

export default DashboardScreen;
