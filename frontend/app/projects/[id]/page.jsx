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
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState([]);
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
  }, []);

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
        toast.success("Product deleted ");

    } catch (error) {
       console.error("Error logging out:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
    }
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
      <div className="flex justify-center items-center mt-10 ">
        <div
          className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
            <div className="mb-1">
              <p className="font-bold text-xl text-gray-700">{project?.name}</p>
              <p className="text-green-600 mt-1">{project?.description}</p>
            </div>

            <div className="mb-1 flex items-center space-x-2">
              <Priority priority={ project?.priority} />
              <p className="lg:text-lg text-gray-600">{project?.priority} priority</p>
            </div>
            <hr/>

            <div className="mt-1">
              <p className="lg:text-lg text-orange-600 font-semibold">Status: { project?.status}</p>
              <p className="text-gray-600 lg:text-lg">
                Assigned to: <span className="font-semibold">{ project?.team?.name || 'Unassigned'}</span>
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

            <div className='flex justify-center'>
                {userInfo?.role !== 'user' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(`/projects/edit/${id}`)}>
                    Edit Project
                </button>

                )}
                
                {userInfo?.role === 'admin' && (
                    <button className="bg-red-600 text-white px-4 py-2 rounded-md ml-4" onClick={handleDelete}>
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
