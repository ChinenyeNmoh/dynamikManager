'use client';
import axios from 'axios';
import React from 'react';

const SummaryBox = ({ task }) => {
  return (
    <div className=" gap-4 h-auto ">
      
        <div key={task.id} className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
          <h1 className=" font-extrabold text-xl text-gray-600">{task.title}</h1>
          <div className='flex items-center justify-between'>
          <p className="text-red-600 text-xl font-extrabold">{task.number}</p>
          <p className="text-blue-600 text-2xl">{task.icon}</p>
          </div>
          
        </div>
      
    </div>
  );
};

export default SummaryBox;
