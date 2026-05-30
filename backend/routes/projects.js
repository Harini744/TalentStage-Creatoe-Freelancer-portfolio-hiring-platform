import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatProject(p) {
  if (!p) return null;
  return {
    ...p,
    skills: p.skills ? JSON.parse(p.skills) : [],
    deliverables: p.deliverables ? JSON.parse(p.deliverables) : []
  };
}

// GET ALL PROJECTS (Marketplace)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        },
        proposals: true
      }
    });
    res.json(projects.map(formatProject));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER'S POSTED PROJECTS
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { clientId: req.userId },
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        },
        proposals: {
          include: {
            freelancer: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    });
    res.json(projects.map(formatProject));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST A NEW PROJECT
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, budget, type, category, deadline, skills, experienceLevel, description, deliverables } = req.body;
    
    if (!title || !budget || !description) {
      return res.status(400).json({ error: 'Title, budget, and description are required' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        clientId: req.userId,
        budget: Number(budget),
        type: type || 'fixed',
        category: category || 'Web Dev',
        deadline: deadline || '',
        skills: JSON.stringify(skills || []),
        postedDate: new Date().toISOString().split('T')[0],
        experienceLevel: experienceLevel || 'Expert',
        description,
        deliverables: JSON.stringify(deliverables || [])
      },
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    res.status(201).json(formatProject(project));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PROJECT BY ID
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: { id: true, name: true, avatar: true }
        },
        proposals: {
          include: {
            freelancer: {
              select: { id: true, name: true, avatar: true, bio: true, hourlyRate: true, skills: true }
            }
          }
        }
      }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(formatProject(project));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SUBMIT A PROPOSAL (BID)
router.post('/:id/proposals', authenticateToken, async (req, res) => {
  try {
    const { bidAmount, timeline, cover } = req.body;
    if (!bidAmount || !cover) {
      return res.status(400).json({ error: 'Bid amount and cover letter required' });
    }

    const existingProposal = await prisma.proposal.findFirst({
      where: {
        projectId: req.params.id,
        freelancerId: req.userId
      }
    });
    if (existingProposal) {
      return res.status(409).json({ error: 'You have already submitted a proposal for this project' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        freelancerId: req.userId,
        projectId: req.params.id,
        bidAmount: Number(bidAmount),
        timeline: timeline || '1 week',
        cover,
        status: 'Pending',
        postedDate: new Date().toISOString().split('T')[0]
      }
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL PROPOSALS OF CURRENT USER
router.get('/my/proposals', authenticateToken, async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: { freelancerId: req.userId },
      include: {
        project: {
          include: {
            client: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PROPOSALS FOR A PROJECT (CLIENT CHECK)
router.get('/:id/proposals', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.clientId !== req.userId) {
      return res.status(403).json({ error: 'Only project owner can view proposals' });
    }

    const proposals = await prisma.proposal.findMany({
      where: { projectId: req.params.id },
      include: {
        freelancer: {
          select: { id: true, name: true, avatar: true, bio: true, hourlyRate: true, skills: true }
        }
      }
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PROPOSAL STATUS
router.put('/proposals/:propId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body; // Shortlisted, Hired, Rejected
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.propId },
      include: { project: true }
    });
    
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    if (proposal.project.clientId !== req.userId) {
      return res.status(403).json({ error: 'Only project owner can update proposal status' });
    }

    const updated = await prisma.proposal.update({
      where: { id: req.params.propId },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
