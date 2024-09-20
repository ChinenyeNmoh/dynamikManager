'use client';
import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import { RiMenuUnfoldFill, RiMenuFoldLine } from "react-icons/ri";
import { FaTasks, FaProjectDiagram, FaUsers, FaPowerOff, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AiFillDashboard } from "react-icons/ai";
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdCardMembership } from "react-icons/md";
import Image from 'next/image';
import { toast } from 'react-toastify';

const SlideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [windowWidth, setWindowWidth] = useState(0); // Initially 0 to avoid SSR issues
    const router = useRouter();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState(null);

    // Fetch userInfo from localStorage only on the client-side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo)); // Parse the userInfo
            } else {
                router.push('/login'); // Redirect if no user info found
            }
        }
    }, [router]);

    // Handle window resize and initialize sidebar state based on screen width
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', handleResize);

            // Initialize sidebar state based on window width
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    // Check if the user session is still valid
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                await axios.get(`http://localhost:5000/api/users/profile`, {
                    withCredentials: true,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (error?.response?.data?.message === 'Log in to continue') {
                    localStorage.removeItem("userInfo");
                    router.push('/login');
                }
            }
        };
        
        if (userInfo) {
            checkUserSession();
        }
    }, [userInfo, router]);

    const menuItems = [
        { path: `/`, name: "Home", icon: <FaHome /> },
        { path: `/dashboard`, name: "Dashboard", icon: < AiFillDashboard/> },
        { path: `/alltasks`, name: "Tasks", icon: <FaTasks /> },
        { path: `/allprojects`, name: "Projects", icon: <FaProjectDiagram /> },
        { path: `/allteams`, name: "Teams", icon: <FaUsers /> },
        { path: `/members`, name: " Members", icon: <MdCardMembership /> },
        { path: `/profile`, name: "Profile", icon: <CgProfile /> },
    ];

    const Logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F8444F",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, LogOut"
        });

        if (result.isConfirmed) {
            try {
                await axios.get(`http://localhost:5000/api/users/logOut`, { withCredentials: true });
                localStorage.removeItem("userInfo");
                router.push("/");
                toast.success("Logged out successfully");

            } catch (error) {
               console.error("Error logging out:", error);
                toast.error(error?.response?.data?.message || "An error occurred");
            }
        }
    };

    return (
        <>
            <nav className={`h-full border-[2px] border-transparent rounded-md pb-16 bg-white z-50 ${isOpen ? "sm:w-48 w-[180px] absolute md:static md:bg-transparent" : "w-12"} overflow-hidden mr-3`}>
                <div className="flex items-center h-16 w-full border-b-2 border-solid border-[#D3D3D3]">
                    <div
                        className={`h-9 w-9  text-3xl flex justify-center items-center rounded-md cursor-pointer text-[#135049] ${isOpen ? "bg-gray-900 text-white" : "hover:bg-gray-500 hover:text-white transition-all duration-500"}`}
                        onClick={toggle}
                    >
                        {isOpen ? <RiMenuFoldLine /> : <RiMenuUnfoldFill />}
                    </div>
                </div>
                <div className='h-full scrollbar-hide mt-3'>
                    {menuItems.map((item, index) => (
                        <Link
                            href={item.path}
                            key={index}
                            className={`flex items-center whitespace-nowrap py-3 px-3 gap-4 mb-3 no-underline transition-all duration-500 ${pathname === item.path ? "bg-gray-900 text-white rounded-md" : "text-black"} hover:bg-gray-500 hover:text-white hover:rounded-md`}
                        >
                            <div className="text-[21px]">{item.icon}</div>
                            <div className={`${isOpen ? "block" : "hidden"}`}>{item.name}</div>
                        </Link>
                    ))}
                    <div className="flex items-center whitespace-nowrap py-3 px-3 gap-4 mb-3 no-underline transition-all duration-500 text-black hover:bg-gray-500 hover:text-white hover:rounded-md cursor-pointer" onClick={Logout}>
                        <div className="text-[21px]"><FaPowerOff /></div>
                        <div className={`${isOpen ? "block" : "hidden"}`}>Logout</div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default SlideBar;
