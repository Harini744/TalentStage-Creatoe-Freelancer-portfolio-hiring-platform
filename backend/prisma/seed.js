import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Delete all existing data to prevent duplicate keys
  await prisma.transaction.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.proposal.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.portfolioItem.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.feedPost.deleteMany({});
  await prisma.challenge.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Freelancers
  const freelancersData = [
    {
      id: "fl-1",
      name: "Alex Rivera",
      email: "alex@rivera.dev",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=33",
      verified: true,
      proMember: true,
      bio: "Ex-Vercel frontend engineer focused on building premium, high-performance web applications. Expert in React, Next.js, tailwind layout engineering, and LLM API orchestrations.",
      hourlyRate: 85,
      availability: "available",
      location: "San Francisco, CA",
      memberSince: "Jan 2024",
      skills: JSON.stringify(["React", "Tailwind CSS", "Node.js", "TypeScript", "GraphQL"]),
      verifiedSkills: JSON.stringify(["React", "Tailwind CSS", "TypeScript"]),
      education: JSON.stringify([{ institution: "Stanford University", degree: "B.S. Computer Science", year: "2023" }]),
      workExperience: JSON.stringify([{ company: "Vercel", role: "UI Engineer", duration: "2023 - 2024", description: "Led development of core developer dashboard elements using Next.js." }]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-2",
      name: "Sophia Chen",
      email: "sophia@design.co",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=47",
      verified: true,
      proMember: false,
      bio: "Award-winning brand strategist and interface developer. I craft deep editorial design languages, obsidian-black SaaS visual architectures, and interactive digital art directories.",
      hourlyRate: 75,
      availability: "offers",
      location: "Vancouver, BC",
      memberSince: "Mar 2024",
      skills: JSON.stringify(["UI/UX Design", "Figma", "Tailwind CSS", "Brand Strategy"]),
      verifiedSkills: JSON.stringify(["UI/UX Design", "Brand Strategy"]),
      education: JSON.stringify([{ institution: "RISD", degree: "B.F.A. Graphic Design", year: "2021" }]),
      workExperience: JSON.stringify([{ company: "Design Studio", role: "Senior Designer", duration: "2022 - Present", description: "Crafting beautiful SaaS products for early-stage fintech projects." }]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-3",
      name: "Marcus Johnson",
      email: "marcus@motion.io",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=12",
      verified: false,
      proMember: true,
      bio: "Dynamic content creator specializing in SaaS explainer videos, cinematic product announcements, and social promotional media. Expertise in After Effects and Premier Pro.",
      hourlyRate: 60,
      availability: "available",
      location: "Austin, TX",
      memberSince: "Nov 2024",
      skills: JSON.stringify(["Video", "Motion Graphics", "Color Grading", "Writing"]),
      verifiedSkills: JSON.stringify(["Video"]),
      education: JSON.stringify([{ institution: "UT Austin", degree: "B.A. Radio & Film", year: "2020" }]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-4",
      name: "Elena Rostova",
      email: "elena@write.tech",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=26",
      verified: true,
      proMember: false,
      bio: "Turning complex API concepts, developer tooling structures, and cloud infrastructures into simple, compelling documentation and copy that converts developers into buyers.",
      hourlyRate: 45,
      availability: "offers",
      location: "Berlin, DE",
      memberSince: "Feb 2024",
      skills: JSON.stringify(["Copywriting", "SEO", "Technical Writing", "Python"]),
      verifiedSkills: JSON.stringify(["Technical Writing"]),
      education: JSON.stringify([{ institution: "Humboldt University", degree: "M.A. English Philology", year: "2019" }]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-5",
      name: "Devon Carter",
      email: "devon@carter.dev",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=68",
      verified: true,
      proMember: true,
      bio: "Ex-Apple senior iOS engineer building fluid mobile interfaces. Specialized in Swift, SwiftUI, performance-critical animation cycles, and offline-first localized architectures.",
      hourlyRate: 95,
      availability: "unavailable",
      location: "New York, NY",
      memberSince: "Sep 2023",
      skills: JSON.stringify(["Mobile Developer", "Swift", "Objective-C", "React"]),
      verifiedSkills: JSON.stringify(["Mobile Developer", "Swift"]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-6",
      name: "Aria Vance",
      email: "aria@vance.seo",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=49",
      verified: false,
      proMember: false,
      bio: "Data-driven SEO strategist focusing on high-intent query capturing, technical core web vital optimization, and content audit automation pipelines that rank SaaS on Page 1.",
      hourlyRate: 55,
      availability: "available",
      location: "London, UK",
      memberSince: "Dec 2024",
      skills: JSON.stringify(["SEO", "Google Analytics", "Python", "Copywriting"]),
      verifiedSkills: JSON.stringify(["SEO"]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-7",
      name: "Nikolai Tesla",
      email: "nikolai@ai.io",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=60",
      verified: true,
      proMember: true,
      bio: "Pioneering LLM integration frameworks and semantic vector search engines. Expert in langchain, llama-index, cognitive agent designs, and custom transformer weights tuning.",
      hourlyRate: 120,
      availability: "available",
      location: "Zagreb, HR",
      memberSince: "May 2024",
      skills: JSON.stringify(["React", "Python", "Machine Learning", "Node.js"]),
      verifiedSkills: JSON.stringify(["Machine Learning", "Python"]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "fl-8",
      name: "Priya Nair",
      email: "priya@nair.cloud",
      passwordHash: defaultPasswordHash,
      role: "freelancer",
      avatar: "https://i.pravatar.cc/150?img=45",
      verified: true,
      proMember: false,
      bio: "AWS Certified Solution Architect Pro. I automate multi-region failovers, manage cost-efficient Kubernetes clusters under autoscaling loads, and design secure SOC2-compliant VPC tunnels.",
      hourlyRate: 110,
      availability: "offers",
      location: "Bangalore, IN",
      memberSince: "Jun 2023",
      skills: JSON.stringify(["Cloud Architect", "Docker", "Kubernetes", "AWS"]),
      verifiedSkills: JSON.stringify(["Cloud Architect", "Kubernetes"]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    }
  ];

  for (const f of freelancersData) {
    await prisma.user.create({ data: f });
  }

  // 2. Seed default Client Users (for seed projects)
  const clientsData = [
    {
      id: "cl-1",
      name: "Linear Inc",
      email: "hiring@linear.app",
      passwordHash: defaultPasswordHash,
      role: "client",
      avatar: "https://i.pravatar.cc/150?img=11",
      verified: true,
      proMember: true,
      memberSince: "Jan 2024",
      skills: JSON.stringify([]),
      verifiedSkills: JSON.stringify([]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "cl-2",
      name: "Stripe Flow",
      email: "hiring@stripe.com",
      passwordHash: defaultPasswordHash,
      role: "client",
      avatar: "https://i.pravatar.cc/150?img=22",
      verified: true,
      proMember: false,
      memberSince: "Feb 2024",
      skills: JSON.stringify([]),
      verifiedSkills: JSON.stringify([]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "cl-3",
      name: "DevTalk Media",
      email: "hiring@devtalk.com",
      passwordHash: defaultPasswordHash,
      role: "client",
      avatar: "https://i.pravatar.cc/150?img=33",
      verified: false,
      proMember: false,
      memberSince: "Mar 2024",
      skills: JSON.stringify([]),
      verifiedSkills: JSON.stringify([]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    },
    {
      id: "cl-4",
      name: "CloudGate",
      email: "hiring@cloudgate.com",
      passwordHash: defaultPasswordHash,
      role: "client",
      avatar: "https://i.pravatar.cc/150?img=44",
      verified: true,
      proMember: false,
      memberSince: "Apr 2024",
      skills: JSON.stringify([]),
      verifiedSkills: JSON.stringify([]),
      education: JSON.stringify([]),
      workExperience: JSON.stringify([]),
      savedNotes: JSON.stringify({})
    }
  ];

  for (const c of clientsData) {
    await prisma.user.create({ data: c });
  }

  // Seed default test user (Keerthi)
  const testUser = await prisma.user.create({
    data: {
      id: "user-current",
      name: "Keerthi Arumugam",
      email: "keerthi@talentstage.ai",
      passwordHash: defaultPasswordHash,
      role: "both",
      avatar: "https://i.pravatar.cc/150?img=12",
      verified: true,
      proMember: false,
      bio: "Passionate full-stack developer and system architect with deep interest in reactive web engines, clean layout typography, and AI tools integration.",
      hourlyRate: 65,
      availability: "available",
      location: "Austin, TX",
      memberSince: "May 2026",
      skills: JSON.stringify(["React", "Tailwind CSS", "Node.js", "Python", "UI/UX Design"]),
      verifiedSkills: JSON.stringify(["React"]),
      education: JSON.stringify([{ institution: "Texas A&M", degree: "B.S. Software Engineering", year: "2025" }]),
      workExperience: JSON.stringify([{ company: "Tech Startup", role: "Junior Architect", duration: "2025 - Present", description: "Integrated LLM pipelines and crafted state interfaces." }]),
      savedNotes: JSON.stringify({})
    }
  });

  // 3. Seed Portfolio Items for Alex Rivera
  await prisma.portfolioItem.create({
    data: {
      id: "p-1-1",
      userId: "fl-1",
      title: "Glassmorphic AI Sandbox",
      category: "Web Dev",
      tools: JSON.stringify(["React", "Tailwind", "Claude API"]),
      desc: "A full IDE experience for prompt engineering with live markdown render grids.",
      github: "https://github.com",
      live: "https://live.com"
    }
  });
  await prisma.portfolioItem.create({
    data: {
      id: "p-1-2",
      userId: "fl-1",
      title: "SaaS Analytics Dashboard",
      category: "Web Dev",
      tools: JSON.stringify(["Next.js", "Recharts", "Prisma"]),
      desc: "High-performance data visualizer mapping real-time billing metrics.",
      github: "https://github.com",
      live: "https://live.com"
    }
  });

  // Seed Portfolio Item for Sophia Chen
  await prisma.portfolioItem.create({
    data: {
      id: "p-2-1",
      userId: "fl-2",
      title: "Fintech Rebrand & App Layout",
      category: "Design",
      tools: JSON.stringify(["Figma", "Typography"]),
      desc: "Complete obsidian UI design language for gold trading terminal.",
      github: "",
      live: "https://figma.com"
    }
  });

  // Seed Portfolio Item for Keerthi
  await prisma.portfolioItem.create({
    data: {
      id: "p-c-1",
      userId: "user-current",
      title: "Personal Coffee Hub UI",
      category: "Design",
      tools: JSON.stringify(["Figma", "Tailwind"]),
      desc: "Custom order grids styled with muted gold tones.",
      github: "",
      live: ""
    }
  });

  // 4. Seed Projects
  const projectsData = [
    {
      id: "proj-1",
      title: "React Admin Dashboard & Workspace",
      clientId: "cl-1", // Linear Inc
      budget: 2000,
      type: "fixed",
      category: "Web Dev",
      deadline: "2026-06-25",
      skills: JSON.stringify(["React", "Tailwind CSS", "GraphQL"]),
      postedDate: "2026-05-24",
      experienceLevel: "Expert",
      description: "We are seeking a senior frontend engineer to build our new developer administration dashboard. The project requires high-performance grid rendering, customizable analytics widget panels, and a sleek obsidian color schema.",
      deliverables: JSON.stringify(["Obsidian UI theme dashboard layouts", "Widgets configurations panel", "GraphQL API integrations & unit tests"])
    },
    {
      id: "proj-2",
      title: "Brand Identity Design for Fintech SaaS",
      clientId: "cl-2", // Stripe Flow
      budget: 1500,
      type: "fixed",
      category: "Design",
      deadline: "2026-06-12",
      skills: JSON.stringify(["UI/UX Design", "Figma", "Brand Strategy"]),
      postedDate: "2026-05-25",
      experienceLevel: "Intermediate",
      description: "Looking for an editorial designer to craft our product logo, color tokens, and 4 primary dashboard template screens in Figma. Style: minimal, typography-driven, using muted warm gold accents.",
      deliverables: JSON.stringify(["Vector brand assets & guidelines", "Figma high-fidelity prototypes", "Design tokens layout sheet"])
    },
    {
      id: "proj-3",
      title: "YouTube Explainer Video Editing",
      clientId: "cl-3", // DevTalk Media
      budget: 600,
      type: "hourly",
      category: "Video",
      deadline: "2026-06-08",
      skills: JSON.stringify(["Video", "Motion Graphics"]),
      postedDate: "2026-05-23",
      experienceLevel: "Beginner",
      description: "We need an editor to slice a 12-minute technical interview, add modern micro-animations, text pop-overs for command references, and balance audio profiles cleanly.",
      deliverables: JSON.stringify(["12-minute final 4K cut video", "Social-optimized trailers (3x 60s)"])
    },
    {
      id: "proj-4",
      title: "Technical Blog Writing on Kubernetes Failovers",
      clientId: "cl-4", // CloudGate
      budget: 450,
      type: "fixed",
      category: "Writing",
      deadline: "2026-06-05",
      skills: JSON.stringify(["Technical Writing", "SEO"]),
      postedDate: "2026-05-26",
      experienceLevel: "Expert",
      description: "Looking for a DevOps engineer who writes compelling content. You will write a comprehensive 2,500-word tutorial on multi-region AWS EKS disaster recovery mechanisms.",
      deliverables: JSON.stringify(["2,500 words article with code snippets", "Metadata header definitions & graphics layout suggestion"])
    }
  ];

  for (const p of projectsData) {
    await prisma.project.create({ data: p });
  }

  // 5. Seed Proposals
  await prisma.proposal.create({
    data: {
      id: "prop-seed-1",
      freelancerId: "fl-1",
      projectId: "proj-1",
      bidAmount: 1800,
      timeline: "2 weeks",
      cover: "Hi! I would love to build this admin dashboard for Linear. I have designed custom widget systems at Vercel and can start today.",
      status: "Pending",
      postedDate: "2026-05-24"
    }
  });

  await prisma.proposal.create({
    data: {
      id: "prop-seed-2",
      freelancerId: "fl-7",
      projectId: "proj-1",
      bidAmount: 2200,
      timeline: "2 weeks",
      cover: "I specialize in high-performance React architectures and AI systems. Can integrate LLM widgets instantly.",
      status: "Shortlisted",
      postedDate: "2026-05-24"
    }
  });

  // 6. Seed Feed Posts
  const feedPostsData = [
    {
      authorName: "Alex Rivera",
      authorAvatar: "https://i.pravatar.cc/150?img=33",
      category: "Wins",
      content: "Just shipped the brand new AI Matchmaking module for a client. 98% matching accuracy on test vectors! Next.js and Tailwind were absolute champions on this delivery. ✨",
      likes: 24,
      comments: 5,
      time: "2 hrs ago",
      likedUsers: JSON.stringify([])
    },
    {
      authorName: "Sophia Chen",
      authorAvatar: "https://i.pravatar.cc/150?img=47",
      category: "Resources",
      content: "Curated a Google sheet of premium serif typefaces for dark SaaS products. Drop a comment below if you want the Notion workspace template direct link! 🎨",
      likes: 45,
      comments: 19,
      time: "4 hrs ago",
      likedUsers: JSON.stringify([])
    },
    {
      authorName: "Devon Carter",
      authorAvatar: "https://i.pravatar.cc/150?img=68",
      category: "Tips",
      content: "Pro-tip for iOS developers: Always optimize image caching inside SwiftUI Lists. Standard AsyncImage re-triggers network fetches when loading fast scrolling lists. Use a custom localized wrapper.",
      likes: 18,
      comments: 2,
      time: "1 day ago",
      likedUsers: JSON.stringify([])
    },
    {
      authorName: "Nikolai Tesla",
      authorAvatar: "https://i.pravatar.cc/150?img=60",
      category: "Tips",
      content: "To bypass Anthropic direct client-side fetch blocks (like CORS or missing keys) in local sandboxes, implement a mocked heuristic router. This ensures the app is testable 100% of the time, even during API network failures.",
      likes: 32,
      comments: 8,
      time: "1 day ago",
      likedUsers: JSON.stringify([])
    }
  ];

  for (const fp of feedPostsData) {
    await prisma.feedPost.create({ data: fp });
  }

  // 7. Seed Challenges
  const challengesData = [
    {
      id: "chal-1",
      title: "Glassmorphic SaaS Trading Dashboard",
      description: "Design or build an editorial obsidian trading interface for a gold backing token. Highlight key transactional logs, visual charts, and modal sliders.",
      prize: "$250 + Verified UI Badge",
      deadline: "3d 4h 12m",
      submissions: 14,
      winner: null,
      active: true
    },
    {
      id: "chal-2",
      title: "Docker Dev Container Orchestration",
      description: "Create a docker-compose configuration automating hot-reloads, database migrations, and telemetry triggers in developer setups.",
      prize: "$150 + Dev Credentials",
      deadline: "Completed",
      winner: "Nikolai Tesla",
      submissions: 8,
      active: false
    },
    {
      id: "chal-3",
      title: "Technical Writing: Next-Gen API Design",
      description: "Write an editorial post detailing why GraphQL subscriptions are losing developer adoption to RPC servers like tRPC.",
      prize: "$100 + Writing Badge",
      deadline: "Completed",
      winner: "Elena Rostova",
      submissions: 19,
      active: false
    }
  ];

  for (const ch of challengesData) {
    await prisma.challenge.create({ data: ch });
  }

  // 8. Seed Transactions for Keerthi
  const transactionsData = [
    {
      userId: "user-current",
      date: "May 24, 2026",
      project: "React Admin Dashboard",
      client: "Linear Inc",
      type: "Income",
      gross: 1000,
      net: 900,
      commission: 100,
      status: "completed"
    },
    {
      userId: "user-current",
      date: "May 22, 2026",
      project: "Brand Identity Layout",
      client: "Stripe Flow",
      type: "Income",
      gross: 500,
      net: 450,
      commission: 50,
      status: "completed"
    },
    {
      userId: "user-current",
      date: "May 15, 2026",
      project: "Withdrawal to Chase Bank",
      client: "Personal Wallet",
      type: "Withdrawal",
      gross: -2000,
      net: -2000,
      commission: 0,
      status: "completed"
    }
  ];

  for (const tx of transactionsData) {
    await prisma.transaction.create({ data: tx });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
