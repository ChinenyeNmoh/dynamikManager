import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import Search from './Search';
import { useRouter, usePathname } from 'next/navigation';

const TaskSort = ({ projects = [], teams = [] , tasks = [], projectStatus=[] }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname', pathname);

  // Navigate based on selected filters
  useEffect(() => {
    const query = new URLSearchParams();
    if (selectedStatus.trim()) query.set('status', selectedStatus.trim());
    if (selectedProject.trim()) query.set('project', selectedProject.trim());
    if (selectedTeam.trim()) query.set('team', selectedTeam.trim());

    // Navigate to the updated URL
    router.push(`${pathname}?${query.toString()}`);
  }, [selectedStatus, selectedProject, selectedTeam, pathname, router]);

  const [userInfo, setUserInfo] = useState(null);

  // Fetch userInfo from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);
 
  //Get unique task status
const uniqueStatuses = [...new Set(tasks.map((task) => task?.status))];

const uniqueProjectsStatus = [...new Set(projectStatus.map((stat) => stat?.status))];



  return (
    <div className="mb-6 p-4 border border-solid border-black rounded-lg shadow-md">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 mb-4">
        {/* Sort by Status */}
        {projectStatus?.length > 0 && (
          <div className="px-2 w-full lg:w-auto">
          <label htmlFor="status" className="block text-gray-700 font-semibold text-sm">Status</label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 bg-inherit border-blue-500 border-solid border-2 p-3 text-sm"
          >
            <option value="">All Status</option>
{uniqueStatuses?.length > 0 ? 
  uniqueStatuses?.map((status, index) => (
    <option key={index} value={status}>{status}</option>
  )) :
  (uniqueProjectsStatus?.map((status, index) => (
    <option key={index} value={status}>{status}</option>
  ))) 
}

            
          </select>
        </div>

        )}
        

        {/* Sort by Project */}
        {projects?.length > 0 && (
          <div className="px-2 w-full lg:w-auto">
          <label htmlFor="project" className="block text-gray-700 font-semibold text-sm">Project</label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-1 block w-full p-3 rounded-md shadow-sm focus:ring focus:ring-opacity-50 bg-inherit border-blue-500 border-solid border-2 text-sm"
          >
            <option value="">All Projects</option>
            {projects?.map((project) => (
              <option key={project?._id} value={project?._id}>{project?.name}</option>
            ))}
          </select>
        </div>
          
        )}
        

        {/* Sort by Team */}
        <div className="px-2 w-full lg:w-auto">
          <label htmlFor="team" className="block text-gray-700 font-semibold text-sm">Team</label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mt-1 block w-full p-3 rounded-md shadow-sm focus:ring focus:ring-opacity-50 bg-inherit border-blue-500 border-solid border-2 text-sm"
          >
            <option value="">All Teams</option>
            {teams?.map((team) => (
              <option key={team?._id} value={team?._id}>{team?.name}</option>
            ))}
          </select>
        </div>

        {/* Search bar */}
        <div className="px-2 lg:flex-1">
          <Search />
        </div>

        {/* Admin buttons */}
        {userInfo?.role !== 'user' && (
          <div className="flex flex-col sm:flex-row justify-start items-center gap-3 mt-5 lg:mt-0">
            {(pathname === '/alltasks') && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 mt-3"
                onClick={() => router.push('/addtask')}
              >
                <IoMdAdd className='text-white text-lg' />
                <p className='text-white text-lg'>Add Task</p>
              </button>
            )}
            {(pathname === '/allprojects') && (
              <button
              onClick={() => router.push('/addproject')}
                className="bg-orange-500 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 mt-3"
              >
                <IoMdAdd className='text-white text-lg' />
                <p className='text-white text-lg'>Add Project</p>
              </button>
            )}
            {(pathname === '/allteams') && (
              <button
              onClick={() => router.push('/addteam')}
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <IoMdAdd className='text-white text-lg' />
                <p className='text-white text-lg'>Create Team</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSort;
