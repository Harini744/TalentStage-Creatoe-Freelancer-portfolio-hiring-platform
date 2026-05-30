import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatContract(c) {
  if (!c) return null;
  return {
    ...c,
    deliverables: c.deliverables ? JSON.parse(c.deliverables) : [],
    messages: c.messages ? JSON.parse(c.messages) : []
  };
}

// GET ALL CONTRACTS OF CURRENT USER
router.get('/', authenticateToken, async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        OR: [
          { freelancerId: req.userId },
          { clientId: req.userId }
        ]
      },
      include: {
        project: {
          select: { title: true, category: true }
        },
        freelancer: {
          select: { name: true, avatar: true }
        },
        client: {
          select: { name: true, avatar: true }
        }
      }
    });
    res.json(contracts.map(formatContract));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE CONTRACT (HIRE FREELANCER) — accepts proposalId OR direct projectId/freelancerId/totalValue
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { proposalId, projectId, freelancerId, totalValue } = req.body;

    let projectData, flData, bidAmount;

    if (proposalId) {
      // Legacy: create contract from a proposal record
      const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        include: { project: true }
      });
      if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
      if (proposal.project.clientId !== req.userId) {
        return res.status(403).json({ error: 'Only the project owner can create a contract' });
      }
      projectData = proposal.project;
      flData = await prisma.user.findUnique({ where: { id: proposal.freelancerId } });
      bidAmount = proposal.bidAmount;

      // Lock proposal as Hired
      await prisma.proposal.update({ where: { id: proposalId }, data: { status: 'Hired' } });
    } else if (projectId && freelancerId && totalValue) {
      // Direct: create contract with explicit values (client hires from manage-audits UI)
      projectData = await prisma.project.findUnique({ where: { id: projectId } });
      if (!projectData) return res.status(404).json({ error: 'Project not found' });
      if (projectData.clientId !== req.userId) {
        return res.status(403).json({ error: 'Only the project owner can create a contract' });
      }
      flData = await prisma.user.findUnique({ where: { id: freelancerId } });
      bidAmount = Number(totalValue);
    } else {
      return res.status(400).json({ error: 'Provide proposalId OR projectId+freelancerId+totalValue' });
    }

    if (!flData) return res.status(404).json({ error: 'Freelancer not found' });

    // Create system messaging log
    const systemMessages = [{
      sender: 'System',
      text: `Contract established with ${flData.name} for $${bidAmount}. Milestone funds locked in escrow.`,
      time: 'Just now'
    }];

    // Deliverables are parsed from project deliverables
    const rawDeliverables = projectData.deliverables ? JSON.parse(projectData.deliverables) : ['Initial Deliverable'];
    const deliverablesList = rawDeliverables.map(name => ({ name, status: 'Not Started' }));

    const contract = await prisma.contract.create({
      data: {
        projectName: projectData.title,
        projectId: projectData.id,
        freelancerId: flData.id,
        clientId: req.userId,
        totalValue: bidAmount,
        deadline: projectData.deadline || '',
        deliverables: JSON.stringify(deliverablesList),
        milestoneReleasedCount: 0,
        status: 'Active',
        messages: JSON.stringify(systemMessages)
      }
    });

    // Log Client payment to Escrow in transactions
    await prisma.transaction.create({
      data: {
        userId: req.userId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        project: projectData.title,
        client: 'Escrow Lock',
        type: 'Withdrawal',
        gross: -bidAmount,
        net: -bidAmount,
        commission: 0,
        status: 'completed'
      }
    });

    res.status(201).json(formatContract(contract));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE DELIVERABLE STATUS (index in body)
router.put('/:id/deliverables', authenticateToken, async (req, res) => {
  try {
    const { index, status } = req.body; // index of deliverable, status: In Progress / Submitted / Approved / Not Started
    if (index === undefined || !status) {
      return res.status(400).json({ error: 'Index and status are required' });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id }
    });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (contract.freelancerId !== req.userId && contract.clientId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deliverables = JSON.parse(contract.deliverables);
    if (!deliverables[index]) {
      return res.status(404).json({ error: 'Deliverable index not found' });
    }

    deliverables[index].status = status;

    const messages = JSON.parse(contract.messages || '[]');
    messages.push({
      sender: 'System',
      text: `Deliverable "${deliverables[index].name}" updated to "${status}".`,
      time: 'Just now'
    });

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: {
        deliverables: JSON.stringify(deliverables),
        messages: JSON.stringify(messages)
      }
    });

    res.json(formatContract(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE DELIVERABLE STATUS (index in URL param - called from frontend)
router.put('/:id/deliverables/:index', authenticateToken, async (req, res) => {
  try {
    const idx = parseInt(req.params.index);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id }
    });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (contract.freelancerId !== req.userId && contract.clientId !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deliverables = JSON.parse(contract.deliverables);
    if (!deliverables[idx]) {
      return res.status(404).json({ error: 'Deliverable index not found' });
    }

    deliverables[idx].status = status;

    const messages = JSON.parse(contract.messages || '[]');
    messages.push({
      sender: 'System',
      text: `Deliverable "${deliverables[idx].name}" updated to "${status}".`,
      time: 'Just now'
    });

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: {
        deliverables: JSON.stringify(deliverables),
        messages: JSON.stringify(messages)
      }
    });

    res.json(formatContract(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RELEASE PAYMENT (ESCROW RELEASE FOR A MILESTONE)
router.post('/:id/release', authenticateToken, async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        freelancer: true,
        client: true
      }
    });
    
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (contract.clientId !== req.userId) {
      return res.status(403).json({ error: 'Only the client can release funds from escrow' });
    }

    const deliverables = JSON.parse(contract.deliverables);
    const totalMilestones = deliverables.length || 1;
    const releasedCount = contract.milestoneReleasedCount + 1;
    
    if (releasedCount > totalMilestones) {
      return res.status(400).json({ error: 'All milestone payments have already been released' });
    }

    // Payout amount logic: split evenly across deliverables
    const rawVal = contract.totalValue / totalMilestones;
    const gross = Math.round(rawVal);
    const commission = Math.round(gross * 0.10); // 10% platform fee
    const net = gross - commission;

    // Increment released milestones count
    const messages = JSON.parse(contract.messages || '[]');
    messages.push({
      sender: 'System',
      text: `Milestone payment ${releasedCount}/${totalMilestones} ($${gross}) released from escrow to ${contract.freelancer.name}.`,
      time: 'Just now'
    });

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: {
        milestoneReleasedCount: releasedCount,
        status: releasedCount === totalMilestones ? 'Completed' : 'Active',
        messages: JSON.stringify(messages)
      }
    });

    // Add Income Transaction for Freelancer
    await prisma.transaction.create({
      data: {
        userId: contract.freelancerId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        project: contract.projectName,
        client: contract.client.name,
        type: 'Income',
        gross,
        net,
        commission,
        status: 'completed'
      }
    });

    res.json(formatContract(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TRANSACTION LEDGER OF LOGGED IN USER
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.userId },
      orderBy: { id: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
