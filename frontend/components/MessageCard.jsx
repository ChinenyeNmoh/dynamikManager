'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Priority from './Priority';
import Swal from 'sweetalert2';

const MessageCard = ({ message }) => {
  const router = useRouter();

  const handleReadClick = async () => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/messages/read/`, {id: message._id}, {
        withCredentials: true,
      });
      // Handle the response as needed
      console.log(response?.data);
      toast.success('Message marked as read');
      router.refresh()
    } catch (error) {
      console.error("Error marking message as read:", error?.message);
      toast.error(error.response?.data?.message || "Error marking message as read");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This message will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F8444F",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/messages/${message?._id}`, { withCredentials: true });
        toast.success("message deleted");
        router.refresh();
      } catch (error) {
        console.error("Error logging out:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>

      <p className='text-xl mb-2 text-gray-700'>
        <span className='font-bold'>Task:</span> {message?.task?.title}
      </p>
      <p className='text-gray-700'><strong>Content: {' '}</strong>  {message?.body}</p>
      <hr className='my-4' />

      <ul className='mt-4'>
       
        <li className='text-green-600 mb-2'>
          <strong>Staus:</strong>{' '}
          {message?.task?.status}
        </li>
        <li >
        <div className="mb-1 flex items-center space-x-2">
              <Priority priority={message?.task?.priority } />
              <p className=" text-gray-600">{message?.task?.priority } priority</p>
            </div>
        </li>
        <hr className='my-4' />
        <li className='text-sm text-gray-700'>
          <strong >Received:</strong>{' '}
          {new Date(message?.createdAt).toLocaleString()}
        </li>
        <li className='text-sm text-gray-700'>
           <strong>Reply Email: {' '}</strong> 
          <a href={`mailto:${message?.sender?.email}`} className='text-blue-500'>
            {message?.email}
          </a>
        </li>
      </ul>
      <hr className='my-4' />
        <button
        onClick={handleReadClick}
        className={`mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md disabled:opacity-50`}
        disabled={message?.read}
      >
        {message?.read ? 'Read' : 'Mark as Read'}
      </button>

       <button
        onClick={handleDelete}
        className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md'
      >
        Delete
      </button>
      
    </div>
  );
};

export default MessageCard;
