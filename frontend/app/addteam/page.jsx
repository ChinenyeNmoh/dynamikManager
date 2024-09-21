'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import SlideBar from '@/components/SlideBar';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [name, setName] = useState('');
  const router = useRouter();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/users/users`, {
          withCredentials: true,
        });
        setUsers(response?.data?.users);
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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/projects`, {
          withCredentials: true,
        });
        setProjects(response?.data?.projects);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectChange = (e) => {
    const { value, checked } = e.target;
    setSelectedProjects(prev =>
      checked ? [...prev, value] : prev.filter(projectId => projectId !== value)
    );
  };

  const handleMemberChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMembers(prev =>
      checked ? [...prev, value] : prev.filter(memberId => memberId !== value)
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post('https://dynamikmanager.dynamikservices.tech/api/teams', {
            name,
            projects: selectedProjects,
            members: selectedMembers
          }, {
            withCredentials: true,
          });
        console.log(data);
        toast.success('Task created successfully!');
        router.push(`/teams/${data.team._id}`);
    } catch (error) {
        console.error(error?.response?.data?.message || 'Something went wrong');
        toast.error(error?.response?.data?.message || 'Something went wrong');
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
          <div className="text-center text-xl font-bold mb-4">Add New Team</div>

          {/* Task Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              required
            />
          </div>

          {/* Projects Selection */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Projects</label>
            <div className="flex flex-col space-y-2">
              {projects.map((proj) => (
                <div key={proj._id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={proj._id}
                    checked={selectedProjects.includes(proj._id)}
                    onChange={handleProjectChange}
                    className="mr-2"
                  />
                  <label>{proj.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Members Selection */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Members</label>
            <div className="flex flex-col space-y-2">
              {users.map((user) => (
                <div key={user._id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedMembers.includes(user._id)}
                    onChange={handleMemberChange}
                    className="mr-2"
                  />
                  <label>{user.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg block mx-auto"
            >
              Create team
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
