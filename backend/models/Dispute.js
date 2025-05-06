const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dispute = sequelize.define('Dispute', {
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
    raisedById: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    againstId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    evidencePhotos: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    status: {
      type: DataTypes.ENUM('open', 'in_review', 'resolved', 'closed'),
      defaultValue: 'open'
    },
    resolution: {
      type: DataTypes.TEXT
    },
    resolvedAt: {
      type: DataTypes.DATE
    }
  });

  Dispute.associate = (models) => {
    Dispute.belongsTo(models.Project, { foreignKey: 'projectId' });
    Dispute.belongsTo(models.User, { as: 'raisedBy', foreignKey: 'raisedById' });
    Dispute.belongsTo(models.User, { as: 'against', foreignKey: 'againstId' });
  };

  return Dispute;
};
