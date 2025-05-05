const { Task, Project, User } = require('../models');

const createTask = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      priority,
      startDate,
      dueDate,
      assignedTo,
      dependencies,
      attachments
    } = req.body;

    // Verify project exists and user has permission
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only contractor or assigned subcontractor can create tasks
    if (project.contractorId !== req.user.id && assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      status: 'pending',
      priority,
      startDate,
      dueDate,
      assignedTo,
      dependencies,
      attachments,
      progress: 0
    });

    // Include assignee information in response
    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json(taskWithAssignee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const where = {};
    
    // Filter tasks based on user role and query parameters
    if (req.query.projectId) {
      where.projectId = req.query.projectId;
    }

    if (req.user.role === 'subcontractor') {
      where.assignedTo = req.user.id;
    } else if (req.user.role === 'contractor') {
      const projectIds = await Project.findAll({
        where: { contractorId: req.user.id },
        attributes: ['id']
      }).map(p => p.id);
      where.projectId = projectIds;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status']
        }
      ],
      order: [
        ['dueDate', 'ASC'],
        ['priority', 'DESC']
      ]
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status', 'contractorId']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has permission to view task
    if (
      task.assignedTo !== req.user.id && 
      task.Project.contractorId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          attributes: ['contractorId']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only contractor or assigned user can update task
    if (
      task.Project.contractorId !== req.user.id && 
      task.assignedTo !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // If updating status to completed, set completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    await task.update(req.body);

    // If task is completed, check if all project tasks are completed
    if (req.body.status === 'completed') {
      const projectTasks = await Task.findAll({
        where: { projectId: task.projectId }
      });

      const allCompleted = projectTasks.every(t => t.status === 'completed');
      if (allCompleted) {
        await task.Project.update({ status: 'completed' });
      }
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          attributes: ['contractorId']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only contractor can delete tasks
    if (task.Project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only assigned user can update progress
    if (task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await task.update({ 
      progress,
      status: progress === 100 ? 'completed' : task.status,
      completedAt: progress === 100 ? new Date() : null
    });

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskProgress
};
