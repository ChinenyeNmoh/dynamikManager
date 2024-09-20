import { FaCircle } from "react-icons/fa";
import React from 'react';

const Priority = ({ priority }) => {
  return (
    <div className="flex items-center">
      {priority === 'low' && <FaCircle className="text-blue-500 text-sm mr-2" />} {''} 
      {priority === 'medium' && <FaCircle className="text-yellow-500 text-sm mr-2" />}
      {priority === 'high' && <FaCircle className="text-red-500 text-sm mr-2" />}
    </div>
  );
};

export default Priority;
