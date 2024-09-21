import React from 'react';
import { useRouter } from 'next/navigation';
import Priority from './Priority';

const TaskCard = ({ task = '', project = '', team = '' }) => {
  const router = useRouter();

  // Check if the due date is within 24 hours
  const isDueSoon = task.dueDate && new Date(task.dueDate) - new Date() <= 24 * 60 * 60 * 1000;

  // Function to handle viewing task details
  const viewDetails = () => {
    if(task) {
    router.push(`/tasks/${task?._id}`);
    } else if(team) {
    router.push(`/teams/${team?._id}`);
    } else {
    router.push(`/projects/${project?._id}`);
  };
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col justify-between h-full">
        {/* Render Task or Project information */}
        {(task || project) && (
          <>
            <div className="mb-1">
              <p className="font-bold text-sm text-gray-700">{task?.title || project?.name}</p>
              <p className="text-green-600 mt-1">{task?.project?.name || project?.name}</p>
            </div>

            <div className="mb-1 flex items-center space-x-2">
              <Priority priority={task?.priority || project?.priority} />
              <p className="text-sm text-gray-600">{task?.priority || project?.priority} priority</p>
            </div>

            <div className="mt-1">
              <p className="text-sm text-orange-600 font-semibold">Status: {task?.status || project?.status}</p>
              <p className={`text-sm font-semibold ${isDueSoon ? 'text-red-600' : 'text-green-600'}`}>
                Due Date: {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not Set'}
              </p>
              <p className="text-gray-600 text-sm">
                Assigned to: <span className="font-semibold">{task?.assignedTo?.name || project?.team?.name || 'Unassigned'}</span>
              </p>
            </div>

            {/* View Details Button */}
            <div className="mt-4">
              <button
                onClick={viewDetails}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                See Details
              </button>
            </div>
          </>
        )}

        {/* Render Team information if available */}
        {team && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="font-bold text-lg text-gray-800 mb-2">{team?.name}</p>

            <div className="mb-4">
              <p className="text-green-600 font-semibold mb-1">Team Projects:</p>
              <ul className="pl-4 list-disc list-inside">
                {team?.projects?.map((project) => (
                  <li key={project?._id} className="text-gray-700 text-sm hover:text-green-500">
                    {project?.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-green-600 font-semibold mb-1">Team Members:</p>
              <ul className="pl-4 list-disc list-inside">
                {team?.members.map((member) => (
                  <li key={member?._id} className="text-gray-700 text-sm hover:text-green-500">
                    {member?.name}
                  </li>
                ))}
              </ul>
            </div>
            {/* View Details Button */}
            <div className="mt-4">
              <button
                onClick={viewDetails}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                See Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
