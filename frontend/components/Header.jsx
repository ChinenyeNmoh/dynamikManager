'use client';
import React, { useEffect, useState } from 'react';
import { CiBellOn } from "react-icons/ci";
import Link from 'next/link';
import axios from 'axios';

function Header() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get('http://localhost:5000/api/messages/user',
        {
          withCredentials: true,
        }
      );
      setNotificationCount(response.data.messageCount);
      
    };
    fetchNotifications();
  }, []);

  console.log(notificationCount);
  
  return (
    <div className='flex flex-col sm:flex-row items-center justify-end lg:justify-between w-full h-auto sm:h-16 bg-gray-900 rounded-md px-4 py-4 sm:py-0'>
      
      {/* Bell Icon with Notification Count */}
      <div className='relative ml-auto'>
        <Link href='/messages'>
          <CiBellOn className='text-white text-4xl' />
          
            <span className='absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
              {notificationCount}
            </span>
          
        </Link>
      </div>

    </div>
  );
}

export default Header;
