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
    const [projectsData, setProjectsData] = useState([]);
    const [filteredprojects, setFilteredprojects] = useState([]);
    const [sortedprojects, setSortedprojects] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 2;
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const team = searchParams.get('team') || '';
    const status = searchParams.get('status') || '';

    // Fetch teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/teams/', {
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
                const { data } = await axios.get('http://localhost:5000/api/projects/', {
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
    console.log(projectsData);

    // Filter projects based on keyword
    useEffect(() => {
        if (keyword.trim()) {
            const filtered = projectsData.filter((project) =>
                project.name.toLowerCase().includes(keyword.toLowerCase()) || 
                project.description.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredprojects(filtered);
        } else {
            setFilteredprojects(projectsData);
        }
    }, [keyword, projectsData]);

    // Sort projects based on selected filters
    useEffect(() => {
        let sorted = filteredprojects;
        if (status.trim()) {
            sorted = sorted.filter((project) => project.status === status);
        }
        if (team.trim()) {
            sorted = sorted.filter((project) => project?.team?._id === team);
        }
        setSortedprojects(sorted);
    }, [status, team, filteredprojects]);

    // Handle page change
    const handlePageChange = (page) => {
        setPage(page);
    };

    // Calculate projects to display on the current page
    const indexOfLastProject = page * limit;
    const indexOfFirstProject = indexOfLastProject - limit;
    const currentDisplay = sortedprojects.slice(indexOfFirstProject, indexOfLastProject);
    console.log('current display', currentDisplay)

    return (
        <div className='flex w-screen h-screen p-3'>
            <div>
                <SlideBar />
            </div>
            <main className="w-full h-full mb-10 overflow-auto scrollbar-hide">
                <TaskSort
                    projectStatus={projectsData}
                    teams={teamsData}
                />

                <div className='mt-10'>
                    <h1 className='text-2xl font-semibold mb-4 text-center'>All projects</h1>
                    {loading && <LoadingPage />}
                    {currentDisplay.length === 0 && !loading && (
                        <p className='text-center text-lg font-semibold'>No projects found</p>
                    )}
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                        {currentDisplay.map((project) => (
                            <TaskCard key={project._id} project={project} />
                        ))}
                    </div>

                    {/* Pagination Component */}
                    {Math.ceil(sortedprojects.length / limit) > 1 && (
                        <Pagination
                            totalItems={sortedprojects.length}
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

