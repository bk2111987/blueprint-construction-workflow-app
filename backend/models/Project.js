const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('draft', 'bidding', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'draft'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permitRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    permitUrl: {
      type: DataTypes.STRING
    },
    blueprintUrl: {
      type: DataTypes.STRING
    },
    milestones: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    contractorId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    customerId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, { as: 'contractor', foreignKey: 'contractorId' });
    Project.belongsTo(models.User, { as: 'customer', foreignKey: 'customerId' });
    Project.hasMany(models.Bid, { as: 'bids' });
    Project.hasMany(models.Task, { as: 'tasks' });
  };

  return Project;
};
