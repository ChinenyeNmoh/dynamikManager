'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Priority from '@/components/Priority';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Header from '@/components/Header';
import SlideBar from '@/components/SlideBar';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState([]);
  const router = useRouter();
  const [tasksData, setTasksData] = useState([]);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []); 

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/users/users`, {
          withCredentials: true,
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/tasks`, {
          withCredentials: true,
        });
        setTasksData(data?.tasks);
        setLoading(false);
      } catch (error) {
        console.log('error', error.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);


  // Fetch projects
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/projects/${id}`, {
          withCredentials: true,
        });
        
        setProject(response.data.project);
        console.log(project);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F8444F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://dynamikmanager.dynamikservices.tech/api/projects/${id}`, { withCredentials: true });
        router.push("/allprojects");
        toast.success("Project deleted");
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    }
  };

  const tasksToDisplay = tasksData?.filter((task) => task?.project?._id === id);

  return (
    <>
      <div className='flex w-auto lg:w-full h-auto p-3'>
        <div className=''>
          <SlideBar />
        </div>
        <main className="w-full h-full mb-10 m-2">
          <Header />

          {loading && <LoadingPage />}
          <div className="flex justify-center items-center mt-10 ">
            <div className="w-full max-w-4xl bg-white p-6 lg:p-8 rounded-lg shadow-lg space-y-6">
              <div className="mb-1">
                <p className="font-bold text-2xl text-gray-700">{project?.name}</p>
                <p className="text-green-600 mt-1">{project?.description}</p>
              </div>

              <div className="mb-1 flex items-center space-x-2">
                <Priority priority={project?.priority} />
                <p className="lg:text-lg text-gray-600">{project?.priority} priority</p>
              </div>
              <hr />

              <div className="mt-1">
                <p className="lg:text-lg text-orange-600 font-semibold">Status: {project?.status}</p>
                <p className="text-gray-600 lg:text-lg">
                  Assigned to: <span className="font-semibold">{project?.team?.name || 'Unassigned'}</span>
                </p>
              </div>

              <hr />
              <div>
                <p className="text-green-600 font-semibold mb-1">Team Members:</p>
                <ul className="pl-4 list-disc list-inside">
                  {project?.team?.members?.map((member) => (
                    <li key={member._id} className="text-gray-700 text-sm hover:text-green-500">
                      {member.name}
                    </li>
                  ))}
                </ul>
              </div>

              <hr />
              {/* Display Tasks in a Responsive Table */}
              <div className="mt-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 text-center mb-4">Tasks</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto text-left text-sm sm:text-md">
                    <thead>
                      <tr className="text-left bg-gray-200">
                        <th className="py-2 px-4">Title</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Priority</th>
                        <th className="py-2 px-4">Assigned To</th>
                        <th className="py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasksToDisplay?.map((task) => (
                        <tr key={task._id} className="border-t">
                          <td className="py-2 px-4">{task.title}</td>
                          <td className="py-2 px-4">{task.status}</td>
                          <td className="py-2 px-4">{task.priority}</td>
                          <td className="py-2 px-4">{task.assignedTo?.name || 'Unassigned'}</td>
                          <td className="py-2 px-4">
                            <Link href={`/tasks/${task._id}`} className="text-blue-500 hover:underline">
                              View Task
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {tasksToDisplay?.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-2">
                            No tasks found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='flex justify-center mt-6 flex-wrap space-y-2 lg:space-y-0 lg:space-x-4'>
                {userInfo?.role !== 'user' && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={() => router.push(`/projects/edit/${id}`)}
                  >
                    Edit Project
                  </button>
                )}
                {userInfo?.role === 'admin' && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={handleDelete}
                  >
                    Delete Project
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
