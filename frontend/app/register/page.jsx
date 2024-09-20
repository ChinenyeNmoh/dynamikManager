'use client'
import ReCAPTCHA from "react-google-recaptcha";
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import LoadingPage from '../loading';

const Register = () => {
  const clientCaptcha = process.env.NEXT_PUBLIC_CLIENT_CAPTCHA;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);
  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle the ReCAPTCHA value change
  const handleCaptcha = (value) => {
    setCaptchaValue(value);
  };

  // Ensure Captcha is not null before submitting
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast.error('Please verify the CAPTCHA');
      return;
    }
    

    try {
      setLoading(true);
      const response = await axios.post(`https://dynamikmanager.dynamikservices.tech/api/users/register`, {
        fullName,
        email,
        password,
        confirmPassword,
        captchaValue
      },
      {
        withCredentials: true,
      });
      
      toast.success(response.data.message || 'Registration successful');
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingPage />}
      <div className="container mx-auto h-full">
      <Link
            href='/'
            className='bg-gray-900 ml-3 hover:text-blue-600 flex items-center border-2 rounded-md border-gray-900 w-24 mt-14 text-white'
          >
            <FaArrowLeft className='mr-2 ml-2 my-3 text-white' /> Home
        </Link>
        <div className="w-full max-w-xl mx-auto bg-gray-900 text-white rounded-lg border my-8">
          <h1 className="text-center mt-10 font-bold text-3xl mb-5">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
           

            {/* Password and Confirm Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <div className="mb-4">
              <label htmlFor="fullname" className="block">
                <span className="block font-bold text-base ml-4 mb-2">Full Name</span>
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="John Doe"
                required={true}
                value={fullName}
                onChange={(e) => setFullname(e.target.value)}
                className="focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border ml-4"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block">
                <span className="block font-bold text-base ml-4 mb-2">Email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Johndoe@email.com"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border lg:mr-4 md:mr-4 ml-4"
              />
            </div>
              <div>
                <label htmlFor="password" className="block">
                  <span className="block font-bold text-base ml-4 mb-2">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border ml-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-7 lg:right-3 flex items-center text-black"
                  >
                    {showPassword ? <FaEyeSlash className='text-white' /> : <FaEye className='text-white' />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block">
                  <span className="block font-bold text-base ml-4 mb-2">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:outline-blue-300 hover:outline-blue-300 block w-11/12 px-3 py-2 h-10 rounded-md bg-inherit border  lg:mr-4 md:mr-4 ml-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-7 lg:right-4 flex items-center text-black"
                  >
                    {showConfirmPassword ? <FaEyeSlash className='text-white' /> : <FaEye className='text-white' />}
                  </button>
                </div>
              </div>
            </div>

            {/* ReCAPTCHA */}
            <ReCAPTCHA
              sitekey={clientCaptcha}
              onChange={handleCaptcha}
              ref={recaptchaRef}
              className="ml-4 mt-4"
            />

            {/* Submit Button */}
            <div className="flex justify-center mt-10 mb-4">
              <button type="submit" className="bg-blue-100 text-black font-bold p-2 rounded-md">
                Register
              </button>
            </div>

            {/* Redirect to Login */}
            <div className="text-center mb-5 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                <span className="text-base">Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
