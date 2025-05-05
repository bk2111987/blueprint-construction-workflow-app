const { Bid, Project, User } = require('../models');

const createBid = async (req, res) => {
  try {
    const {
      projectId,
      amount,
      timeline,
      description,
      materialCosts,
      laborCosts,
      startDate,
      documents
    } = req.body;

    // Verify project exists and is open for bidding
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if (project.status !== 'bidding') {
      return res.status(400).json({ error: 'Project is not open for bidding' });
    }

    // Create bid
    const bid = await Bid.create({
      projectId,
      bidderId: req.user.id,
      amount,
      timeline,
      description,
      materialCosts,
      laborCosts,
      startDate,
      documents,
      status: 'pending'
    });

    // Include bidder information in response
    const bidWithBidder = await Bid.findByPk(bid.id, {
      include: [
        {
          model: User,
          as: 'bidder',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json(bidWithBidder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBids = async (req, res) => {
  try {
    const where = {};
    
    // Filter bids based on user role and query parameters
    if (req.user.role === 'subcontractor') {
      where.bidderId = req.user.id;
    } else if (req.user.role === 'contractor') {
      const projectIds = await Project.findAll({
        where: { contractorId: req.user.id },
        attributes: ['id']
      }).map(p => p.id);
      where.projectId = projectIds;
    }

    if (req.query.projectId) {
      where.projectId = req.query.projectId;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const bids = await Bid.findAll({
      where,
      include: [
        {
          model: User,
          as: 'bidder',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'bidder',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Project,
          attributes: ['id', 'title', 'status', 'contractorId']
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Check if user has permission to view bid
    if (
      bid.bidderId !== req.user.id && 
      bid.Project.contractorId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Only bidder can update their bid
    if (bid.bidderId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Can only update pending bids
    if (bid.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot update non-pending bid' });
    }

    await bid.update(req.body);
    res.json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          attributes: ['contractorId', 'status']
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Only project contractor can accept bids
    if (bid.Project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Can only accept bids on projects in bidding status
    if (bid.Project.status !== 'bidding') {
      return res.status(400).json({ error: 'Project is not in bidding status' });
    }

    // Update bid status and project status
    await bid.update({ status: 'accepted' });
    await bid.Project.update({ status: 'in_progress' });

    // Reject all other bids for this project
    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          projectId: bid.projectId,
          id: { [Op.ne]: bid.id }
        }
      }
    );

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          attributes: ['contractorId']
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Only project contractor can reject bids
    if (bid.Project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await bid.update({ status: 'rejected' });
    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBid,
  getBids,
  getBidById,
  updateBid,
  acceptBid,
  rejectBid
};
