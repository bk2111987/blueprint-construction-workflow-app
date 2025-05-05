const { Message, User, Project } = require('../models');
const { Op } = require('sequelize');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, projectId, content, type = 'text', attachmentUrl } = req.body;

    // Verify receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // If projectId is provided, verify project exists and both users are involved
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check if both users are involved in the project
      const isInvolved = [
        project.contractorId,
        project.customerId,
        // Add any subcontractors assigned to project tasks
        ...(await project.getTasks()).map(task => task.assignedTo)
      ].includes(receiverId);

      if (!isInvolved) {
        return res.status(403).json({ error: 'Receiver is not involved in the project' });
      }
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      projectId,
      content,
      type,
      attachmentUrl
    });

    // Include sender information in response
    const messageWithSender = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    // Emit message through socket.io (implement in socket handler)
    if (req.io) {
      req.io.to(`user_${receiverId}`).emit('new_message', messageWithSender);
      if (projectId) {
        req.io.to(`project_${projectId}`).emit('new_project_message', messageWithSender);
      }
    }

    res.status(201).json(messageWithSender);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const where = {};
    
    // Get messages for a specific conversation
    if (req.query.userId) {
      where[Op.or] = [
        {
          senderId: req.user.id,
          receiverId: req.query.userId
        },
        {
          senderId: req.query.userId,
          receiverId: req.user.id
        }
      ];
    }

    // Get messages for a specific project
    if (req.query.projectId) {
      where.projectId = req.query.projectId;
      
      // Verify user is involved in the project
      const project = await Project.findByPk(req.query.projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const isInvolved = [
        project.contractorId,
        project.customerId,
        ...(await project.getTasks()).map(task => task.assignedTo)
      ].includes(req.user.id);

      if (!isInvolved) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    const messages = await Message.findAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit) || 50
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: {
        receiverId: req.user.id,
        read: false
      }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.update(
      { 
        read: true,
        readAt: new Date()
      },
      {
        where: {
          id: messageIds,
          receiverId: req.user.id
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    // Get latest message from each conversation
    const conversations = await Message.findAll({
      attributes: [
        'senderId',
        'receiverId',
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageAt']
      ],
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      group: [
        'senderId',
        'receiverId'
      ],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [[sequelize.fn('MAX', sequelize.col('createdAt')), 'DESC']]
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  markAsRead,
  getConversations
};
