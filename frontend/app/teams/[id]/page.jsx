'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import SlideBar from '@/components/SlideBar';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Header from '@/components/Header';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const router = useRouter();
  const { id } = useParams();
  const [projectsData, setProjectsData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []); 

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/teams/${id}`,
            {
                withCredentials: true,
            }
        );
        setTeam(response.data.team);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    // Call fetchTeam when id changes
    if (id) {
      fetchTeam();
    }
  }, [id]); 

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


  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This team will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F8444F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
          await axios.delete(`http://localhost:5000/api/teams/${id}`, { withCredentials: true });
          toast.success("Team deleted");
          router.push("/allteams");
      } catch (error) {
          console.error("Error deleting team:", error);
          toast.error(error?.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <>
     <div className='flex w-full h-auto p-3'>
      <div>
        <SlideBar />
      </div>
      <main className="w-full h-full mb-10 m-2">
        <Header />
     
      {loading && <LoadingPage />}

      <div className="flex justify-center items-center mt-10">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="mb-1">
            <p className="font-bold text-lg md:text-xl text-gray-700"><span className='font-extrabold'>Team Name: </span>{team?.name}</p>
          </div>

          <hr />
          <div className="mb-4">
            <p className="text-green-600 font-semibold mb-1 text-sm md:text-base">Team Projects:</p>
            <ul className="pl-4 list-disc list-inside">
              {team?.projects?.map((project) => (
                <li key={project._id} className="text-gray-700 text-sm hover:text-blue-500 underline">
                  <Link href={`/projects/${project._id}`}>
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <hr />

          <div>
            <p className="text-green-600 font-semibold mb-1 text-sm md:text-base">Team Members:</p>
            <ul className="pl-4 list-disc list-inside">
              {team?.members?.map((member) => (
                <li key={member._id} className="text-gray-700  text-sm hover:text-blue-500 underline">
                  <Link href={`/profile/${member._id}`}
                    
                  >
                    {member.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div className='flex justify-center'>
            {userInfo?.role !== 'user' && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md" onClick={() => router.push(`/teams/edit/${id}`)}>
                Edit Team
              </button>
            )}
            
            {userInfo?.role === 'admin' && (
              <button className="bg-red-600 text-white px-4 py-2 rounded-md ml-4" onClick={handleDelete}>
                Delete Team
              </button>
            )}
          </div>
        </div>
      </div>
      </main>
      </div>
    </>
  );
};

export default Page;
