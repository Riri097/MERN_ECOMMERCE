import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaCheck, FaTimes, FaSearch, FaEdit } from 'react-icons/fa';
import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import Paginate from '../../components/Paginate';

const UserListScreen = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, refetch, isLoading, error } = useGetUsersQuery({ keyword, pageNumber });
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchTerm);
    setPageNumber(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
        
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-l-lg focus:outline-none dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700">
            <FaSearch />
          </button>
        </form>
      </div>

      {loadingDelete && <p className="text-red-500">Deleting...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error?.data?.message}</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">NAME</th>
                  <th className="py-3 px-6 text-left">EMAIL</th>
                  <th className="py-3 px-6 text-center">ADMIN</th>
                  <th className="py-3 px-6 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                {data.users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="py-3 px-6 text-left font-medium">{user.name}</td>
                    <td className="py-3 px-6 text-left">
                      <a href={`mailto:${user.email}`} className="text-blue-500">
                        {user.email}
                      </a>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {user.role === 'admin' ? (
                        <FaCheck className="text-green-500 mx-auto" />
                      ) : (
                        <FaTimes className="text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-6 text-center flex justify-center items-center space-x-4">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </Link>

                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginate pages={data.pages} page={data.page} setPage={setPageNumber} />
        </>
      )}
    </div>
  );
};

export default UserListScreen;
