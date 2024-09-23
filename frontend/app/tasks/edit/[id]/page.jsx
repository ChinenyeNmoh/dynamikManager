'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Header from '@/components/Header';
import SlideBar from '@/components/SlideBar';

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [project, setProject] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
          withCredentials: true,
        });
        const taskData = response?.data?.task;
        setTask(taskData);
        setTitle(taskData?.title);
        setDescription(taskData?.description);
        setPriority(taskData?.priority);
        setProject(taskData?.project?._id);
        setStatus(taskData?.status);
        setDueDate(taskData?.dueDate); 
        setAssignedTo(taskData?.assignedTo?._id);
      } catch (error) {
        console.log(error.message || error.response.data.message);
        toast.error(error.message || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);
  


  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []); 

  // Fetch teams and users for selection
  useEffect(() => {
    const fetchTeamsAndUsers = async () => {
      try {
        setLoading(true);
        const [teamsResponse, usersResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/users`, { withCredentials: true }),
        ]);
        setProjects(teamsResponse.data.projects);
        setUsers(usersResponse.data.users);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch teams and users');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamsAndUsers();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo,
        project,
      }, {
        withCredentials: true,
      });
      router.push(`/tasks/${id}`);
    } catch (error) {
      console.error(error.response?.data?.message || 'Something went wrong');
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  

  return (
    <>
    <div className='flex w-full h-auto p-3'>
      <div>
        <SlideBar />
      </div>
      <main className="w-full h-full mb-10  m-2">
        <Header />
     
      {loading && <LoadingPage />}
      <div className="flex justify-center items-center mt-10">
        <form
          className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
          onSubmit={handleFormSubmit}
        >
          <div className="text-center text-xl font-bold mb-4">Update Task</div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              disabled={userInfo?.role === 'user'}
            />
          </div>

          {/* Description */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              disabled={userInfo?.role === 'user'}
            ></textarea>
          </div>
          


          {/* Priority and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Project */}
            <div>
              <label className="block text-sm font-bold text-gray-700">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full border p-2 rounded-lg text-gray-700"
                disabled={userInfo?.role === 'user'}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
              </div>
            
          {/* Due Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Due Date</label>
            <input
              type="datetime-local"
              value={dueDate ? dueDate.slice(0, 16) : ''}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              disabled={userInfo?.role === 'user'}
            />
          </div>



          {/* Assigned To */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              disabled={userInfo?.role === 'user'}
            >
              <option value="">Select User</option>
              {projects
        .find((p) => p._id === project)?.team?.members.map((member) => (
          <option key={member?._id} value={member?._id}>
            {member?.name}
          </option>
        ))}
            </select>
          </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border p-2 rounded-lg text-gray-700"
                disabled={userInfo?.role === 'user'}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border p-2 rounded-lg text-gray-700"
              >
                <option value="">Select status</option>
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg block mx-auto"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
      </main>
      </div>
    </>
  );
};

export default Page;
