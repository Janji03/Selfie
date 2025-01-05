import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipients: req.params.userID })
      .populate('sender', 'name email'); 
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
  };
  
  export const completeMessage = async (req, res) => {
    try {
      const message = await Message.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error completing message', error: error.message });
    }
  };
  
