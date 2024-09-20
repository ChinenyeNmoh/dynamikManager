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
  const [project, setProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  
  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          withCredentials: true,
        });
        setProject(response.data.project);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  console.log(project);

  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  // Populate form with project data
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setPriority(project.priority);
      setStatus(project.status);
      setSelectedTeam(project.team._id); 
    }
  }, [project]);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/teams', {
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
      const { data } = await axios.put(`http://localhost:5000/api/projects/${id}`, {
        name,
        description,
        priority,
        status,
        team: selectedTeam, 
      }, {
        withCredentials: true,
      });
      console.log(data);
      toast.success('Project updated successfully!');
      router.push(`/projects/${id}`);
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
          <div className="text-center text-xl font-bold mb-4">Update Project</div>
          
          {/* Project Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded-lg text-gray-700"
              
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
             
            >
              <option value="">{project?.team?.name}</option>
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
              Update Project
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
