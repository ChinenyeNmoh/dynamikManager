import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { FaTimes } from "react-icons/fa";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathName = usePathname();

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Prepare query parameters
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('keyword', searchTerm.trim());

    if (query.toString() && pathName.includes('alltasks')) {
      router.push(`/alltasks/?${query.toString()}`);
    } else if (query.toString() && pathName.includes('allprojects')) {
      router.push(`/allprojects/?${query.toString()}`);
    } else if (query.toString() && pathName.includes('dashboard')) {
      router.push(`/alltasks/?${query.toString()}`);
    }else if (query.toString() && pathName.includes('allteams')) {
      router.push(`/allteams/?${query.toString()}`);
    } else {
      if (pathName.includes('alltasks')) {
        router.push('/alltasks');
      } else if (pathName.includes('allprojects')) {
        router.push('/allprojects');
      }else if (pathName.includes('dashboard')) {
        router.push('/dashboard');
      } else if (pathName.includes('allteams')) {
        router.push('/allteams');
      }
    }
  };


  // Handle clear input
  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center mt-4">
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full p-2 pr-10 rounded-lg bg-inherit border-blue-500 border-solid border-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
        
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-sm" />
          </button>
        
      </div>
      <button
        type="submit"
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
