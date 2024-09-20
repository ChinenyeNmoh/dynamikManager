'use client';
import React, { useState, useEffect } from 'react';
import LoadingPage from '../loading';
import TaskCard from '@/components/TaskCard';
import axios from 'axios';
import SlideBar from '@/components/SlideBar';
import Pagination from '@/components/Pagination';
import TaskSort from '@/components/TaskSort';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const [tasksData, setTasksData] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortedTasks, setSortedTasks] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 8;
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const team = searchParams.get('team') || '';
    const project = searchParams.get('project') || '';
    const status = searchParams.get('status') || '';

    // Fetch tasks with pagination
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`https://dynamikmanager.dynamikservices.tech/api/tasks`, {
                    params: { page, limit },
                    withCredentials: true,
                });
                setTasksData(data.tasks);
                setFilteredTasks(data.tasks);
                setLoading(false);
            } catch (error) {
                console.log('error', error.message);
                setLoading(false);
            }
        };
        fetchTasks();
    }, [page]);

    // Fetch teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('https://dynamikmanager.dynamikservices.tech/api/teams/', {
                    withCredentials: true,
                });
                setTeamsData(data.teams);
                setLoading(false);
            } catch (error) {
                console.log('error', error.message);
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    // Fetch projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('https://dynamikmanager.dynamikservices.tech/api/projects/', {
                    withCredentials: true,
                });
                setProjectsData(data.projects);
                setLoading(false);
            } catch (error) {
                console.log('error', error.message);
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter tasks based on keyword
    useEffect(() => {
        if (keyword.trim()) {
            const filtered = tasksData.filter((task) =>
                task.title.toLowerCase().includes(keyword.toLowerCase()) || 
                task.description.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredTasks(filtered);
        } else {
            setFilteredTasks(tasksData);
        }
    }, [keyword, tasksData]);

    // Sort tasks based on selected filters
    useEffect(() => {
        let sorted = filteredTasks;
        if (status.trim()) {
            sorted = sorted.filter((task) => task.status === status);
        }
        if (team.trim()) {
            sorted = sorted.filter((task) => task.project.team === team);
        }
        if (project.trim()) {
            sorted = sorted.filter((task) => task.project._id === project);
        }
        setSortedTasks(sorted);
    }, [status, team, project, filteredTasks]);

    // Handle page change
    const handlePageChange = (page) => {
        setPage(page);
    };

    // Calculate tasks to display on the current page
    const indexOfLastTask = page * limit;
    const indexOfFirstTask = indexOfLastTask - limit;
    const currentDisplay = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className='flex w-screen h-screen p-3'>
            <div>
                <SlideBar />
            </div>
            <main className="w-full h-full mb-10 overflow-auto scrollbar-hide">
                <TaskSort
                    projects={projectsData}
                    teams={teamsData}
                    tasks={tasksData}
                    projectStatus={projectsData}
                />

                <div className='mt-10'>
                    <h1 className='text-2xl font-semibold mb-4 text-center'>All Tasks</h1>
                    {loading && <LoadingPage />}
                    {currentDisplay.length === 0 && !loading && (
                        <p className='text-center text-lg font-semibold'>No tasks found</p>
                    )}
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                        {currentDisplay.map((task, index) => (
                            <TaskCard key={index} task={task} />
                        ))}
                    </div>

                     {/* Pagination Component */}
          {Math.ceil(sortedTasks.length / limit) > 1 && (
            <Pagination
              totalItems={sortedTasks.length}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={handlePageChange}
            />
        )}
                </div>
            </main>
        </div>
    );
};

export default Page;
