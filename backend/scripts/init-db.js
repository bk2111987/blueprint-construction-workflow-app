require('dotenv').config();
const { Sequelize } = require('sequelize');
const models = require('../models');

async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    const sequelize = new Sequelize(process.env.DATABASE_URL);
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync all models
    await models.sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create test data
    const testUser = await models.User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'contractor',
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      language: 'en'
    });

    const testProject = await models.Project.create({
      title: 'Test Project',
      description: 'A test renovation project',
      budget: 50000.00,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'bidding',
      location: 'Montreal',
      permitRequired: true,
      contractorId: testUser.id,
      milestones: [
        {
          title: 'Planning Phase',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          completed: false
        }
      ]
    });

    console.log('Test data created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
