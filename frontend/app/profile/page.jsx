'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { IoMdMail } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Header from '@/components/Header';
import { GiRank2 } from "react-icons/gi";
import SlideBar from '@/components/SlideBar';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [taskData, setTaskData] = useState([]); 
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  const url =  `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, { withCredentials: true });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
          withCredentials: true,
        });
        setTaskData(data.tasks);
        setLoading(false);
      } catch (error) {
        console.log('error', error.message);
        setLoading(false);
      }
    };
    fetchTask();
  }, []);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This team will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F8444F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, { withCredentials: true });
        toast.success("User deleted");
        router.push("/dashboard");
      } catch (error) {
        console.error("Error logging out:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    }
  };

  const canEdit = userInfo?._id === user?._id || userInfo?.role === 'admin';
  console.log(canEdit);
 
  // Filter tasks assigned to the user
  const assignedTasks = taskData?.filter(task => task?.assignedTo?._id === user?._id);
  console.log(assignedTasks);

  return (
    <>
      <div className='flex w-full h-auto p-3'>
        <div>
          <SlideBar />
        </div>
        <main className="w-full h-full mb-10 m-2">
          <Header />
          {loading && <LoadingPage />}
          <div className="flex justify-center items-center mt-10">
          <div className="w-full max-w-4xl bg-white p-6 lg:p-8 rounded-lg shadow-lg space-y-6">
              
              {/* User Info Section */}
              <h1 className="text-lg sm:text-2xl font-bold text-gray-700 text-center">User Info</h1>
      
              {/* User Name Section */}
              <div className="flex items-center mb-4 space-x-4">
                <CiUser className="text-3xl sm:text-4xl text-blue-600" />
                <div>
                  <p className="font-bold text-md sm:text-xl text-gray-700">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">User Name</p>
                </div>
              </div>

              {/* Email Section */}
              <div className="flex items-center mb-4 space-x-4">
                <IoMdMail className="text-3xl sm:text-4xl text-red-700" />
                <div>
                  <p className="font-bold text-md sm:text-xl text-gray-700">{user?.email}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                </div>
              </div>

              {/* Role Section */}
              <div className="flex items-center mb-4 space-x-4">
                <GiRank2 className="text-3xl sm:text-4xl text-green-800" />
                <div>
                  <p className="font-bold text-md sm:text-xl text-gray-700">{user?.role}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Role</p>
                </div>
              </div>

              <hr />

              {/* Assigned Tasks Table */}
              <div className="mt-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700 text-center mb-4">Assigned Tasks</h2>
                {assignedTasks.length > 0 ? (
                  <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-left text-sm sm:text-md">
                  <thead>
                    <tr className="text-left bg-gray-200">
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Priority</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedTasks.map(task => (
                        <tr key={task._id} className="border-t">
                          <td className="px-4 py-2">{task.title}</td>
                          <td className="px-4 py-2">{task.priority}</td>
                          <td className="px-4 py-2">{task.status}</td>
                          <td className="px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                          <td className="py-2 px-4">
                            <Link href={`/tasks/${task._id}`} className="text-blue-500 hover:underline">
                              View Task
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No tasks assigned to this user.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex justify-center'>
                { canEdit && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(`/profile/edit/${user._id}`)}>
                    Edit Profile
                  </button>
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
