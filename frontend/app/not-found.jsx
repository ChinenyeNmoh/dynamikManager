import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <section className='bg-neutral-50 min-h-screen flex-grow'>
      <div className='container m-auto max-w-2xl '>
        
          <div className='flex justify-center'>
            <FaExclamationTriangle className='text-yellow-400 text-9xl fa-5x' />
          </div>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mt-4 mb-2'>Page Not Found</h1>
            <p className='text-gray-500 text-xl mb-10'>
              The page you are looking for does not exist.
            </p>
            <Link
              href='/'
              className='bg-slate-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded'
            >
              Go Home
            </Link>
          </div>
        
      </div>
      <div className='flex-grow'></div>
    </section>
  );
};
export default NotFoundPage;