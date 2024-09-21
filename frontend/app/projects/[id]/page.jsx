'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SlideBar from '@/components/SlideBar';
import Pagination from '@/components/Pagination';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 4;

  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  const url = `https://dynamikmanager.dynamikservices.tech/api/users/users`;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, { withCredentials: true });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Pagination Logic
  const indexOfLastUser = page * limit;
  const indexOfFirstUser = indexOfLastUser - limit;
  const currentDisplay = users?.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full h-auto p-3 lg:p-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
          <SlideBar />
        </div>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 h-full mb-10 m-2">
          <Header />
          {loading && <LoadingPage />}
          <div className="flex justify-center items-center mt-10">
            <div className="max-w-5xl w-full bg-white p-6 sm:p-8 rounded-lg shadow-lg space-y-6">
              {/* Users Table */}
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700 text-center mb-4">User List</h2>
                <div className="overflow-x-auto">
                  {users?.length > 0 ? (
                    <table className="min-w-full table-auto text-left text-sm sm:text-md">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDisplay?.map((user) => (
                          <tr key={user._id} className="border-t">
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.role}</td>
                            <td className="px-4 py-2">
                              <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={() => router.push(`/profile/${user._id}`)}
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center text-gray-500">No users found.</p>
                  )}
                </div>

                {/* Pagination Component */}
                {Math.ceil(users?.length / limit) > 1 && (
                  <Pagination
                    totalItems={users?.length}
                    itemsPerPage={limit}
                    currentPage={page}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
