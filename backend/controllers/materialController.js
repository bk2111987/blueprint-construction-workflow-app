const { Material, User } = require('../models');
const { Op } = require('sequelize');

const createMaterial = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      unit,
      stockLevel,
      minStockLevel,
      sku,
      specifications,
      erpReference
    } = req.body;

    // Only vendors can create materials
    if (req.user.role !== 'vendor') {
      return res.status(403).json({ error: 'Only vendors can create materials' });
    }

    const material = await Material.create({
      vendorId: req.user.id,
      name,
      description,
      category,
      price,
      unit,
      stockLevel,
      minStockLevel,
      sku,
      specifications,
      erpReference,
      isAvailable: true
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMaterials = async (req, res) => {
  try {
    const where = {};
    
    // If vendor, show only their materials
    if (req.user.role === 'vendor') {
      where.vendorId = req.user.id;
    }

    // Filter by category if provided
    if (req.query.category) {
      where.category = req.query.category;
    }

    // Filter by availability
    if (req.query.available === 'true') {
      where.isAvailable = true;
      where.stockLevel = { [Op.gt]: 0 };
    }

    // Filter by low stock
    if (req.query.lowStock === 'true') {
      where.stockLevel = { [Op.lte]: sequelize.col('minStockLevel') };
    }

    const materials = await Material.findAll({
      where,
      include: [
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'vendor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Only the vendor who created the material can update it
    if (material.vendorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await material.update(req.body);
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { stockLevel } = req.body;
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Only the vendor who created the material can update stock
    if (material.vendorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await material.update({ 
      stockLevel,
      isAvailable: stockLevel > 0
    });

    // If stock is below minimum, send notification (implement notification system)
    if (stockLevel <= material.minStockLevel) {
      // Notify vendor about low stock
      // Implementation needed
    }

    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id);

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Only the vendor who created the material can delete it
    if (material.vendorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await material.destroy();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stockLevel }

    // Verify all materials belong to the vendor
    const materialIds = updates.map(u => u.id);
    const materials = await Material.findAll({
      where: {
        id: materialIds,
        vendorId: req.user.id
      }
    });

    if (materials.length !== materialIds.length) {
      return res.status(403).json({ error: 'Not authorized for some materials' });
    }

    // Perform updates
    await Promise.all(
      updates.map(async ({ id, stockLevel }) => {
        const material = materials.find(m => m.id === id);
        await material.update({
          stockLevel,
          isAvailable: stockLevel > 0
        });

        // Check for low stock
        if (stockLevel <= material.minStockLevel) {
          // Notify vendor about low stock
          // Implementation needed
        }
      })
    );

    res.json({ message: 'Stock levels updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  updateStock,
  deleteMaterial,
  bulkUpdateStock
};
