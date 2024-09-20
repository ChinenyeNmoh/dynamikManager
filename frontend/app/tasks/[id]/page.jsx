'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import Priority from '@/components/Priority';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Header from '@/components/Header';
import SlideBar from '@/components/SlideBar';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const router = useRouter();
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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/tasks/${id}`,
            {
                withCredentials: true,
            }
        );
        setTask(response.data.task);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    // Call fetchTask when id changes
    if (id) {
      fetchTask();
    }
  }, [id]); 
  console.log(task);


  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/users/users`,
            {
                withCredentials: true,
            }
        );
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 


  
const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This task will be deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F8444F",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete"
});

if (result.isConfirmed) {
    try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, { withCredentials: true });
        
        toast.success("Task deleted ");
        router.push("/alltasks");

    } catch (error) {
       console.error("Error logging out:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
    }
}
};
// Check if the due date is within 24 hours
const isDueSoon = task?.dueDate && new Date(task.dueDate) - new Date() <= 24 * 60 * 60 * 1000;
console.log('task id', task?.assignedTo?._id, userInfo?._id);

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
        <div
          className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
            <div className="mb-1">
              <p className="font-bold text-xl text-gray-700"><span className='font-extrabold'>Title: </span>{task?.title}</p>
              <p className="text-green-600 mt-1"><span className='font-extrabold text-gray-600'>Project: </span>{task?.project?.name}</p>
              
            </div>

            <hr />

            <p className="text-green-600 mt-1"><strong className='text-gray-600'>Description:</strong>  {task?.description}</p>
            <div className="mb-1 flex items-center space-x-2">
              <Priority priority={ task?.priority} />
              <p className="text-lg text-gray-600">{task?.priority} priority</p>
            </div>
            <hr/>

            <div className="mt-1">
              <p className="text-lg text-orange-600 font-semibold mb-2">Status: { task?.status}</p>
              <p className={`text-lg mb-2 font-semibold ${isDueSoon ? 'text-red-600' : 'text-green-600'}`}>
                Due Date: {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not Set'}
              </p>
              <p className="text-gray-600 text-lg mb-2">
                Assigned to: <span className="font-semibold">{ task?.assignedTo?.name || 'Unassigned'}</span>
              </p>
            </div>
            
            <hr />
            <p>Created By: {task?.createdBy?.name}</p>

            <hr />

            <div className='flex justify-center'>
                {( task?.assignedTo?._id === userInfo?._id || userInfo?.role === 'admin' || userInfo?.role === 'manager' ) && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(`/tasks/edit/${id}`)}>
                    Edit Task
                </button>

                )}
                
                {userInfo?.role === 'admin' && (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md ml-4" onClick={handleDelete}>
                    Delete Task
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
