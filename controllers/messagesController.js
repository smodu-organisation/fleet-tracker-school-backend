const { Messages, Users } = require('../models');

const getAllMessages = async (req, res) => {
  try {
    const messages = await Messages.findAll({
      include: [
        { model: Users, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: Users, as: 'receiver', attributes: ['id', 'name', 'email'] },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Messages.findByPk(id, {
      include: [
        { model: Users, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: Users, as: 'receiver', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    const messages = await Messages.findAll({
      where: {
        sender_id,
        receiver_id,
      },
      include: [
        { model: Users, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: Users, as: 'receiver', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!messages.length)
      return res.status(404).json({ message: 'No messages found between these users' });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  try {
    const newMessage = await Messages.create({
      sender_id,
      receiver_id,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const [rowsUpdated] = await Messages.update({ message }, { where: { id } });

    if (!rowsUpdated) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Messages.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  getMessagesBetweenUsers,
  createMessage,
  updateMessage,
  deleteMessage,
};
