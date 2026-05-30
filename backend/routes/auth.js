import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to format user JSON fields
function formatUser(user) {
  if (!user) return null;
  return {
    ...user,
    passwordHash: undefined,
    skills: user.skills ? JSON.parse(user.skills) : [],
    verifiedSkills: user.verifiedSkills ? JSON.parse(user.verifiedSkills) : [],
    education: user.education ? JSON.parse(user.education) : [],
    workExperience: user.workExperience ? JSON.parse(user.workExperience) : [],
    savedNotes: user.savedNotes ? JSON.parse(user.savedNotes) : {},
    portfolioItems: user.portfolioItems ? user.portfolioItems.map(item => ({
      ...item,
      tools: item.tools ? JSON.parse(item.tools) : []
    })) : []
  };
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'both',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        verified: true,
        proMember: false,
        bio: 'Passionate developer and collaborator.',
        hourlyRate: 50,
        availability: 'available',
        location: 'San Francisco, CA',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        skills: JSON.stringify(['React']),
        verifiedSkills: JSON.stringify([]),
        education: JSON.stringify([]),
        workExperience: JSON.stringify([]),
        savedNotes: JSON.stringify({})
      }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'super-secret-jwt-key-talentstage-2026', { expiresIn: '7d' });
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'super-secret-jwt-key-talentstage-2026', { expiresIn: '7d' });
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET CURRENT USER PROFILE
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { portfolioItems: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE PROFILE
router.put('/profile/update', authenticateToken, async (req, res) => {
  try {
    const { bio, hourlyRate, skills, verifiedSkills, education, workExperience, availability, location, name } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (hourlyRate !== undefined) updateData.hourlyRate = Number(hourlyRate);
    if (availability !== undefined) updateData.availability = availability;
    if (location !== undefined) updateData.location = location;
    
    if (skills !== undefined) updateData.skills = JSON.stringify(skills);
    if (verifiedSkills !== undefined) updateData.verifiedSkills = JSON.stringify(verifiedSkills);
    if (education !== undefined) updateData.education = JSON.stringify(education);
    if (workExperience !== undefined) updateData.workExperience = JSON.stringify(workExperience);

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData
    });

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL FREELANCERS
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await prisma.user.findMany({
      where: {
        role: { in: ['freelancer', 'both'] }
      },
      include: {
        portfolioItems: true
      }
    });
    res.json(freelancers.map(formatUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE FREELANCER
router.get('/freelancers/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { portfolioItems: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE SAVED NOTES
router.put('/freelancers/:id/notes', authenticateToken, async (req, res) => {
  try {
    const { note } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notes = user.savedNotes ? JSON.parse(user.savedNotes) : {};
    notes[req.params.id] = note;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { savedNotes: JSON.stringify(notes) }
    });

    res.json(formatUser(updatedUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD PORTFOLIO ITEM
router.post('/profile/portfolio', authenticateToken, async (req, res) => {
  try {
    const { title, category, tools, desc, github, live } = req.body;
    if (!title || !desc) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    await prisma.portfolioItem.create({
      data: {
        userId: req.userId,
        title,
        category: category || 'Web Dev',
        tools: JSON.stringify(tools || []),
        desc,
        github: github || '',
        live: live || ''
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { portfolioItems: true }
    });

    res.status(201).json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
