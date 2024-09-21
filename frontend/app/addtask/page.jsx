'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import SlideBar from '@/components/SlideBar';
import Header from '@/components/Header';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState();
  const router = useRouter();
  const [priority, setPriority] = useState();
  const [status, setStatus] = useState();
  const [dueDate, setDueDate] = useState();
  const [description, setDescription] = useState();
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState();

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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/projects`, {
          withCredentials: true,
        });
        setProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  console.log(users, projects);

 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://dynamikmanager.dynamikservices.tech/api/tasks', {
        title: taskTitle,
        description,
        dueDate,
        priority,
        status,
        assignedTo,
        project,
      }, {
        withCredentials: true,
      });
      router.push(`/tasks/${data.savedTask._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred while creating the task');
      console.error(error);
    }
  };

  return (
    <>
      <div className='flex w-full h-auto p-3'>
        <SlideBar />
        <main className="w-full h-full mb-10 m-2">
          <Header />
          {loading && <LoadingPage />}
          <div className="flex justify-center items-center mt-10">
            <form
              className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6"
              onSubmit={handleFormSubmit}
            >
              <div className="text-center text-xl font-bold mb-4">Add New Task</div>
              {/* Task Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full border p-2 rounded-lg text-gray-700"
                  required
                />
              </div>

              {/* Project Selection */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-gray-700">Add Project</label>
                <select
                  name="project"
                  value={project || ''}
                  required
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full border p-2 rounded-lg text-gray-700"
                >
                  <option value="">Select Project</option>
                  {projects.map((proj) => (
                    <option key={proj?._id} value={proj?._id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-2">
                <label className="block text-sm font-bold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full border p-2 rounded-lg text-gray-700"
                ></textarea>
              </div>

              {/* Priority, Status, Due Date, Assigned To */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={priority || ''}
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
                    value={status || ''}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border p-2 rounded-lg text-gray-700"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="to-do">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={dueDate || ''}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border p-2 rounded-lg text-gray-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700">Assigned To</label>
                  <select
                    name="assignedTo"
                    value={assignedTo || ''}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full border p-2 rounded-lg text-gray-700"
                    required
                  >
                    <option value="">Select user</option>
                    {project?.team?.members.map((member) => (
                      <option key={member?._id} value={member?._id}>
                        {member?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg block mx-auto"
                >
                  Add Task
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
