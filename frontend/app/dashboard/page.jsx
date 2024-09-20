'use client';
import SlideBar from '@/components/SlideBar';
import Header from '@/components/Header';
import { MdPending } from "react-icons/md";
import { LuListTodo } from "react-icons/lu";
import { MdDoneAll, MdErrorOutline } from "react-icons/md";
import SummaryBox from '@/components/SummaryBox';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TaskCard from '@/components/TaskCard';

const Dashboard = () => {
  const [tasksData, setTasksData] = useState([]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('https://dynamikmanager.dynamikservices.tech/api/tasks/', {
          credentials: 'include',
          withCredentials: true,
        });
        setTasksData(data.tasks);
      } catch (error) {
        console.log('error', error.message);
      }
    };
    fetchTasks();
  }, []);
  
  const todoLength = tasksData.filter(task => task.status === 'to-do').length;
  const inProgressLength = tasksData.filter(task => task.status === 'in-progress').length;
  const completedLength = tasksData.filter(task => task.status === 'done').length; 

  const tasks = [
    { title: 'Total Task', number: tasksData.length, icon: <MdPending /> },
    { title: 'Todo', number: todoLength, icon: <LuListTodo /> },
    { title: 'Completed Tasks', number: completedLength, icon: <MdDoneAll /> },
    { title: 'Task In Progress', number: inProgressLength, icon: <MdErrorOutline /> },
  ];

  const DashboardTask = tasksData.slice(0, 8);

  return (
    <div className='flex w-full h-auto p-3'>
      <div>
        <SlideBar />
      </div>
      <main className="w-full h-full mb-10 overflow-auto scrollbar-hide m-2">
        <Header />
        <div className='mt-10'>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
            {tasks.map((task, index) => (
              <SummaryBox key={index} task={task} />
            ))}
          </div>
          <div className='mt-5'>
            <h2 className='text-xl font-semibold mb-4 mt-10'>Recent Tasks</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
              {DashboardTask.map((task, index) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
