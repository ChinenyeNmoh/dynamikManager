'use client';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import LoadingPage from '../loading';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get('message');
  const error = searchParams.get('error');

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`,{ email, password },
        {
          credentials: 'include',
          withCredentials: true,
        }
      );
      console.log(data);
      toast.success(data.message);
      localStorage.setItem('userInfo', JSON.stringify(data?.user));
      router.push('/dashboard');
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'An error occurred while attempting to sign in');
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="container mx-auto h-auto">
      <Link
            href='/'
            className='bg-gray-900 hover:text-blue-600 flex items-center border-2 rounded-md border-gray-900 w-24 mt-14 text-white'
          >
            <FaArrowLeft className='mr-2 ml-2 my-3 text-white' /> Home
          </Link>
          
        <div className="w-full max-w-md mx-auto bg-gray-900 text-white shadow-md shadow-transparent rounded-lg border mt-14">
          <h1 className="text-center mt-3 font-bold text-3xl mb-5">Sign In</h1>
          {loading && <LoadingPage />}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="loginemail" className="block">
                  <span className="block font-bold text-base ml-8 mb-2">Email</span>
                </label>
                <input
                  type="text"
                  id="loginemail"
                  placeholder="Johndoe@email.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className=" focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border mx-auto"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block">
                  <span className="block font-bold text-base ml-8 mb-2">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-6 flex items-center text-black"
                  >
                    {showPassword ? <FaEyeSlash className='text-white'/> : <FaEye className='text-white'/>}
                  </button>
                </div>
              </div>
              <div className='flex justify-center mt-10 mb-4'>
                <button 
                  className='bg-blue-100 cursor-pointer disabled:cursor-not-allowed hover:bg-blue-300 text-black font-bold px-4 py-2 rounded-md block'
                  type="submit"
                  disabled={!email || !password}
                >
                  Sign In
                </button>
              </div>
            </form>
            <div className='flex justify-between mx-8 gap-7 mb-4'>
              <div className='text-sm'>
                No Account? <Link href='/register' className='text-blue-600 hover:underline'>
                  <span className='text-base'>Register</span>
                </Link>
              </div>
              <div className='text-sm'>
                <Link href='/forgotpassword' className='text-blue-600 hover:underline italic mt-4 text-base'>
                  Forgot Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
