const { Project, User, Task, Bid } = require('../models');

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      startDate,
      endDate,
      location,
      permitRequired,
      milestones
    } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      startDate,
      endDate,
      location,
      permitRequired,
      milestones,
      contractorId: req.user.id,
      customerId: req.body.customerId
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const where = {};
    
    // Filter projects based on user role
    switch (req.user.role) {
      case 'contractor':
        where.contractorId = req.user.id;
        break;
      case 'customer':
        where.customerId = req.user.id;
        break;
      case 'subcontractor':
        // For subcontractors, show projects open for bidding
        where.status = 'bidding';
        break;
    }

    const projects = await Project.findAll({
      where,
      include: [
        {
          model: User,
          as: 'contractor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Task,
          as: 'tasks'
        },
        {
          model: Bid,
          as: 'bids'
        }
      ]
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'contractor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Task,
          as: 'tasks'
        },
        {
          model: Bid,
          as: 'bids',
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only contractor or customer can update the project
    if (project.contractorId !== req.user.id && project.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only contractor can delete the project
    if (project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadProjectFile = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Handle file upload (implement with multer)
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      
      if (req.body.fileType === 'permit') {
        project.permitUrl = fileUrl;
      } else if (req.body.fileType === 'blueprint') {
        project.blueprintUrl = fileUrl;
      }

      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  uploadProjectFile
};
