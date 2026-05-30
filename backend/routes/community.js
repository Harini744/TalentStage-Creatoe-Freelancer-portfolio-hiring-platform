import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET FEED POSTS
router.get('/feed', async (req, res) => {
  try {
    const posts = await prisma.feedPost.findMany({
      orderBy: { id: 'desc' }
    });
    
    // Check if token exists to see if the user liked the post
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let loggedInUserId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-jwt-key-talentstage-2026');
        loggedInUserId = decoded.id;
      } catch (err) {
        // Ignore invalid token, proceed guest-like
      }
    }

    res.json(posts.map(p => {
      const list = p.likedUsers ? JSON.parse(p.likedUsers) : [];
      return {
        id: p.id,
        author: p.authorName,
        avatar: p.authorAvatar,
        category: p.category,
        content: p.content,
        comments: p.comments,
        time: p.time,
        liked: loggedInUserId ? list.includes(loggedInUserId) : false,
        likes: list.length
      };
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE FEED POST
router.post('/feed', authenticateToken, async (req, res) => {
  try {
    const { content, category } = req.body;
    if (!content) return res.status(400).json({ error: 'Post content required' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPost = await prisma.feedPost.create({
      data: {
        authorName: user.name,
        authorAvatar: user.avatar,
        category: category || 'Wins',
        content,
        likes: 0,
        comments: 0,
        time: 'Just now',
        likedUsers: JSON.stringify([])
      }
    });

    res.status(201).json({
      ...newPost,
      liked: false,
      likes: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOGGLE LIKE
router.post('/feed/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await prisma.feedPost.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const list = post.likedUsers ? JSON.parse(post.likedUsers) : [];
    const index = list.indexOf(req.userId);
    let liked = false;

    if (index === -1) {
      list.push(req.userId);
      liked = true;
    } else {
      list.splice(index, 1);
    }

    const updated = await prisma.feedPost.update({
      where: { id: req.params.id },
      data: { likedUsers: JSON.stringify(list) }
    });

    res.json({
      id: updated.id,
      likes: list.length,
      liked
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ACTIVE SKILL CHALLENGES
router.get('/challenges', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PORTFOLIO REVIEWS AND MENTOR MATCHING LIST
router.get('/mentors', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Look up some expert profiles
    const experts = await prisma.user.findMany({
      where: {
        role: { in: ['freelancer', 'both'] },
        proMember: true,
        NOT: { id: req.userId }
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        skills: true
      },
      take: 10
    });

    const userSkills = user.skills ? JSON.parse(user.skills) : [];

    const mentorsList = experts.map(exp => {
      const expSkills = exp.skills ? JSON.parse(exp.skills) : [];
      const overlap = expSkills.filter(s => userSkills.includes(s));
      
      // Determine session fee based on expert rating/pro credentials
      const rate = overlap.length > 1 ? 'Free' : '$80/session';
      
      return {
        id: exp.id,
        name: exp.name,
        avatar: exp.avatar,
        specialty: exp.bio ? exp.bio.split('.')[0] : 'General Technical Expert',
        rate
      };
    });

    res.json(mentorsList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
