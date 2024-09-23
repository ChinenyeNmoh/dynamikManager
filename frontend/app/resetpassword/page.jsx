'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEyeSlash, FaEye, FaArrowLeft } from 'react-icons/fa';
import { useSearchParams, useRouter, useParams } from 'next/navigation';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const id = searchParams.get('id');
  console.log(id);

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/updatepassword`, {
        confirmPassword,
        id,
        password,
      });
      console.log(data);
    toast.success(data.message);
      router.push('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while reseting email');
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
          <h1 className="text-center mt-3 font-bold text-3xl mb-5">Forgot Password</h1>
          <div>
            <form onSubmit={handleSubmit}>
              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block">
                  <span className="block font-bold text-base ml-8 mb-2">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:outline-blue-300 hover:outline-blue-300 block md:w-10/12 px-3 py-2 h-10 rounded-md bg-inherit border ml-8 w-10/12 lg:w-10/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-9 flex items-center px-3 text-black"
                  >
                    {showPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block">
                  <span className="block font-bold text-base ml-8 mb-2">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:outline-blue-300 hover:outline-blue-300 block md:w-10/12 px-3 py-2 h-10 rounded-md bg-inherit border ml-8 w-10/12 lg:w-10/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-9 flex items-center px-3 text-black"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-white" /> : <FaEye className="text-white" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-10 mb-4">
                <button
                  type="submit"
                  disabled={!password || !confirmPassword}
                  className="bg-blue-100 cursor-pointer disabled:cursor-not-allowed hover:bg-blue-300 text-black font-bold px-4 py-2 rounded-md"
                >
                  Reset Password
                </button>
              </div>
            </form>

            {/* Back to Login Link */}
            <div className="flex ml-8 gap-7">
              <div className="text-center mb-5">
                <Link href='/login' className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
