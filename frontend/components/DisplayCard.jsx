'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Priority from './Priority';

const DisplayCard = ({ task = '', projects = [], users = [] }) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [editableTask, setEditableTask] = useState({});

  // Fetch userInfo from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  // Check if the due date is within 24 hours
  const isDueSoon = task?.dueDate && new Date(task?.dueDate) - new Date() <= 24 * 60 * 60 * 1000;

  useEffect(() => {
    setEditableTask({ ...task }); // Populate the form with task data
  }, [task]);

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Submit updated task data
    console.log('Task updated:', editableTask);
  };

  // Check if the user can edit all fields (admin, manager) or only the status (assigned user)
  const canEditAllFields = userInfo?.role === 'admin' || userInfo?.role === 'manager';
  const canEditStatusOnly = task?.assignedTo === userInfo?._id;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableTask((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
        onSubmit={handleFormSubmit}
      >
        <div className="flex flex-col justify-between h-full space-y-6">
          {/* Project Selection */}
          <div className="mb-2">
            <label className="block text-lg font-bold text-gray-800">Project</label>
            <select
              name="project"
              value={editableTask.project || ''}
              onChange={handleInputChange}
              disabled={!canEditAllFields}
              className="w-full border p-2 rounded-lg text-gray-700 text-lg"
            >
              <option value="">{task?.project?.name}</option>
              {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-lg font-bold text-gray-800">Description</label>
            <textarea
              name="description"
              value={editableTask.description || ''}
              onChange={handleInputChange}
              disabled={!canEditAllFields}
              className="w-full border p-2 rounded-lg text-gray-700 text-lg"
            ></textarea>
          </div>

          {/* Priority and Status */}
          <div className="flex items-center space-x-6">
            <div className="mb-2">
              <label className="block text-lg font-bold text-gray-800">Priority</label>
              <select
                name="priority"
                value={editableTask.priority || ''}
                onChange={handleInputChange}
                disabled={!canEditAllFields}
                className="w-full border p-2 rounded-lg text-gray-700 text-lg"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-lg font-bold text-gray-800">Status</label>
              <select
                name="status"
                value={editableTask.status || ''}
                onChange={handleInputChange}
                disabled={!canEditAllFields && !canEditStatusOnly}
                className="w-full border p-2 rounded-lg text-gray-700 text-lg"
              >
                <option value="to-do">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="mb-2">
            <label className="block text-lg font-bold text-gray-800">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={editableTask.dueDate ? new Date(editableTask.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              disabled={!canEditAllFields}
              className="w-full border p-2 rounded-lg text-gray-700 text-lg"
            />
          </div>

          {/* Assigned To Selection */}
          <div className="mb-2">
            <label className="block text-lg font-bold text-gray-800">Assigned To</label>
            <select
              name="assignedTo"
              value={editableTask.assignedTo || ''}
              onChange={handleInputChange}
              disabled={!canEditAllFields}
              className="w-full border p-2 rounded-lg text-gray-700 text-lg"
            >
              <option value="">{task?.assignedTo?.name}</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            {/* Show Update button for users who can edit */}
            {(canEditAllFields || canEditStatusOnly) && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Save Changes
              </button>
            )}

            {/* Show Delete button for admins */}
            {userInfo?.role === 'admin' && (
              <button
                type="button"
                onClick={() => console.log('Task deleted')} // Replace with actual delete logic
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Delete Task
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DisplayCard;
