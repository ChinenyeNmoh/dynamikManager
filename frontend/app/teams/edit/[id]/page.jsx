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
  const [projectsData, setProjectsData] = useState([]); // Projects data from API
  const [team, setTeam] = useState({});
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]); // All users data from API
  const [members, setMembers] = useState([]); // Selected members for the team
  const [projects, setProjects] = useState([]); // Selected projects for the team
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  // Fetch projects and users for selection
  useEffect(() => {
    const fetchProjectsAndUsers = async () => {
      try {
        setLoading(true);
        const [projectsResponse, usersResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/users`, { withCredentials: true }),
        ]);
        setProjectsData(projectsResponse.data.projects);
        setUsers(usersResponse.data.users);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch projects and users');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsAndUsers();
  }, []);
  
  // Fetch team details
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teams/${id}`, {
          withCredentials: true,
        });
        const teamData = response.data.team;
        setTeam(teamData);
        setName(teamData.name);
        setProjects(teamData.projects.map(p => p._id)); // Set selected projects
        setMembers(teamData.members.map(m => m._id)); // Set selected members
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch team');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
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

  // Handle project checkbox change
  const handleProjectChange = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.includes(projectId)
        ? prevProjects.filter((id) => id !== projectId) // Unselect if already selected
        : [...prevProjects, projectId] // Select if not selected
    );
  };

  // Handle member checkbox change
  const handleMemberChange = (memberId) => {
    setMembers((prevMembers) =>
      prevMembers.includes(memberId)
        ? prevMembers.filter((id) => id !== memberId) 
        : [...prevMembers, memberId] 
    );
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${id}`,
        { name, projects, members },
        { withCredentials: true }
      );
      toast.success('Team updated successfully!');
      router.push(`/teams/${id}`);
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
          <div className="text-center text-xl font-bold mb-4">Edit Team</div>

          {/* Team Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700">Team Name</label>
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
              {projectsData.map((proj) => (
                <div key={proj._id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={proj._id}
                    checked={projects.includes(proj._id)}
                    onChange={() => handleProjectChange(proj._id)}
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
                    checked={members.includes(user._id)}
                    onChange={() => handleMemberChange(user._id)}
                    className="mr-2"
                  />
                  <label>{user.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg block mx-auto"
            >
              Update Team
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
