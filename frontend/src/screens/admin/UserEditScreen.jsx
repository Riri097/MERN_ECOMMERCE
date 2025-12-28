import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserShield } from 'react-icons/fa';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
const [isAdminChecked, setIsAdminChecked] = useState(false);

  const navigate = useNavigate();

  const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdminChecked(user.role === 'admin'); 
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const role = isAdminChecked ? 'admin' : 'user';
      await updateUser({ userId, name, email, role }).unwrap();
      alert('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Link to="/admin/userlist" className="text-gray-600 hover:text-gray-900 mb-4 inline-block">
        &larr; Go Back
      </Link>
      
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Edit User</h1>

      {loadingUpdate && <p className="text-blue-500">Updating...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message || error.error}</p>
      ) : (
        <form onSubmit={submitHandler} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Is Admin Checkbox */}
          <div className="flex items-center p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdminChecked}
              onChange={(e) => setIsAdminChecked(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isAdmin" className="ml-3 flex items-center text-gray-700 dark:text-gray-200 font-medium cursor-pointer">
              <FaUserShield className="mr-2 text-blue-500" />
              Is Admin?
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Update User
          </button>
        </form>
      )}
    </div>
  );
};

export default UserEditScreen;