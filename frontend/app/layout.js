import "@/assets/styles/globals.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Meta tags
export const metadata = {
  title: 'Dynamik Manager',
  description: 'Manages tasks, projects, and teams',
  keywords: ['task', 'project', 'team', 'management'],
  icons: {
    icon: "/images/icon.png",
  },
};

const MainLayout = ({ children }) => {
  return (
     
    <html lang='en'>
      <head>
        <script src="https://www.google.com/recaptcha/api.js" async defer />
      </head>
      <body className="bg-gray-100">
        <main>
          <ToastContainer 
          position="top-center" 
          
          hideProgressBar={false}
           /> {/* Add this line to your layout to use the toast */}
          {children}
        </main>
      </body>
    </html>
    
  )
}

export default MainLayout