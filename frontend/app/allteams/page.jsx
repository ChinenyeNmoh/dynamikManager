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
    const [filteredteams, setFilteredteams] = useState([]);
    const [sortedteams, setSortedteams] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [projectsData, setProjectsData] = useState([]); // Added state for projects
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const limit = 2;
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const project = searchParams.get('project') || '';
    const team = searchParams.get('team') || '';
   

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
   

    // Filter teams based on keyword
    useEffect(() => {
        if (keyword.trim()) {
            const filtered = teamsData.filter((team) =>
                team.name.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredteams(filtered);
        } else {
            setFilteredteams(teamsData);
        }
    }, [keyword, teamsData]);

    // Sort teams based on selected filters
    useEffect(() => {
        let sorted = filteredteams;
        console.log('sorted', sorted);
        if (project.trim()) {
            sorted = sorted?.projects?.filter((team) => team?._id === project);
        }else if(team.trim()){
            sorted = sorted.filter((t) => t._id === team);
        }
        setSortedteams(sorted);
    }, [project, filteredteams, team]);

    // Handle page change
    const handlePageChange = (page) => {
        setPage(page);
    };

    // Calculate teams to display on the current page
    const indexOfLastTeam = page * limit;
    const indexOfFirstTeam = indexOfLastTeam - limit;
    const currentDisplay = sortedteams?.slice(indexOfFirstTeam, indexOfLastTeam); // Corrected to sortedteams

    return (
        <div className='flex w-screen h-screen p-3'>
            <div>
                <SlideBar />
            </div>
            <main className="w-full h-full mb-10 overflow-auto scrollbar-hide">
                <TaskSort
                    projects={projectsData}
                    teams={teamsData}
                />

                <div className='mt-10'>
                    <h1 className='text-2xl font-semibold mb-4 text-center'>All teams</h1>
                    {loading && <LoadingPage />}
                    {currentDisplay?.length === 0 && !loading && (
                        <p className='text-center text-lg font-semibold'>No team found</p>
                    )}
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
                        {currentDisplay?.map((team) => (
                            <TaskCard key={team._id} team={team} /> 
                        ))}
                    </div>

                    {/* Pagination Component */}
                    {Math.ceil(sortedteams?.length / limit) > 1 && (
                        <Pagination
                            totalItems={sortedteams?.length}
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
