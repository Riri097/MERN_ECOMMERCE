import { FaUsers, FaBox, FaClipboardList, FaDollarSign } from 'react-icons/fa';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetProductsQuery } from '../../slices/productsApiSlice';

const DashboardScreen = () => {
  const { data: usersData } = useGetUsersQuery({});
  const { data: productsData } = useGetProductsQuery({});
  
  const ordersCount = 0; 
  const totalSales = 0;

  const usersCount = usersData?.users?.length || 0;
  const productsCount = productsData?.products?.length || 0;

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm uppercase font-bold">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full text-white`} style={{ backgroundColor: color }}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Sales" value={`$${totalSales}`} icon={FaDollarSign} color="#10B981" />
        <Card title="Total Orders" value={ordersCount} icon={FaClipboardList} color="#3B82F6" />
        <Card title="Total Products" value={productsCount} icon={FaBox} color="#F59E0B" />
        <Card title="Total Users" value={usersCount} icon={FaUsers} color="#8B5CF6" />
      </div>

      <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 dark:text-white">System Status</h2>
        <p className="text-gray-600 dark:text-gray-300">System is running smoothly. Database connected.</p>
      </div>
    </div>
  );
};

export default DashboardScreen;