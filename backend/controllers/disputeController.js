const { Dispute, Project, User } = require('../models');

const createDispute = async (req, res) => {
  try {
    const { projectId, againstId, reason, evidencePhotos } = req.body;

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify 'against' user exists
    const againstUser = await User.findByPk(againstId);
    if (!againstUser) {
      return res.status(404).json({ error: 'User to dispute against not found' });
    }

    // Create dispute
    const dispute = await Dispute.create({
      projectId,
      raisedById: req.user.id,
      againstId,
      reason,
      evidencePhotos,
      status: 'open'
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDisputes = async (req, res) => {
  try {
    const where = {};

    // Filter disputes based on user role
    if (req.user.role === 'contractor' || req.user.role === 'customer') {
      where.projectId = req.query.projectId;
    } else {
      // For vendors and subcontractors, show disputes involving them
      where[Op.or] = [
        { raisedById: req.user.id },
        { againstId: req.user.id }
      ];
    }

    const disputes = await Dispute.findAll({
      where,
      include: [
        { model: Project },
        { model: User, as: 'raisedBy', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'against', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findByPk(req.params.id, {
      include: [
        { model: Project },
        { model: User, as: 'raisedBy', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'against', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Check if user is involved in dispute
    if (![dispute.raisedById, dispute.againstId].includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByPk(req.params.id);

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Only raisedBy or against user can update dispute
    if (![dispute.raisedById, dispute.againstId].includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await dispute.update(req.body);
    res.json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findByPk(req.params.id);

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    // Only contractor or customer can resolve dispute
    if (![dispute.raisedById, dispute.againstId].includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await dispute.update({
      status: 'resolved',
      resolution: req.body.resolution,
      resolvedAt: new Date()
    });

    res.json(dispute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDispute,
  getDisputes,
  getDisputeById,
  updateDispute,
  resolveDispute
};
