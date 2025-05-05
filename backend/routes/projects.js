const express = require('express');
const { Project, User } = require('../models');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

// Middleware to allow only contractors
router.use(roleMiddleware(['contractor']));

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description, budget, startDate, endDate } = req.body;
    const contractorId = req.user.id;

    const project = await Project.create({
      contractorId,
      title,
      description,
      budget,
      startDate,
      endDate,
      status: 'draft',
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all projects for the logged-in contractor
router.get('/', async (req, res) => {
  try {
    const contractorId = req.user.id;
    const projects = await Project.findAll({
      where: { contractorId },
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const contractorId = req.user.id;
    const project = await Project.findOne({
      where: { id: req.params.id, contractorId },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const contractorId = req.user.id;
    const project = await Project.findOne({
      where: { id: req.params.id, contractorId },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { title, description, budget, startDate, endDate, status } = req.body;
    await project.update({ title, description, budget, startDate, endDate, status });
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const contractorId = req.user.id;
    const project = await Project.findOne({
      where: { id: req.params.id, contractorId },
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
