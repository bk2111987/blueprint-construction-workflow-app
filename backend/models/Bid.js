const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Bid = sequelize.define('Bid', {
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
    bidderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    timeline: {
      type: DataTypes.INTEGER, // in days
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    },
    materialCosts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    laborCosts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  });

  Bid.associate = (models) => {
    Bid.belongsTo(models.Project);
    Bid.belongsTo(models.User, { as: 'bidder', foreignKey: 'bidderId' });
  };

  return Bid;
};
