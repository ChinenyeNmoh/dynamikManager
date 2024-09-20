'use client'
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
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const url = `http://localhost:5000/api/users/${id}`;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          withCredentials: true,
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUser();
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

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, role },
        {
          withCredentials: true,
        }
      );
      toast.success('User updated successfully!');
      router.push(`/profile`);
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

      <div className="flex justify-center items-center mt-10 ">
        <form
          className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
          onSubmit={handleFormSubmit}
        >
          <div className="text-center text-xl font-bold mb-4">Update User</div>

          {/* Name (full width) */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
            />
          </div>

          {/* Email and Role (grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded-lg text-gray-700"
                disabled={true} // Always disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border p-2 rounded-lg text-gray-700"
                disabled={userInfo?.role !== 'admin'} // Disable for non-admins
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg block mx-auto"
            >
              Update User
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
