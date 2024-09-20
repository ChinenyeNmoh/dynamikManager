'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Homepage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  // Fetch userInfo from localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleGetStarted = () => {
    if (userInfo) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-10/12 lg:h-96 md:h-96 h-auto bg-neutral-300 border-2 rounded-lg grid lg:grid-cols-12 md:grid-cols-12 grid-cols-1'>
        <div className="lg:col-span-5 md:col-span-5 col-span-1">
          <Image
            className="w-full rounded-lg object-cover h-full"
            src="/images/train.jpg"
            alt="Workflow Logo"
            width={1200}
            height={800}
            priority={true}
          />
        </div>
        <div className="lg:col-span-7 md:col-span-5 col-span-1 ">
          <h1 className='mt-16 text-center text-5xl font-extrabold '>
            Transform Chaos
            <p className='text-5xl mt-5 font-medium '> into Clarity</p>
          </h1>
          <p className='italic mt-6 px-6'>
            Achieve Clarity and Control: Master Every Task with Ease
            Your Ultimate Solution for Effortless Task Management and Peak Productivity
          </p>
          <button
            onClick={handleGetStarted}
            className='mx-auto border border-solid border-blue-600 hover:bg-blue-900 rounded-full block my-4 bg-blue-600 text-white px-4 py-2'
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
