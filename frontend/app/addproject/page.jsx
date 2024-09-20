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
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://dynamikmanager.dynamikservices.tech/api/teams', {
          withCredentials: true,
        });
        setTeams(response.data.teams);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://dynamikmanager.dynamikservices.tech/api/projects', {
        name,
        description,
        priority,
        status,
        team: selectedTeam, // Use selectedTeam instead of teams
      }, {
        withCredentials: true,
      });
      console.log(data);
      toast.success('Project created successfully!');
      router.push('/alltasks');
    } catch (error) {
      console.error(error.response.data.message || 'Something went wrong');
      toast.error(error.response.data.message || 'Something went wrong');
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
          <div className="text-center lg:text-xl  font-bold mb-4">Add New Project</div>
          
          {/* Project Name */}
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

          {/* Team Selection */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Team</label>
            <select
              name="teams"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              required
            >
              <option value="">Select</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border p-2 rounded-lg text-gray-700"
            ></textarea>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">Priority</label>
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
                className="w-full border p-2 rounded-lg text-gray-700"
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
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full border p-2 rounded-lg text-gray-700"
              >
                <option value="">Select status</option>
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
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
              Add Project
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
