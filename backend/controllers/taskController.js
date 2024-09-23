import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js'; // Import User model
import {  sendEmail, taskCreatedTemplate } from "../utils/mail.js";
import {wss} from '../server.js';

const createTask = async (req, res) => {
  try {
    // Validate request data
    const alreadyExists = await Task.findOne({ title: req.body.title });
    if (alreadyExists) {
      return res.status(400).json({ message: 'Task already exists with this title' });
    }
    const newTask = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      dueDate: req.body.dueDate,
      assignedTo: req.body.assignedTo,
      project: req.body.project,
      createdBy: req.user._id,
    };

    // Create the task
    let savedTask = await Task.create(newTask);

    // Populate the project field with the project details
    savedTask = await savedTask.populate('project');

    if (req.body.assignedTo.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a message to yourself' });
    }

    const assignedUser = await User.findById(req.body.assignedTo).select('name email');

    if (!assignedUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    // Create a new message
    const newMessage = new Message({
      sender: savedTask.createdBy,
      recipient: savedTask.assignedTo,
      task: savedTask._id,
      name: assignedUser.name,
      email: assignedUser.email,
      body: savedTask.description,
    });


    await newMessage.save();
    try {
      const htmlContent = taskCreatedTemplate(savedTask, assignedUser);
      await sendEmail(assignedUser.email, 'Task Notification', htmlContent);
    } catch (emailError) {
      console.log('Email sending failed', emailError.message);
      return res.status(500).json({ message: 'Task created, but email sending failed', error: emailError });
    }

    // Notify all connected clients about the new task
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'task-creation',
          message: `${req.user.name} created a new task: "${savedTask.title}" in the project "${savedTask.project.name}".`,
        }));
      }
    });

    res.status(201).json({ message: 'Task created and message sent', savedTask });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error creating task', error });
  }
};


// READ all tasks
const getAllTasks = async (req, res) => {
  console.log('get all tasks');
  try {
    const tasks = await Task.find({}).populate('assignedTo').populate('project').populate('createdBy').sort({ createdAt: -1 });
    res.status(200).json({message: 'All tasks', tasks});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error retrieving tasks', error });
  }
};

// READ a single task by ID
const getTaskById = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id).populate('assignedTo').populate('project').populate('createdBy');
   
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({task});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message:  error.message });
  }
};

// UPDATE a task by ID
const updateTaskById = async (req, res) => {
  try {
    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('project')
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    // Notify all connected clients about the updated task
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'task-update',
          message: `${req.user.name} updated task: "${updatedTask.title}" in the project "${updatedTask.project.name}".`,
        }));
      }
    });

    res.status(200).json({ updatedTask });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};



// DELETE a task by ID
const deleteTaskById = async (req, res) => {
  try {
    const deletedTask = await Task.findById(req.params.id).populate('project');
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    
    await Task.findByIdAndDelete(req.params.id);
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'task-deletion',
          message: `${req.user.name} deleted task: "${deletedTask.title}" from the project "${deletedTask.project.name}".`,
        }));
      }
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error deleting task', error });
  }
};


export { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById };
