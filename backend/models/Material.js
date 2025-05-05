const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Material = sequelize.define('Material', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    minStockLevel: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    sku: {
      type: DataTypes.STRING,
      unique: true
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    specifications: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    erpReference: {
      type: DataTypes.STRING
    }
  });

  Material.associate = (models) => {
    Material.belongsTo(models.User, { as: 'vendor', foreignKey: 'vendorId' });
  };

  return Material;
};
