'use client'
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa';




const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const searchParams = useSearchParams();
const error = searchParams.get('error');
  
    useEffect(() => {
      
      if (error) {
        toast.error(error); 
      }
    }, []);
    

    const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const {data} = await axios.post('http://localhost:5000/api/users/forgotpassword',{ email });
        toast.success(data.message);
        setEmail('');

    }catch(err){
        console.error(err.message);
        toast.error(err?.response?.data?.message || 'An error occurred while sending password reset email');
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
              <div className="mb-4">
                <label htmlFor="forgotPasswordemail" className="block">
                  <span className="block font-bold text-base ml-8 mb-2">Email</span>
                </label>
                
                <input
                  type="text"
                  id="forgotPasswordemail"
                  placeholder="Johndoe@email.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className=" focus:outline-blue-300 hover:outline-blue-300 block md:w-10/12 px-3 py-2 h-10 rounded-md bg-inherit border ml-8 sm:w-10/12 lg:w-10/12"
                />
              </div>
              <div className='flex justify-center mt-10 mb-4'>
                 <button
                 type="submit"
                 disabled={!email}
                 className='bg-blue-100 text-black font-bold px-4 py-2 rounded-md block cursor-pointer disabled:cursor-not-allowed hover:bg-blue-300'>
                   Send
                 </button>
                </div>
                </form>
                <div className='flex ml-8 gap-7'>
                <div className='text-center mb-5'>
                  <Link href='/login'
                  className='text-blue-600 hover:underline'>
                     Back to login
                  </Link>
                </div>

                </div>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword