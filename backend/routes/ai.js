import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to call Claude API
async function callClaudeAPI(systemPrompt, userPrompt, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Claude API Failed: Status ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || "";
  
  // Clean JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Claude did not return structured JSON.");
}

// Simulates intelligence when API key is missing
function simulateClaudeIntelligence(feature, inputs) {
  switch (feature) {
    case 'match': {
      const { title, description, skills, budget, freelancers } = inputs;
      const sorted = freelancers.map(fl => {
        let score = 55;
        const flSkills = fl.skills ? (typeof fl.skills === 'string' ? JSON.parse(fl.skills) : fl.skills) : [];
        const skillOverlap = flSkills.filter(s => skills.includes(s));
        score += skillOverlap.length * 12;
        
        const impliedBudget = fl.hourlyRate * 15;
        if (impliedBudget <= budget) score += 15;
        else score -= 10;
        
        score += (fl.rating - 4.0) * 10;
        score = Math.min(Math.round(score), 99);

        let reasoning = `Excellent overlap of ${skillOverlap.join(', ') || 'required skills'}. Pricing fits client's guidelines.`;
        if (fl.proMember) reasoning = `[Pro Member] ` + reasoning;
        
        return {
          freelancerId: fl.id,
          matchScore: score,
          reasoning: reasoning
        };
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
      
      return { matches: sorted };
    }
    case 'evaluate': {
      const { proposals } = inputs;
      const evaluations = proposals.map(p => {
        const rel = Math.floor(Math.random() * 3) + 8; // 8-10
        const cla = Math.floor(Math.random() * 3) + 7; // 7-9
        const val = Math.floor(Math.random() * 4) + 6; // 6-9
        const total = rel + cla + val;
        return {
          proposalId: p.id,
          relevance: rel,
          clarity: cla,
          valueForMoney: val,
          totalScore: total,
          recommendation: p.cover.length > 80 
            ? "Thorough scope outline. Demonstrates outstanding portfolio credentials." 
            : "Good bid, but could expand more on exact deliverables workflows.",
          shortlist: total >= 23
        };
      });
      return { evaluations };
    }
    case 'portfolio_review': {
      const { portfolio } = inputs;
      const score = portfolio.length === 0 ? 30 : Math.min(60 + portfolio.length * 10, 95);
      return {
        overallScore: score,
        strengths: [
          "Nice separation of tech badges",
          portfolio.length > 0 ? "Strong display of portfolio links" : "Clean template layout"
        ],
        improvements: [
          { area: "Project Descriptions", issue: "Somewhat terse outlines", suggestion: "Explain deliverables and client problems resolved.", priority: "high" },
          { area: "Source Code Verification", issue: "Missing git repositories", suggestion: "Add GitHub links to all listed work items.", priority: "medium" }
        ],
        missingElements: [
          "Client testimonial quotes",
          "Detailed project process walkthroughs"
        ]
      };
    }
    case 'skill_test': {
      const { skill } = inputs;
      return {
        questions: [
          { q: `What is the core performance benefit of virtual rendering in ${skill}?`, options: ["Recreating entire DOM logs", "Drawing only elements within view margins", "Accelerating garbage collections", "Bypassing GPU compilation"], answer: "B", type: "mcq" },
          { q: `Which architecture paradigm best handles highly asynchronous mutations of ${skill} structures?`, options: ["Global reactive state models", "Direct state variables injection", "CSS inline stylesheets mappings", "File System synchronous blocks"], answer: "A", type: "mcq" },
          { q: `How do you enforce security and avoid memory leaks inside continuous listening processes?`, options: ["Ignoring unsubscribe triggers", "Invoking cancellation triggers inside cleanup routines", "Increasing browser cache bounds", "Using setTimeout continuously"], answer: "B", type: "mcq" },
          { q: `What does high-performance scaling of ${skill} applications require?`, options: ["Massive recursive loops", "Clean component separation and memoized structures", "Relying on standard body tags styles", "Loading large image assets in-memory"], answer: "B", type: "mcq" },
          { q: `How are custom layout animations ideally executed in ${skill}?`, options: ["CSS keyframes paired with hardware acceleration tags", "Blocking Javascript timers", "Re-mounting DOM nodes hourly", "Forcing browser window page refreshes"], answer: "A", type: "mcq" },
          { q: `What is a common pitfall of un-optimized build bundlers for ${skill}?`, options: ["Large unused JS files loading concurrently", "Automatic server failure alerts", "Direct API key encryptions", "Muted theme stylesheets"], answer: "A", type: "mcq" },
          { q: `Which pattern optimizes modular, reusable UI parts in ${skill}?`, options: ["Encapsulating props interface and state separation", "Writing a single large file index", "Using absolute local paths only", "Hardcoding custom colors values"], answer: "A", type: "mcq" },
          { q: `How do you handle error boundaries inside production-grade ${skill} systems?`, options: ["Catching stack exceptions and outputting fallback visuals", "Forcing app page crash reports", "Muting console error outputs", "Disabling component mount features"], answer: "A", type: "mcq" },
          { q: "Describe how you optimize latency and minimize client-side database fetches in complex setups.", answer: "", type: "practical" },
          { q: "Write a short pseudocode demonstrating clean async state handling and cleanup hooks.", answer: "", type: "practical" }
        ]
      };
    }
    case 'scope': {
      const { vagueness } = inputs;
      const title = vagueness.toLowerCase().includes("bakery") ? "Bakery Digital E-Commerce Suite" : "SaaS Workspace Launchpad";
      const skills = vagueness.toLowerCase().includes("bakery") ? ["React", "UI/UX Design", "SEO"] : ["React", "TypeScript", "Node.js"];
      
      return {
        projectTitle: title,
        summary: `Transforming vagueness: "${vagueness}" into a premium SaaS dashboard architecture.`,
        deliverables: [
          "Responsive mobile orders layouts",
          "Sleek obsidian color token config assets",
          "Milestone visual trackers and payments logic integrations"
        ],
        suggestedTimeline: "3-4 weeks",
        budgetRange: { min: 800, max: 1800 },
        requiredSkills: skills,
        milestones: [
          { name: "Visual Figma layouts", duration: "1 week", description: "Design Obsidian UI mockup drafts." },
          { name: "Responsive React frontend", duration: "1 week", description: "Code core grid tables & components." },
          { name: "API & release", duration: "1 week", description: "Final testing and mock database integrations." }
        ]
      };
    }
    default:
      return {};
  }
}

// 1. AI SCOPING ASSISTANT
router.post('/scope', async (req, res) => {
  try {
    const { vagueness } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      const sys = "You are a project scoping expert. Convert vague client needs into beautiful JSON brief maps. Return ONLY valid JSON: { \"projectTitle\": \"...\", \"summary\": \"...\", \"deliverables\": [\"...\"], \"suggestedTimeline\": \"...\", \"budgetRange\": { \"min\": 500, \"max\": 1500 }, \"requiredSkills\": [\"...\"], \"milestones\": [] }";
      const result = await callClaudeAPI(sys, `Scoping need: ${vagueness}`, apiKey);
      return res.json(result);
    }

    // Heuristic Fallback
    const result = simulateClaudeIntelligence('scope', { vagueness });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. AI SMART MATCH
router.post('/match', async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const freelancers = await prisma.user.findMany({
      where: { role: { in: ['freelancer', 'both'] } }
    });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const skills = project.skills ? JSON.parse(project.skills) : [];

    if (apiKey) {
      const sys = "You are a freelancer matching engine. Ranks the top 5 freelancers for a brief. Return ONLY JSON: { \"matches\": [ { \"freelancerId\": \"...\", \"matchScore\": 92, \"reasoning\": \"...\" } ] }";
      const user = `Project: ${project.title}. Skills: ${skills.join(', ')}. Budget: ${project.budget}. Freelancers: ${JSON.stringify(freelancers.map(f => ({ id: f.id, name: f.name, hourlyRate: f.hourlyRate, skills: f.skills ? JSON.parse(f.skills) : [] })))}`;
      const result = await callClaudeAPI(sys, user, apiKey);
      return res.json(result);
    }

    // Heuristic Fallback
    const result = simulateClaudeIntelligence('match', {
      title: project.title,
      description: project.description,
      skills,
      budget: project.budget,
      freelancers
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. AI EVALUATE BIDS
router.post('/evaluate', async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const proposals = await prisma.proposal.findMany({
      where: { projectId },
      include: {
        freelancer: {
          select: { id: true, name: true, skills: true }
        }
      }
    });

    if (proposals.length === 0) {
      return res.json({ evaluations: [] });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const deliverables = project.deliverables ? JSON.parse(project.deliverables) : [];

    if (apiKey) {
      const sys = "You are a proposal evaluator. Grade bids on Relevance (0-10), Clarity (0-10), Value (0-10). Return ONLY JSON: { \"evaluations\": [ { \"proposalId\": \"...\", \"relevance\": 8, \"clarity\": 9, \"valueForMoney\": 7, \"totalScore\": 24, \"recommendation\": \"...\", \"shortlist\": true } ] }";
      const user = `Project: ${project.title}. Deliverables: ${deliverables.join(', ')}. Proposals: ${JSON.stringify(proposals)}`;
      const result = await callClaudeAPI(sys, user, apiKey);
      return res.json(result);
    }

    // Heuristic Fallback
    const result = simulateClaudeIntelligence('evaluate', { proposals });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. AI PORTFOLIO REVIEW
router.post('/portfolio-review', authenticateToken, async (req, res) => {
  try {
    const portfolio = await prisma.portfolioItem.findMany({
      where: { userId: req.userId }
    });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      const sys = "You are a senior portfolio auditor. Review the portfolio list. Return ONLY JSON: { \"overallScore\": 85, \"strengths\": [\"...\"], \"improvements\": [ { \"area\": \"...\", \"issue\": \"...\", \"suggestion\": \"...\", \"priority\": \"high\" } ], \"missingElements\": [\"...\"] }";
      const result = await callClaudeAPI(sys, JSON.stringify(portfolio), apiKey);
      return res.json(result);
    }

    const result = simulateClaudeIntelligence('portfolio_review', { portfolio });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. AI SKILL TEST GENERATOR
router.post('/skill-test', async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ error: 'Skill name is required' });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      const sys = "You are a technical quiz constructor. Generate 8 MCQs and 2 practical text questions. Return ONLY JSON: { \"questions\": [ { \"q\": \"...\", \"options\": [\"...\"], \"answer\": \"A|B|C|D\", \"type\": \"mcq\" } ] }";
      const result = await callClaudeAPI(sys, `Construct quiz for skill: ${skill}`, apiKey);
      return res.json(result);
    }

    const result = simulateClaudeIntelligence('skill_test', { skill });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
