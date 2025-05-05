const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'blocked'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    startDate: {
      type: DataTypes.DATE
    },
    dueDate: {
      type: DataTypes.DATE
    },
    assignedTo: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    completedAt: {
      type: DataTypes.DATE
    },
    dependencies: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Project);
    Task.belongsTo(models.User, { as: 'assignee', foreignKey: 'assignedTo' });
  };

  return Task;
};
