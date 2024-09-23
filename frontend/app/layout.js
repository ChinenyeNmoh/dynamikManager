'use client';
import { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@/assets/styles/globals.css";

const MainLayout = ({ children }) => {
  const websocketRef = useRef(null);
  const reconnectInterval = useRef(null);

  useEffect(() => {
    const createWebSocket = () => {
      websocketRef.current = new WebSocket('wss://localhost:5000');

      websocketRef.current.onopen = () => {
        console.log('WebSocket connection established');
        clearInterval(reconnectInterval.current); // Clear reconnection attempts once connected
        reconnectInterval.current = null;
      };

      websocketRef.current.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'task-update' || message.type === 'task-creation') {
            toast.success(message.message);

          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        handleReconnect(); // Attempt to reconnect
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const handleReconnect = () => {
      if (!reconnectInterval.current) {
        reconnectInterval.current = setInterval(() => {
          console.log('Attempting to reconnect...');
          createWebSocket();
        }, 5000); // Attempt to reconnect every 5 seconds
      }
    };


    // Create WebSocket connection
    createWebSocket();

    // Cleanup WebSocket connection and intervals on component unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
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
