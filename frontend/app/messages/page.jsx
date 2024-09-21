'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingPage from '@/app/loading';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SlideBar from '@/components/SlideBar';
import MessageCard from '@/components/MessageCard';
import { toast } from 'react-toastify';

const Page = () => {
  const [loading, setLoading] = useState(false);  
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://dynamikmanager.dynamikservices.tech/api/messages/user', {
          withCredentials: true,
        });
        setMessages(response?.data?.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error(error.response?.data?.message || "Error fetching messages");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  
  return (
    <>
      <div className='flex w-auto lg:w-full h-auto p-3'>
        <div>
          <SlideBar />
        </div>
        <main className="w-full h-full mb-10 m-2">
          <Header />
          <div className="flex justify-center items-center mt-10">
            <div className='w-full max-w-7xl space-y-4'>
              {loading && <LoadingPage />}
              {messages.length === 0 ? (
                <p>You have no new messages</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {messages.map((message) => (
                    <MessageCard key={message._id} message={message} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
