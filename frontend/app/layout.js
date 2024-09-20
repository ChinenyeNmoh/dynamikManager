'use client';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@/assets/styles/globals.css";


const MainLayout = ({ children }) => {
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:5000'); // Adjust URL to match your server

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'task-update') {
          toast.info(message.message);
        }else if (message.type === 'task-creation') {
          console.log(message.message || message);
          toast.info(message.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
      </head>
      <body className="bg-gray-100">
        <main>
          <ToastContainer 
          position="top-center" 
          hideProgressBar={false}
          enableMultiContainer={true}
          
           

          />
          {children}
        </main>
      </body>
    </html>
  );
};

export default MainLayout;
