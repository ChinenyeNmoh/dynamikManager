import Message from '../models/messageModel.js';

// GET all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender recipient task', 'name email title');
    res.status(200).json({messages});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

// GET a message by ID
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('sender recipient task', 'name email title');
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error fetching message', error });
  }
};

// DELETE a message by ID
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await message.deleteOne()
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error deleting message', error });
  }
};

//get a users messages

const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
    .populate('task')
    .populate('recipient')
    .populate('sender')
    .sort({ createdAt: -1 });
    
    const messageCount = await Message.countDocuments({ recipient: req.user._id, read: false });
    res.status(200).json({messages, messageCount});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};


//update a message to read

const updateMessageToRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.body.id, { read: true }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({message});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error updating message', error });
  }
};


export { getAllMessages, getMessageById, deleteMessage, getUserMessages, updateMessageToRead };
