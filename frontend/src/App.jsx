import React, { useState, useReducer, createContext, useContext, useEffect, useRef } from 'react';
import { 
  Sparkles, Briefcase, FileText, CheckCircle2, AlertCircle, HelpCircle, 
  User, Star, CreditCard, Bell, Search, Menu, X, Plus, ExternalLink, 
  ShieldCheck, Mail, Lock, Unlock, Award, Users, BookOpen, Clock, Check, 
  ChevronRight, Settings, Send, DollarSign, Upload, Filter, ChevronLeft, 
  LogOut, ArrowUpRight, TrendingUp, Info, ChevronDown, CheckSquare, 
  MessageSquare, Heart, Bookmark, Edit, ThumbsUp, Calendar, Play
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

// Import API utilities
import { 
  authAPI, projectsAPI, contractsAPI, communityAPI, aiAPI, 
  saveToken, removeToken, isLoggedIn, apiFetch
} from './api';

// ==========================================
// 1. CONSTANTS & DETAILED SEED DATA
// ==========================================

const SKILLS_LIST = [
  "React", "Tailwind CSS", "Node.js", "Python", "UI/UX Design", 
  "TypeScript", "GraphQL", "Solidity", "Machine Learning", "SEO", "Copywriting"
];

const INITIAL_FREELANCERS = [
  {
    id: "fl-1",
    name: "Alex Rivera",
    email: "alex@rivera.dev",
    avatar: "https://i.pravatar.cc/150?img=33",
    specialty: "Full-Stack AI Engineer",
    hourlyRate: 85,
    rating: 4.9,
    totalEarned: 54000,
    proMember: true,
    verified: true,
    availability: "available",
    location: "San Francisco, CA",
    memberSince: "Jan 2024",
    bio: "Ex-Vercel frontend engineer focused on building premium, high-performance web applications. Expert in React, Next.js, tailwind layout engineering, and LLM API orchestrations.",
    skills: ["React", "Tailwind CSS", "Node.js", "TypeScript", "GraphQL"],
    verifiedSkills: ["React", "Tailwind CSS", "TypeScript"],
    education: [{ institution: "Stanford University", degree: "B.S. Computer Science", year: "2023" }],
    workExperience: [
      { company: "Vercel", role: "UI Engineer", duration: "2023 - 2024", description: "Led development of core developer dashboard elements using Next.js." }
    ],
    portfolio: [
      { id: "p-1-1", title: "Glassmorphic AI Sandbox", category: "Web Dev", tools: ["React", "Tailwind", "Claude API"], desc: "A full IDE experience for prompt engineering with live markdown render grids.", github: "https://github.com", live: "https://live.com" },
      { id: "p-1-2", title: "SaaS Analytics Dashboard", category: "Web Dev", tools: ["Next.js", "Recharts", "Prisma"], desc: "High-performance data visualizer mapping real-time billing metrics.", github: "https://github.com", live: "https://live.com" }
    ],
    reviews: [
      { id: "rev-1-1", clientName: "Linear Inc", avatar: "https://i.pravatar.cc/150?img=11", rating: 5, comment: "Exceptional UI craft. Alex delivered our marketing engine 2 weeks early.", date: "May 2026" }
    ]
  },
  {
    id: "fl-2",
    name: "Sophia Chen",
    email: "sophia@design.co",
    avatar: "https://i.pravatar.cc/150?img=47",
    specialty: "Lead UI/UX Product Designer",
    hourlyRate: 75,
    rating: 4.8,
    totalEarned: 32000,
    proMember: false,
    verified: true,
    availability: "offers",
    location: "Vancouver, BC",
    memberSince: "Mar 2024",
    bio: "Award-winning brand strategist and interface developer. I craft deep editorial design languages, obsidian-black SaaS visual architectures, and interactive digital art directories.",
    skills: ["UI/UX Design", "Figma", "Tailwind CSS", "Brand Strategy"],
    verifiedSkills: ["UI/UX Design", "Brand Strategy"],
    education: [{ institution: "RISD", degree: "B.F.A. Graphic Design", year: "2021" }],
    workExperience: [
      { company: "Design Studio", role: "Senior Designer", duration: "2022 - Present", description: "Crafting beautiful SaaS products for early-stage fintech projects." }
    ],
    portfolio: [
      { id: "p-2-1", title: "Fintech Rebrand & App Layout", category: "Design", tools: ["Figma", "Typography"], desc: "Complete obsidian UI design language for gold trading terminal.", live: "https://figma.com" }
    ],
    reviews: []
  },
  {
    id: "fl-3",
    name: "Marcus Johnson",
    email: "marcus@motion.io",
    avatar: "https://i.pravatar.cc/150?img=12",
    specialty: "Motion Graphic & Video Designer",
    hourlyRate: 60,
    rating: 4.7,
    totalEarned: 18000,
    proMember: true,
    verified: false,
    availability: "available",
    location: "Austin, TX",
    memberSince: "Nov 2024",
    bio: "Dynamic content creator specializing in SaaS explainer videos, cinematic product announcements, and social promotional media. Expertise in After Effects and Premier Pro.",
    skills: ["Video", "Motion Graphics", "Color Grading", "Writing"],
    verifiedSkills: ["Video"],
    education: [{ institution: "UT Austin", degree: "B.A. Radio & Film", year: "2020" }],
    workExperience: [],
    portfolio: [],
    reviews: []
  },
  {
    id: "fl-4",
    name: "Elena Rostova",
    email: "elena@write.tech",
    avatar: "https://i.pravatar.cc/150?img=26",
    specialty: "Technical SaaS Copywriter",
    hourlyRate: 45,
    rating: 4.6,
    totalEarned: 12500,
    proMember: false,
    verified: true,
    availability: "offers",
    location: "Berlin, DE",
    memberSince: "Feb 2024",
    bio: "Turning complex API concepts, developer tooling structures, and cloud infrastructures into simple, compelling documentation and copy that converts developers into buyers.",
    skills: ["Copywriting", "SEO", "Technical Writing", "Python"],
    verifiedSkills: ["Technical Writing"],
    education: [{ institution: "Humboldt University", degree: "M.A. English Philology", year: "2019" }],
    workExperience: [],
    portfolio: [],
    reviews: []
  },
  {
    id: "fl-5",
    name: "Devon Carter",
    email: "devon@carter.dev",
    avatar: "https://i.pravatar.cc/150?img=68",
    specialty: "iOS Swift Developer",
    hourlyRate: 95,
    rating: 5.0,
    totalEarned: 85000,
    proMember: true,
    verified: true,
    availability: "unavailable",
    location: "New York, NY",
    memberSince: "Sep 2023",
    bio: "Ex-Apple senior iOS engineer building fluid mobile interfaces. Specialized in Swift, SwiftUI, performance-critical animation cycles, and offline-first localized architectures.",
    skills: ["Mobile Developer", "Swift", "Objective-C", "React"],
    verifiedSkills: ["Mobile Developer", "Swift"],
    education: [],
    workExperience: [],
    portfolio: [],
    reviews: []
  },
  {
    id: "fl-6",
    name: "Aria Vance",
    email: "aria@vance.seo",
    avatar: "https://i.pravatar.cc/150?img=49",
    specialty: "Search Engine Optimization Specialist",
    hourlyRate: 55,
    rating: 4.5,
    totalEarned: 22000,
    proMember: false,
    verified: false,
    availability: "available",
    location: "London, UK",
    memberSince: "Dec 2024",
    bio: "Data-driven SEO strategist focusing on high-intent query capturing, technical core web vital optimization, and content audit automation pipelines that rank SaaS on Page 1.",
    skills: ["SEO", "Google Analytics", "Python", "Copywriting"],
    verifiedSkills: ["SEO"],
    education: [],
    workExperience: [],
    portfolio: [],
    reviews: []
  },
  {
    id: "fl-7",
    name: "Nikolai Tesla",
    email: "nikolai@ai.io",
    avatar: "https://i.pravatar.cc/150?img=60",
    specialty: "AI Orchestration Specialist",
    hourlyRate: 120,
    rating: 4.9,
    totalEarned: 41000,
    proMember: true,
    verified: true,
    availability: "available",
    location: "Zagreb, HR",
    memberSince: "May 2024",
    bio: "Pioneering LLM integration frameworks and semantic vector search engines. Expert in langchain, llama-index, cognitive agent designs, and custom transformer weights tuning.",
    skills: ["React", "Python", "Machine Learning", "Node.js"],
    verifiedSkills: ["Machine Learning", "Python"],
    education: [],
    workExperience: [],
    portfolio: [],
    reviews: []
  },
  {
    id: "fl-8",
    name: "Priya Nair",
    email: "priya@nair.cloud",
    avatar: "https://i.pravatar.cc/150?img=45",
    specialty: "AWS & Kubernetes Architect",
    hourlyRate: 110,
    rating: 4.8,
    totalEarned: 68000,
    proMember: false,
    verified: true,
    availability: "offers",
    location: "Bangalore, IN",
    memberSince: "Jun 2023",
    bio: "AWS Certified Solution Architect Pro. I automate multi-region failovers, manage cost-efficient Kubernetes clusters under autoscaling loads, and design secure SOC2-compliant VPC tunnels.",
    skills: ["Cloud Architect", "Docker", "Kubernetes", "AWS"],
    verifiedSkills: ["Cloud Architect", "Kubernetes"],
    education: [],
    workExperience: [],
    portfolio: [],
    reviews: []
  }
];

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "React Admin Dashboard & Workspace",
    client: { name: "Linear Inc", avatar: "https://i.pravatar.cc/150?img=11" },
    budget: 2000,
    type: "fixed",
    category: "Web Dev",
    deadline: "2026-06-25",
    skills: ["React", "Tailwind CSS", "GraphQL"],
    proposalsCount: 4,
    postedDate: "2026-05-24",
    experienceLevel: "Expert",
    description: "We are seeking a senior frontend engineer to build our new developer administration dashboard. The project requires high-performance grid rendering, customizable analytics widget panels, and a sleek obsidian color schema.",
    deliverables: ["Obsidian UI theme dashboard layouts", "Widgets configurations panel", "GraphQL API integrations & unit tests"]
  },
  {
    id: "proj-2",
    title: "Brand Identity Design for Fintech SaaS",
    client: { name: "Stripe Flow", avatar: "https://i.pravatar.cc/150?img=22" },
    budget: 1500,
    type: "fixed",
    category: "Design",
    deadline: "2026-06-12",
    skills: ["UI/UX Design", "Figma", "Brand Strategy"],
    proposalsCount: 2,
    postedDate: "2026-05-25",
    experienceLevel: "Intermediate",
    description: "Looking for an editorial designer to craft our product logo, color tokens, and 4 primary dashboard template screens in Figma. Style: minimal, typography-driven, using muted warm gold accents.",
    deliverables: ["Vector brand assets & guidelines", "Figma high-fidelity prototypes", "Design tokens layout sheet"]
  },
  {
    id: "proj-3",
    title: "YouTube Explainer Video Editing",
    client: { name: "DevTalk Media", avatar: "https://i.pravatar.cc/150?img=33" },
    budget: 600,
    type: "hourly",
    category: "Video",
    deadline: "2026-06-08",
    skills: ["Video", "Motion Graphics"],
    proposalsCount: 5,
    postedDate: "2026-05-23",
    experienceLevel: "Beginner",
    description: "We need an editor to slice a 12-minute technical interview, add modern micro-animations, text pop-overs for command references, and balance audio profiles cleanly.",
    deliverables: ["12-minute final 4K cut video", "Social-optimized trailers (3x 60s)"]
  },
  {
    id: "proj-4",
    title: "Technical Blog Writing on Kubernetes Failovers",
    client: { name: "CloudGate", avatar: "https://i.pravatar.cc/150?img=44" },
    budget: 450,
    type: "fixed",
    category: "Writing",
    deadline: "2026-06-05",
    skills: ["Technical Writing", "SEO"],
    proposalsCount: 1,
    postedDate: "2026-05-26",
    experienceLevel: "Expert",
    description: "Looking for a DevOps engineer who writes compelling content. You will write a comprehensive 2,500-word tutorial on multi-region AWS EKS disaster recovery mechanisms.",
    deliverables: ["2,500 words article with code snippets", "Metadata header definitions & graphics layout suggestion"]
  },
  {
    id: "proj-5",
    title: "Mobile App UI Development",
    client: { name: "Nomad Coffee", avatar: "https://i.pravatar.cc/150?img=55" },
    budget: 4000,
    type: "fixed",
    category: "Web Dev",
    deadline: "2026-07-10",
    skills: ["Mobile Developer", "React", "Tailwind CSS"],
    proposalsCount: 6,
    postedDate: "2026-05-22",
    experienceLevel: "Expert",
    description: "Build the ordering and customer loyalty screen for a coffee ordering app. Responsive web wrapper running in WebView inside native container shell.",
    deliverables: ["Responsive mobile grid layouts", "Simulated ordering pipeline actions", "Confetti unlocks integration for rewards"]
  },
  {
    id: "proj-6",
    title: "SEO Content Audit & Keyword Mapping",
    client: { name: "Vapor Health", avatar: "https://i.pravatar.cc/150?img=66" },
    budget: 1200,
    type: "hourly",
    category: "Writing",
    deadline: "2026-06-20",
    skills: ["SEO", "Google Analytics"],
    proposalsCount: 3,
    postedDate: "2026-05-21",
    experienceLevel: "Intermediate",
    description: "Map out high-intent keywords for our health blog and fix redirect issues, optimizing page loads.",
    deliverables: ["SEO Audit document & spreadsheet", "Google Analytics 4 event mapping guide"]
  }
];

const INITIAL_FEED = [
  { id: "post-1", author: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=33", category: "Wins", content: "Just shipped the brand new AI Matchmaking module for a client. 98% matching accuracy on test vectors! Next.js and Tailwind were absolute champions on this delivery. ✨", likes: 24, comments: 5, liked: false, time: "2 hrs ago" },
  { id: "post-2", author: "Sophia Chen", avatar: "https://i.pravatar.cc/150?img=47", category: "Resources", content: "Curated a Google sheet of premium serif typefaces for dark SaaS products. Drop a comment below if you want the Notion workspace template direct link! 🎨", likes: 45, comments: 19, liked: false, time: "4 hrs ago" },
  { id: "post-3", author: "Devon Carter", avatar: "https://i.pravatar.cc/150?img=68", category: "Tips", content: "Pro-tip for iOS developers: Always optimize image caching inside SwiftUI Lists. Standard AsyncImage re-triggers network fetches when loading fast scrolling lists. Use a custom localized wrapper.", likes: 18, comments: 2, liked: false, time: "1 day ago" },
  { id: "post-4", author: "Nikolai Tesla", avatar: "https://i.pravatar.cc/150?img=60", category: "Tips", content: "To bypass Anthropic direct client-side fetch blocks (like CORS or missing keys) in local sandboxes, implement a mocked heuristic router. This ensures the app is testable 100% of the time, even during API network failures.", likes: 32, comments: 8, liked: false, time: "1 day ago" },
  { id: "post-5", author: "Elena Rostova", avatar: "https://i.pravatar.cc/150?img=26", category: "Wins", content: "Just onboarded my third long-term client from the TalentStage platform! Landing contracts is so much easier when your portfolio shows verified skill credentials. Verification quizzes rock. 📚", likes: 15, comments: 3, liked: false, time: "2 days ago" },
  { id: "post-6", author: "Marcus Johnson", avatar: "https://i.pravatar.cc/150?img=12", category: "Resources", content: "Here's a 3D animated icon pack I compiled for standard sidebar controls. Entirely vector, editable inside After Effects. Free for all Pro members of TalentStage!", likes: 29, comments: 7, liked: false, time: "2 days ago" },
  { id: "post-7", author: "Priya Nair", avatar: "https://i.pravatar.cc/150?img=45", category: "Tips", content: "When deploying Kubernetes under variable user demands, prefer Karpenter over standard Cluster Autoscaler. It boots nodes in 45s instead of 3m and saves up to 40% on AWS EC2 billing.", likes: 12, comments: 1, liked: false, time: "3 days ago" },
  { id: "post-8", author: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=33", category: "Resources", content: "Excellent deep-dive document on LLM pricing structures. Recharts visualizations of input vs output tokens relative to latency profiles are gorgeous. Will share the code link soon.", likes: 21, comments: 4, liked: false, time: "3 days ago" },
  { id: "post-9", author: "Sophia Chen", avatar: "https://i.pravatar.cc/150?img=47", category: "Wins", content: "Won the weekly visual challenge on TalentStage! Huge thanks to the jury. The prize funds are locked, and I got my gold check badges! 🏆", likes: 52, comments: 12, liked: false, time: "4 days ago" },
  { id: "post-10", author: "Elena Rostova", avatar: "https://i.pravatar.cc/150?img=26", category: "Tips", content: "Writing rule: Treat your SaaS readers as busy executives. Keep paragraphs under 3 lines, highlight key values in bold, and provide a direct executive summary TL;DR at the top.", likes: 14, comments: 0, liked: false, time: "5 days ago" }
];

const INITIAL_CHALLENGES = [
  { id: "chal-1", title: "Glassmorphic SaaS Trading Dashboard", description: "Design or build an editorial obsidian trading interface for a gold backing token. Highlight key transactional logs, visual charts, and modal sliders.", prize: "$250 + Verified UI Badge", deadline: "3d 4h 12m", submissions: 14, active: true },
  { id: "chal-2", title: "Docker Dev Container Orchestration", description: "Create a docker-compose configuration automating hot-reloads, database migrations, and telemetry triggers in developer setups.", prize: "$150 + Dev Credentials", winner: "Nikolai Tesla", active: false },
  { id: "chal-3", title: "Technical Writing: Next-Gen API Design", description: "Write an editorial post detailing why GraphQL subscriptions are losing developer adoption to RPC servers like tRPC.", prize: "$100 + Writing Badge", winner: "Elena Rostova", active: false }
];

const INITIAL_TRANSACTIONS = [
  { id: "t-1", date: "May 24, 2026", project: "React Admin Dashboard", client: "Linear Inc", type: "Income", gross: 1000, net: 900, commission: 100, status: "completed" },
  { id: "t-2", date: "May 22, 2026", project: "Brand Identity Layout", client: "Stripe Flow", type: "Income", gross: 500, net: 450, commission: 50, status: "completed" },
  { id: "t-3", date: "May 18, 2026", project: "API Performance Tuning", client: "Zapier", type: "Income", gross: 1200, net: 1080, commission: 120, status: "completed" },
  { id: "t-4", date: "May 15, 2026", project: "Withdrawal to Chase Bank", client: "Personal Wallet", type: "Withdrawal", gross: -2000, net: -2000, commission: 0, status: "completed" },
  { id: "t-5", date: "May 12, 2026", project: "YouTube Explainer Video", client: "DevTalk", type: "Income", gross: 400, net: 360, commission: 40, status: "completed" },
  { id: "t-6", date: "May 10, 2026", project: "Next.js Core Audit", client: "Vercel", type: "Income", gross: 1500, net: 1350, commission: 150, status: "completed" },
  { id: "t-7", date: "May 05, 2026", project: "AWS VPC Architecture Setup", client: "Supabase", type: "Income", gross: 2500, net: 2250, commission: 250, status: "completed" },
  { id: "t-8", date: "Apr 28, 2026", project: "Copywriting Conversion Hub", client: "Framer", type: "Income", gross: 600, net: 540, commission: 60, status: "completed" },
  { id: "t-9", date: "Apr 22, 2026", project: "Withdrawal to Wells Fargo", client: "Personal Wallet", type: "Withdrawal", gross: -3500, net: -3500, commission: 0, status: "completed" },
  { id: "t-10", date: "Apr 15, 2026", project: "Kubernetes Dev Setup", client: "Vapor Health", type: "Income", gross: 800, net: 720, commission: 80, status: "completed" },
  { id: "t-11", date: "Apr 10, 2026", project: "E-Commerce Cart Redesign", client: "Shopify Flow", type: "Income", gross: 1000, net: 900, commission: 100, status: "completed" },
  { id: "t-12", date: "Apr 05, 2026", project: "Figma Typography Tuning", client: "Basecamp", type: "Income", gross: 400, net: 360, commission: 40, status: "completed" }
];

const INITIAL_MENTORS = [
  { id: "m-1", name: "Alex Rivera", specialty: "React Architecture & AI Integration", rate: "Free", avatar: "https://i.pravatar.cc/150?img=33" },
  { id: "m-2", name: "Sophia Chen", specialty: "UI/UX Editorial Figma Architectures", rate: "$80/session", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "m-3", name: "Devon Carter", specialty: "Apple SwiftUI Core Animation pipelines", rate: "$120/session", avatar: "https://i.pravatar.cc/150?img=68" },
  { id: "m-4", name: "Priya Nair", specialty: "AWS Kubernetes Orchestration audits", rate: "Free", avatar: "https://i.pravatar.cc/150?img=45" }
];

// ==========================================
// 2. CONTEXT, STATE MANAGEMENT & REDUCER
// ==========================================

const TalentStageContext = createContext();

const initialReducerState = {
  currentUser: {},
  freelancers: [],
  projects: [],
  proposals: [],
  contracts: [],
  reviews: [],
  transactions: [],
  feedPosts: [],
  challenges: [],
  savedFreelancers: [],
  notifications: [
    { id: "n-1", message: "Welcome to TalentStage! Log in or register to get started.", unread: true, time: "Just now" }
  ],
  activeView: "onboarding",
  aiResults: {},
  apiKey: "" // Anthropic API Key
};

function stateReducer(state, action) {
  switch (action.type) {
    case 'INIT_AUTH':
      return {
        ...state,
        currentUser: action.payload.user,
        apiKey: action.payload.token
      };
    case 'INIT_DATA':
      return {
        ...state,
        freelancers: action.payload.freelancers,
        projects: action.payload.projects,
        feedPosts: action.payload.feedPosts,
        challenges: action.payload.challenges,
        transactions: action.payload.transactions,
        contracts: action.payload.contracts,
        proposals: action.payload.proposals
      };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_PROPOSALS':
      return { ...state, proposals: action.payload };
    case 'SET_FEED_POSTS':
      return { ...state, feedPosts: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: { ...state.currentUser, ...action.payload } };
    case 'SET_VIEW':
      return { ...state, activeView: action.payload };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    case 'SUBMIT_PROPOSAL':
      return { ...state, proposals: [action.payload, ...state.proposals] };
    case 'UPDATE_PROPOSAL_STATUS':
      return {
        ...state,
        proposals: state.proposals.map(p => p.id === action.payload.id ? { ...p, status: action.payload.status } : p)
      };
    case 'ADD_CONTRACT':
      return { ...state, contracts: [action.payload, ...state.contracts] };
    case 'ADD_CONTRACT_MSG':
      return {
        ...state,
        contracts: state.contracts.map(c =>
          c.id === action.payload.contractId
            ? { ...c, messages: [...(c.messages || []), action.payload.msg] }
            : c
        )
      };
    case 'UPDATE_DELIVERABLE':
      return {
        ...state,
        contracts: state.contracts.map(c => {
          if (c.id === action.payload.contractId) {
            return {
              ...c,
              deliverables: c.deliverables.map((d, index) => 
                index === action.payload.index ? { ...d, status: action.payload.status } : d
              )
            };
          }
          return c;
        })
      };
    case 'RELEASE_PAYMENT':
      return {
        ...state,
        contracts: state.contracts.map(c => c.id === action.payload.contractId ? { ...c, milestoneReleasedCount: (c.milestoneReleasedCount || 0) + 1 } : c)
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'TOGGLE_SAVE_FREELANCER':
      const isSaved = state.savedFreelancers.some(f => f.id === action.payload.id);
      return {
        ...state,
        savedFreelancers: isSaved 
          ? state.savedFreelancers.filter(f => f.id !== action.payload.id)
          : [...state.savedFreelancers, action.payload]
      };
    case 'LOGOUT':
      return { 
        ...state, 
        currentUser: {}, 
        activeView: 'onboarding' 
      };
    case 'ADD_FEED_POST':
      return { ...state, feedPosts: [action.payload, ...state.feedPosts] };
    case 'LIKE_FEED_POST':
      return {
        ...state,
        feedPosts: state.feedPosts.map(p => 
          p.id === action.payload 
            ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } 
            : p
        )
      };
    case 'CACHE_AI':
      return {
        ...state,
        aiResults: { ...state.aiResults, [action.payload.key]: action.payload.data }
      };
    case 'ADD_REVIEW':
      return { ...state, reviews: [action.payload, ...state.reviews] };
    case 'ADD_SKILL':
      const currentSkills = state.currentUser.skills || [];
      if (currentSkills.includes(action.payload)) return state;
      return {
        ...state,
        currentUser: { ...state.currentUser, skills: [...currentSkills, action.payload] }
      };
    case 'ADD_VERIFIED_SKILL':
      const currentV = state.currentUser.verifiedSkills || [];
      if (currentV.includes(action.payload)) return state;
      return {
        ...state,
        currentUser: { ...state.currentUser, verifiedSkills: [...currentV, action.payload] }
      };
    case 'ADD_PORTFOLIO_ITEM':
      return {
        ...state,
        currentUser: { ...state.currentUser, portfolio: [action.payload, ...state.currentUser.portfolio] }
      };
    default:
      return state;
  }
}

// ==========================================
// 3. CONFETTI ANIMATION PARTICLE ENGINE
// ==========================================

function ConfettiEffect({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((_, i) => {
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 4;
        const delay = Math.random() * 3;
        const color = ['#F5C842', '#C9A227', '#4ADE80', '#FB923C', '#F87171'][i % 5];
        return (
          <div 
            key={i} 
            className="absolute rounded-full animate-bounce"
            style={{
              left: `${left}%`,
              top: `-10px`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              opacity: 0.8,
              transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`,
              transition: `transform ${Math.random() * 2 + 2}s linear ${delay}s, opacity 2s`,
            }}
          />
        );
      })}
    </div>
  );
}

// ==========================================
// 4. ANTHROPIC SERVICE LAYER (AI SANDBOX FALLBACK)
// ==========================================

async function callClaudeAPI(systemPrompt, userPrompt, apiKey) {
  if (!apiKey) {
    throw new Error("No API key configured. Switch to sandbox simulator mode.");
  }
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "dangerously-allow-browser": "true"
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
    throw new Error(errorData?.error?.message || `API Call Failed: Status ${response.status}`);
  }

  const data = await response.json();
  const text = data.content[0]?.text || "";
  
  // Clean JSON block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("API did not return structured JSON. Retrying with Sandbox fallbacks.");
}

// Highly customized, premium sandbox response engine
function simulateClaudeIntelligence(feature, inputs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (feature) {
        case 'match': {
          const { title, description, skills, budget, freelancers } = inputs;
          // Calculate matching based on common skills & rate
          const sorted = freelancers.map(fl => {
            let score = 50;
            const skillOverlap = fl.skills.filter(s => skills.includes(s));
            score += skillOverlap.length * 12;
            
            // budget check
            const impliedBudget = fl.hourlyRate * 15;
            if (impliedBudget <= budget) score += 15;
            else score -= 10;
            
            // rating check
            score += (fl.rating - 4.0) * 10;
            score = Math.min(Math.round(score), 99);

            let reasoning = `Excellent overlap of ${skillOverlap.join(', ') || 'core skillsets'}. Within reasonable hourly budgets.`;
            if (fl.proMember) reasoning = `[Pro Member] ` + reasoning;
            
            return {
              freelancerId: fl.id,
              matchScore: score,
              reasoning: reasoning
            };
          }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
          
          resolve({ matches: sorted });
          break;
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
              recommendation: p.cover.length > 100 
                ? "Thorough scope outline. Demonstrates outstanding portfolio credentials." 
                : "Good bid, but could expand more on exact deliverables workflows.",
              shortlist: total >= 23
            };
          });
          resolve({ evaluations });
          break;
        }
        case 'portfolio_review': {
          const { portfolio } = inputs;
          const score = portfolio.length === 0 ? 30 : Math.min(60 + portfolio.length * 10, 95);
          resolve({
            overallScore: score,
            strengths: [
              "Nice separation of tech badges",
              portfolio.length > 0 ? "Strong display of portfolio links" : "Clean template layout"
            ],
            improvements: [
              { area: "Project Descriptions", issue: "Somewhat terse outlines", suggestion: "Increase text length by explaining deliverables and client problems resolved.", priority: "high" },
              { area: "Source Code Verification", issue: "Missing git repositories", suggestion: "Add GitHub links to all listed work items.", priority: "medium" }
            ],
            missingElements: [
              "Client testimonial quotes",
              "Detailed project process walkthroughs"
            ]
          });
          break;
        }
        case 'skill_test': {
          const { skill } = inputs;
          const questions = [
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
          ];
          resolve({ questions });
          break;
        }
        case 'scope': {
          const { vagueness } = inputs;
          const title = vagueness.toLowerCase().includes("bakery") ? "Bakery Digital E-Commerce Suite" : "SaaS Workspace Launchpad";
          const skills = vagueness.toLowerCase().includes("bakery") ? ["React", "UI/UX Design", "SEO"] : ["React", "TypeScript", "Node.js"];
          
          resolve({
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
          });
          break;
        }
        default:
          resolve({});
      }
    }, 1200);
  });
}

// ==========================================
// 5. TOAST NOTIFICATION UTILITIES
// ==========================================

function Toaster({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className="bg-[#1A1A28] border-l-4 border-gold-500 text-[#F0EDE8] px-4 py-3 rounded-lg shadow-2xl flex items-center justify-between gap-4 pointer-events-auto animate-slide-up border border-[#2A2A42]"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-500 shrink-0" />
            <span className="text-sm font-sans font-medium">{t.message}</span>
          </div>
          <button onClick={() => removeToast(t.id)} className="text-[#9B97B2] hover:text-[#F0EDE8]">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 6. SHARED LAYOUT COMPONENTS (REUSABLE)
// ==========================================

function HeaderBar({ title, unreadCount, toggleApiDrawer, toggleSidebar, searchVal, setSearchVal, dispatch }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-glass border-b border-[#2A2A42] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-[#9B97B2] hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-serif font-semibold text-[#F0EDE8] tracking-wide">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#5C5878]" />
          <input 
            type="text" 
            placeholder="Search matching items..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500"
          />
        </div>

        <button 
          onClick={toggleApiDrawer} 
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A28] border border-[#2A2A42] hover:border-gold-500/50 rounded-lg text-sm text-gold-500 transition-all font-mono"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
          <span>API Key</span>
        </button>

        <button 
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:border-red-500 rounded-lg text-sm text-red-500 transition-all font-sans font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
        
        <div className="relative">
          <button className="p-2 bg-[#1A1A28] border border-[#2A2A42] rounded-lg hover:border-gold-500/30 text-[#9B97B2] hover:text-[#F0EDE8] relative">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 7. MULTI-STEP ONBOARDING & VERIFY
// ==========================================

function OnboardingScreen({ dispatch, addToast }) {
  const [step, setStep] = useState(1); // 1: Info & Role, 2: Identity Verify, 3: Profile Setup
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "both" });
  const [showPass, setShowPass] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState("student"); // student | linkedin
  const [verifyInput, setVerifyInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const [setupData, setSetupData] = useState({ bio: "", rate: 50, skills: [] });
  
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      addToast("Please fill in login details");
      return;
    }
    try {
      const result = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginData.email, password: loginData.password })
      });
      localStorage.setItem('token', result.token);
      dispatch({ type: 'INIT_AUTH', payload: { user: result.user, token: result.token } });
      await fetchAllDatabaseContent(dispatch);
      addToast("Logged in successfully! Loading dashboard...");
      dispatch({ type: 'SET_VIEW', payload: 'home-dashboard' });
    } catch (error) {
      addToast(`Login failed: ${error.message}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast("Please fill in all account fields");
      return;
    }
    try {
      const result = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
      localStorage.setItem('token', result.token);
      dispatch({ type: 'INIT_AUTH', payload: { user: result.user, token: result.token } });
      setStep(2);
      addToast("Account registered! Let's verify your identity.");
    } catch (error) {
      addToast(`Registration failed: ${error.message}`);
    }
  };

  const handleVerify = () => {
    if (verifyMethod === "student" && !uploadedFileName) {
      addToast("Please simulate file drop of your Student ID");
      return;
    }
    if (verifyMethod === "linkedin" && !verifyInput.includes("linkedin.com")) {
      addToast("Please input a valid LinkedIn profile link");
      return;
    }
    setStep(3);
    addToast("Identity verified! Complete your setup profile.");
  };

  const toggleSkill = (s) => {
    setSetupData(prev => ({
      ...prev,
      skills: prev.skills.includes(s) 
        ? prev.skills.filter(x => x !== s) 
        : [...prev.skills, s]
    }));
  };

  const handleFinish = async () => {
    try {
      const updatedUser = await apiFetch('/api/auth/profile/update', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          bio: setupData.bio || "Crafting premium user layouts.",
          hourlyRate: Number(setupData.rate),
          skills: setupData.skills.length > 0 ? setupData.skills : ["React"],
          availability: 'available',
          location: 'San Francisco, CA'
        })
      });
      dispatch({ type: 'SET_USER', payload: updatedUser });
      await fetchAllDatabaseContent(dispatch);
      addToast("Onboarding complete! Loading dashboard...");
      dispatch({ type: 'SET_VIEW', payload: 'home-dashboard' });
    } catch (error) {
      addToast(`Failed completing setup: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0EDE8] flex flex-col md:flex-row">
      {/* Left split - Tagline Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-[#12121A] to-[#1A1A28] border-r border-[#2A2A42] p-10 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-2 relative">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-serif text-black font-bold">T</div>
          <span className="text-xl font-serif font-semibold tracking-wider text-gold-500">TalentStage</span>
        </div>
        
        <div className="my-auto relative max-w-md">
          <span className="text-xs font-mono uppercase tracking-widest text-[#5C5878] border border-[#2A2A42] px-2 py-1 rounded-full">DevFusion Hackathon 2.0</span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mt-4 text-[#F0EDE8] leading-tight">
            Where premium editorial layout meets <span className="text-gold-500">AI intelligence</span>.
          </h2>
          <p className="mt-4 text-[#9B97B2] font-sans leading-relaxed">
            A production-grade network for elite developers and product coaches. Instantly test skills, scope deliverables via LLM API, and release escrow milestone payouts.
          </p>
        </div>

        <div className="text-xs font-mono text-[#5C5878]">
          &copy; 2026 TalentStage. Single-Page Reactive Store.
        </div>
      </div>

      {/* Right split - Multi-step Setup Form */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-[#0A0A0F]">
        <div className="max-w-md w-full mx-auto">
          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-8 text-xs font-mono">
            <div className={`flex flex-col gap-1 pb-2 border-b-2 w-1/3 ${step >= 1 ? 'border-gold-500 text-gold-500' : 'border-[#2A2A42] text-[#5C5878]'}`}>
              <span>01. ACCOUNT</span>
            </div>
            <div className={`flex flex-col gap-1 pb-2 border-b-2 w-1/3 ${step >= 2 ? 'border-gold-500 text-gold-500' : 'border-[#2A2A42] text-[#5C5878]'}`}>
              <span>02. IDENTITY</span>
            </div>
            <div className={`flex flex-col gap-1 pb-2 border-b-2 w-1/3 ${step >= 3 ? 'border-gold-500 text-gold-500' : 'border-[#2A2A42] text-[#5C5878]'}`}>
              <span>03. PORTFOLIO</span>
            </div>
          </div>

          {step === 1 && (
            isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5 animate-slide-up">
                <div>
                  <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Welcome Back</h3>
                  <p className="text-sm text-[#9B97B2]">Sign in to access your dashboard and active contracts.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={loginData.email}
                      onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                      placeholder="keerthi@talentstage.ai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        required
                        value={loginData.password}
                        onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500 pr-10" 
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3 text-[#5C5878] hover:text-[#9B97B2]"
                      >
                        {showPass ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-sans font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Log In
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-xs text-gold-500 hover:underline"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreate} className="space-y-5 animate-slide-up">
                <div>
                  <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Build Your Identity</h3>
                  <p className="text-sm text-[#9B97B2]">Join the market as freelancer, client or manage both.</p>
                </div>

                {/* Role cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { r: 'freelancer', title: "Freelancer", desc: "Monetize elite skills" },
                    { r: 'client', title: "Client", desc: "Scope & hire creators" },
                    { r: 'both', title: "Hybrid Mode", desc: "Collaborate freely" }
                  ].map(item => (
                    <button 
                      key={item.r}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, role: item.r }))}
                      className={`p-3 text-left border rounded-xl transition-all ${formData.role === item.r ? 'border-gold-500 bg-[#1A1A28] glow-active' : 'border-[#2A2A42] bg-[#12121A] hover:border-[#F5C842]/30'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#22223A] flex items-center justify-center mb-2">
                        {item.r === 'freelancer' && <Briefcase className="w-4 h-4 text-gold-500" />}
                        {item.r === 'client' && <Users className="w-4 h-4 text-gold-500" />}
                        {item.r === 'both' && <Sparkles className="w-4 h-4 text-gold-500" />}
                      </div>
                      <h4 className="text-xs font-semibold text-[#F0EDE8]">{item.title}</h4>
                      <p className="text-[10px] text-[#9B97B2] leading-tight mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                      placeholder="Keerthi Arumugam"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                      placeholder="keerthi@talentstage.ai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Password</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        required
                        value={formData.password}
                        onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500 pr-10" 
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-3 text-[#5C5878] hover:text-[#9B97B2]"
                      >
                        {showPass ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-sans font-semibold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Create Account
                </button>

                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="text-xs text-gold-500 hover:underline"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </form>
            )
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Claim Your Trust Badge</h3>
                <p className="text-sm text-[#9B97B2]">Verified identity increases invite rates by 85%.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setVerifyMethod("student")}
                  className={`p-4 border rounded-xl text-left bg-[#12121A] transition-all ${verifyMethod === "student" ? 'border-gold-500' : 'border-[#2A2A42]'}`}
                >
                  <Award className="w-6 h-6 text-gold-500 mb-2" />
                  <h4 className="text-sm font-semibold">Student Verification</h4>
                  <p className="text-xs text-[#9B97B2] mt-1 leading-normal">Drop or click student ID assets.</p>
                </button>
                <button 
                  onClick={() => setVerifyMethod("linkedin")}
                  className={`p-4 border rounded-xl text-left bg-[#12121A] transition-all ${verifyMethod === "linkedin" ? 'border-gold-500' : 'border-[#2A2A42]'}`}
                >
                  <ExternalLink className="w-6 h-6 text-gold-500 mb-2" />
                  <h4 className="text-sm font-semibold">LinkedIn Profile URL</h4>
                  <p className="text-xs text-[#9B97B2] mt-1 leading-normal">Fast validation in under 2 mins.</p>
                </button>
              </div>

              {verifyMethod === "student" ? (
                <div 
                  onClick={() => setUploadedFileName("Student_ID_Card.jpg")}
                  className="border-2 border-dashed border-[#2A2A42] hover:border-gold-500/50 rounded-xl p-8 text-center bg-[#12121A] cursor-pointer transition-all"
                >
                  <Upload className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
                  <span className="text-sm text-[#9B97B2]">
                    {uploadedFileName ? `Attached: ${uploadedFileName}` : "Click to simulate drop of verification ID"}
                  </span>
                  <p className="text-[10px] text-[#5C5878] mt-1">Supports PNG, PDF files (max 10MB)</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">LinkedIn Profile Link</label>
                  <input 
                    type="url" 
                    value={verifyInput}
                    onChange={e => setVerifyInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                    placeholder="https://linkedin.com/in/keerthi"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="w-1/3 py-2.5 bg-transparent border border-[#2A2A42] hover:border-[#9B97B2] text-[#9B97B2] rounded-lg text-sm"
                >
                  Back
                </button>
                <button 
                  onClick={handleVerify} 
                  className="w-2/3 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-sans font-semibold rounded-lg hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Submit & Verify
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <h3 className="text-2xl font-serif text-gold-500 font-semibold mb-2">Build Creative Profile</h3>
                <p className="text-sm text-[#9B97B2]">These details help AI smart matching calculations.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Brief Bio (Professional summary)</label>
                  <textarea 
                    value={setupData.bio}
                    onChange={e => setSetupData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full h-24 px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500 resize-none"
                    placeholder="Describe your credentials and SaaS specialization..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Desired Hourly Rate ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-[#5C5878]">$</span>
                    <input 
                      type="number" 
                      value={setupData.rate}
                      onChange={e => setSetupData(prev => ({ ...prev, rate: e.target.value }))}
                      className="w-full pl-8 pr-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Claim Skills (Select at least 2)</label>
                  <div className="flex flex-wrap gap-2 pt-1 max-h-28 overflow-y-auto pr-1">
                    {SKILLS_LIST.map(s => {
                      const selected = setupData.skills.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSkill(s)}
                          className={`px-3 py-1 rounded-full text-xs font-sans transition-all ${selected ? 'bg-gold-500 text-black border-gold-500 font-semibold' : 'bg-[#12121A] text-[#9B97B2] border border-[#2A2A42] hover:border-gold-500/20'}`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)} 
                  className="w-1/3 py-2.5 bg-transparent border border-[#2A2A42] hover:border-[#9B97B2] text-[#9B97B2] rounded-lg text-sm"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinish} 
                  className="w-2/3 py-2.5 bg-gold-500 hover:bg-gold-600 text-black font-sans font-semibold rounded-lg hover:scale-105 active:scale-95 transition-all text-sm"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. SIDEBAR LAYOUT
// ==========================================

function LeftSidebar({ currentUser, activeView, setView, dispatch }) {
  // Calculate completeness score
  const getCompleteness = () => {
    let score = 0;
    if (currentUser.bio) score += 10;
    if (currentUser.skills?.length > 0) score += 15;
    if (currentUser.portfolio?.length > 0) score += 20;
    if (currentUser.hourlyRate > 0) score += 10;
    if (currentUser.availability) score += 5;
    if (currentUser.education?.length > 0) score += 10;
    if (currentUser.workExperience?.length > 0) score += 15;
    if (currentUser.avatar) score += 5;
    if (currentUser.verified) score += 10;
    return score;
  };
  
  const score = getCompleteness();

  const flRoutes = [
    { v: "fl-profile", label: "My Profile", icon: User },
    { v: "fl-portfolio", label: "Portfolio Gallery", icon: BookOpen },
    { v: "fl-browse-projects", label: "Browse Projects", icon: Search },
    { v: "fl-my-proposals", label: "Bids & Proposals", icon: FileText },
    { v: "fl-contracts", label: "Contracts Tracker", icon: ShieldCheck },
    { v: "fl-earnings", label: "Earnings Vault", icon: CreditCard }
  ];

  const clRoutes = [
    { v: "cl-post-project", label: "Post a Project", icon: Plus },
    { v: "cl-my-projects", label: "Manage Audits", icon: Briefcase },
    { v: "cl-saved", label: "Saved Talents", icon: Bookmark }
  ];

  const sharedRoutes = [
    { v: "fl-community", label: "Public Feed", icon: Users },
    { v: "fl-challenges", label: "Skill Challenges", icon: Award },
    { v: "fl-mentorship", label: "Mentorship Match", icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-[#12121A] border-r border-[#2A2A42] flex flex-col justify-between shrink-0 h-screen sticky top-0 hidden md:flex">
      <div className="flex flex-col gap-6 p-6 overflow-y-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center font-serif text-black font-extrabold text-sm">T</div>
          <span className="text-lg font-serif font-semibold tracking-wider text-gold-500">TalentStage</span>
          {currentUser.proMember && <span className="text-[9px] bg-gold-500/20 text-gold-500 border border-gold-500/30 px-1.5 py-0.5 rounded uppercase font-mono">Pro</span>}
        </div>

        {/* User Role Quick Switcher */}
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-3 rounded-xl">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase block mb-1">Your Context</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F0EDE8] uppercase">{currentUser.role === 'both' ? 'Hybrid Platform' : `${currentUser.role} Mode`}</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-[#9B97B2] font-mono">Live</span>
            </div>
          </div>
        </div>

        {/* Freelancer Nav */}
        {(currentUser.role === 'freelancer' || currentUser.role === 'both') && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#5C5878] uppercase tracking-wider mb-1">Freelancer Vault</span>
            {flRoutes.map(item => {
              const active = activeView === item.v;
              return (
                <button 
                  key={item.v}
                  onClick={() => setView(item.v)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${active ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 font-medium' : 'text-[#9B97B2] hover:text-[#F0EDE8] hover:bg-[#1A1A28]/50'}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Client Nav */}
        {(currentUser.role === 'client' || currentUser.role === 'both') && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#5C5878] uppercase tracking-wider mb-1">Client Terminal</span>
            {clRoutes.map(item => {
              const active = activeView === item.v;
              return (
                <button 
                  key={item.v}
                  onClick={() => setView(item.v)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${active ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 font-medium' : 'text-[#9B97B2] hover:text-[#F0EDE8] hover:bg-[#1A1A28]/50'}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Shared Nav */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase tracking-wider mb-1">Collaborations</span>
          {sharedRoutes.map(item => {
            const active = activeView === item.v;
            return (
              <button 
                key={item.v}
                onClick={() => setView(item.v)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all ${active ? 'bg-gold-500/10 text-gold-500 border-l-2 border-gold-500 font-medium' : 'text-[#9B97B2] hover:text-[#F0EDE8] hover:bg-[#1A1A28]/50'}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Profile Completeness Gauge */}
      <div className="p-4 border-t border-[#2A2A42] bg-[#0E0E15]">
        <div className="flex items-center gap-3">
          {/* Circular SVG Indicator */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="18" fill="transparent" stroke="#2A2A42" strokeWidth="3" />
              <circle 
                cx="24" cy="24" r="18" fill="transparent" stroke="#F5C842" strokeWidth="3" 
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-[10px] font-mono text-[#F0EDE8] font-bold">{score}%</span>
          </div>

          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#F0EDE8] truncate">{currentUser.name}</h4>
            <span className="text-[10px] text-[#9B97B2] font-mono">Profile Complete</span>
          </div>
        </div>

        {score < 90 && (
          <button 
            onClick={() => setView('fl-profile')} 
            className="w-full mt-3 py-1.5 bg-gold-500/10 hover:bg-gold-500 text-gold-500 hover:text-black border border-gold-500/30 text-[10px] font-sans font-semibold rounded transition-all"
          >
            Enhance Score → +10%
          </button>
        )}

        <button 
          onClick={() => dispatch({ type: 'LOGOUT' })}
          className="w-full mt-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 text-[10px] font-sans font-semibold rounded transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

// ==========================================
// 9. CLIENT VIEW: POST A PROJECT
// ==========================================

function PostProjectView({ state, dispatch, addToast }) {
  const [formStep, setFormStep] = useState(1); // 1: Basics, 2: Details, 3: Budget & Timeline, 4: Review
  const [fields, setFields] = useState({
    title: "", type: "fixed", category: "Web Dev",
    description: "", skills: [], currentSkillInput: "",
    deliverables: [], currentDelInput: "",
    minBudget: 500, maxBudget: 1500,
    deadline: "2026-06-30", experience: "Expert"
  });

  const [aiScopingInput, setAiScopingInput] = useState("");
  const [aiScopingLoading, setAiScopingLoading] = useState(false);

  const handleAddSkill = () => {
    if (fields.currentSkillInput && !fields.skills.includes(fields.currentSkillInput)) {
      setFields(p => ({ ...p, skills: [...p.skills, p.currentSkillInput], currentSkillInput: "" }));
    }
  };

  const handleAddDeliverable = () => {
    if (fields.currentDelInput) {
      setFields(p => ({ ...p, deliverables: [...p.deliverables, p.currentDelInput], currentDelInput: "" }));
    }
  };

  const removeDeliverable = (idx) => {
    setFields(p => ({ ...p, deliverables: p.deliverables.filter((_, i) => i !== idx) }));
  };

  const executeAIScoping = async () => {
    if (!aiScopingInput) {
      addToast("Type a basic project description first.");
      return;
    }
    setAiScopingLoading(true);
    addToast("Claude Scoping Assistant formulating deliverables list...");
    
    try {
      let result;
      if (state.apiKey) {
        const sys = "You are a project scoping expert. Convert vague client needs into beautiful JSON brief maps. Return ONLY valid JSON: { \"projectTitle\": \"...\", \"summary\": \"...\", \"deliverables\": [\"...\"], \"suggestedTimeline\": \"...\", \"budgetRange\": { \"min\": 500, \"max\": 1500 }, \"requiredSkills\": [\"...\"], \"milestones\": [] }";
        result = await callClaudeAPI(sys, `Scoping need: ${aiScopingInput}`, state.apiKey);
      } else {
        result = await simulateClaudeIntelligence('scope', { vagueness: aiScopingInput });
      }

      setFields(p => ({
        ...p,
        title: result.projectTitle || p.title,
        description: result.summary || p.description,
        skills: result.requiredSkills || p.skills,
        deliverables: result.deliverables || p.deliverables,
        minBudget: result.budgetRange?.min || p.minBudget,
        maxBudget: result.budgetRange?.max || p.maxBudget
      }));

      addToast("AI scoping applied successfully! Summary generated.");
      setFormStep(4); // Skip forward to review step to let them see brief
    } catch (e) {
      addToast(`Scoping error: ${e.message}`);
    } finally {
      setAiScopingLoading(false);
    }
  };

  const handlePost = async () => {
    if (!fields.title || !fields.description) {
      addToast("Please fill out Title and Description.");
      return;
    }
    try {
      const newProj = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: fields.title,
          budget: Number(fields.maxBudget),
          type: fields.type,
          category: fields.category,
          deadline: fields.deadline,
          skills: fields.skills.length > 0 ? fields.skills : ['React'],
          experienceLevel: fields.experience,
          description: fields.description,
          deliverables: fields.deliverables.length > 0 ? fields.deliverables : ['Initial layout design']
        })
      });
      dispatch({ type: 'ADD_PROJECT', payload: newProj });
      addToast(`Project "${fields.title}" posted to the marketplace!`);
      dispatch({ type: 'SET_VIEW', payload: 'cl-my-projects' });
    } catch (error) {
      addToast(`Failed to post project: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Scope Helper bar */}
      <div className="bg-[#1A1A28] border border-gold-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
            <Sparkles className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F0EDE8] font-serif">Struggling to write deliverables?</h4>
            <p className="text-xs text-[#9B97B2]">Describe your bakery, app, or blog, and Claude will auto-scope the brief.</p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text"
            placeholder="e.g. website for organic bakery"
            value={aiScopingInput}
            onChange={e => setAiScopingInput(e.target.value)}
            className="px-3 py-1.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs text-[#F0EDE8] w-full md:w-48 focus:outline-none focus:border-gold-500"
          />
          <button 
            onClick={executeAIScoping}
            disabled={aiScopingLoading}
            className="px-4 py-1.5 bg-gold-500 text-black text-xs font-semibold rounded-lg shrink-0 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {aiScopingLoading ? "Scoping..." : "AI Scope Assist"}
          </button>
        </div>
      </div>

      {/* Multi-step form wizard */}
      <div className="bg-[#1A1A28] border border-[#2A2A42] rounded-xl overflow-hidden shadow-xl">
        <div className="flex border-b border-[#2A2A42] text-xs font-mono">
          {["Basics", "Details", "Budget", "Review"].map((n, i) => (
            <div 
              key={n}
              className={`w-1/4 py-3 text-center transition-all ${formStep === i + 1 ? 'bg-[#22223A] border-b-2 border-gold-500 text-gold-500' : 'text-[#5C5878]'}`}
            >
              Step {i + 1}: {n}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-6 min-h-[300px]">
          {formStep === 1 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Project Working Title</label>
                <input 
                  type="text" 
                  value={fields.title}
                  onChange={e => setFields(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                  placeholder="React E-Commerce Payment Gateway Integration"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Category</label>
                  <select 
                    value={fields.category}
                    onChange={e => setFields(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500"
                  >
                    <option value="Web Dev">Web Development</option>
                    <option value="Design">UI/UX & Brand Design</option>
                    <option value="Video">Video Editing</option>
                    <option value="Writing">Technical Copywriting</option>
                    <option value="Other">Other Specialty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Contract Type</label>
                  <div className="flex gap-2 pt-0.5">
                    <button 
                      type="button" 
                      onClick={() => setFields(p => ({ ...p, type: 'fixed' }))}
                      className={`w-1/2 py-2 text-xs font-semibold rounded-lg border transition-all ${fields.type === 'fixed' ? 'bg-gold-500 text-black border-gold-500' : 'bg-[#12121A] text-[#9B97B2] border-[#2A2A42]'}`}
                    >
                      Fixed Price
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFields(p => ({ ...p, type: 'hourly' }))}
                      className={`w-1/2 py-2 text-xs font-semibold rounded-lg border transition-all ${fields.type === 'hourly' ? 'bg-gold-500 text-black border-gold-500' : 'bg-[#12121A] text-[#9B97B2] border-[#2A2A42]'}`}
                    >
                      Hourly Rate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Detailed Description (SaaS scope)</label>
                <textarea 
                  value={fields.description}
                  onChange={e => setFields(p => ({ ...p, description: e.target.value }))}
                  className="w-full h-32 px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8] focus:outline-none focus:border-gold-500 resize-none"
                  placeholder="Explain exactly what problem is being resolved, expected deliverables, and visual design parameters."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Add Required Skills</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={fields.currentSkillInput}
                    onChange={e => setFields(p => ({ ...p, currentSkillInput: e.target.value }))}
                    className="px-4 py-1.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs text-[#F0EDE8] focus:outline-none focus:border-gold-500" 
                    placeholder="Framer, Python..."
                  />
                  <button type="button" onClick={handleAddSkill} className="px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-xs rounded-lg">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {fields.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#12121A] border border-[#2A2A42] text-xs text-gold-500 rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Required Deliverables Checklist</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={fields.currentDelInput}
                    onChange={e => setFields(p => ({ ...p, currentDelInput: e.target.value }))}
                    className="px-4 py-1.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs text-[#F0EDE8] w-full focus:outline-none" 
                    placeholder="Milestone 1: Prototype screens delivery..."
                  />
                  <button type="button" onClick={handleAddDeliverable} className="px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-xs rounded-lg shrink-0">Add</button>
                </div>
                <ul className="mt-2 space-y-1">
                  {fields.deliverables.map((d, index) => (
                    <li key={index} className="flex items-center justify-between text-xs bg-[#12121A] border border-[#2A2A42] px-3 py-1.5 rounded">
                      <span className="truncate">{d}</span>
                      <button type="button" onClick={() => removeDeliverable(index)} className="text-red-400 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {formStep === 3 && (
            <div className="space-y-5 animate-slide-up">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Min Budget ($ USD)</label>
                  <input 
                    type="number" 
                    value={fields.minBudget}
                    onChange={e => setFields(p => ({ ...p, minBudget: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Max Budget ($ USD)</label>
                  <input 
                    type="number" 
                    value={fields.maxBudget}
                    onChange={e => setFields(p => ({ ...p, maxBudget: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Target Deadline</label>
                  <input 
                    type="date" 
                    value={fields.deadline}
                    onChange={e => setFields(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1">Required Talent Level</label>
                  <select
                    value={fields.experience}
                    onChange={e => setFields(p => ({ ...p, experience: e.target.value }))}
                    className="w-full px-4 py-2 bg-[#12121A] border border-[#2A2A42] rounded-lg text-sm text-[#F0EDE8]"
                  >
                    <option value="Expert">Expert Pro (Apple/Vercel level)</option>
                    <option value="Intermediate">Intermediate Core developer</option>
                    <option value="Beginner">Beginner / Junior</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {formStep === 4 && (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-[#12121A] border border-[#2A2A42] p-5 rounded-xl">
                <span className="text-[10px] font-mono text-gold-500 uppercase">Brief Preview</span>
                <h3 className="text-xl font-serif font-bold text-[#F0EDE8] mt-1">{fields.title || "Untitled Project"}</h3>
                <div className="flex gap-2 flex-wrap text-[10px] font-mono text-[#9B97B2] mt-2 border-b border-[#2A2A42] pb-3">
                  <span>Category: {fields.category}</span>
                  <span>•</span>
                  <span>Budget: ${fields.minBudget} - ${fields.maxBudget}</span>
                  <span>•</span>
                  <span>Deadline: {fields.deadline}</span>
                </div>
                
                <p className="text-xs text-[#9B97B2] mt-3 leading-relaxed">{fields.description || "No description provided."}</p>
                
                <div className="mt-4">
                  <span className="text-[10px] font-mono text-[#5C5878] uppercase">Skills Required</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {fields.skills.map(s => <span key={s} className="px-2 py-0.5 bg-[#1A1A28] border border-[#2A2A42] text-[10px] text-gold-500 rounded">{s}</span>)}
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-[10px] font-mono text-[#5C5878] uppercase">Deliverables ({fields.deliverables.length})</span>
                  <ul className="list-disc pl-4 text-xs text-[#9B97B2] mt-1 space-y-1">
                    {fields.deliverables.map((d, index) => <li key={index}>{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#12121A] border-t border-[#2A2A42] px-6 py-4 flex justify-between">
          <button 
            type="button" 
            onClick={() => setFormStep(prev => Math.max(1, prev - 1))}
            disabled={formStep === 1}
            className="px-4 py-2 bg-transparent text-[#9B97B2] hover:text-[#F0EDE8] disabled:opacity-30 text-xs font-semibold"
          >
            Previous
          </button>
          
          {formStep < 4 ? (
            <button 
              type="button" 
              onClick={() => setFormStep(prev => Math.min(4, prev + 1))}
              className="px-4 py-2 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500/50 text-[#F0EDE8] text-xs font-semibold rounded-lg"
            >
              Continue
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handlePost}
              className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-black text-xs font-semibold rounded-lg hover:scale-105 active:scale-95 transition-all"
            >
              Post Project to Marketplace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. CLIENT VIEW: MANAGE AUDITS & AI MATCH
// ==========================================

function ManageAuditsView({ state, dispatch, addToast }) {
  const [activeProject, setActiveProject] = useState(null);
  const [matchingResults, setMatchingResults] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Proposal evaluation AI
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const [showContractSetup, setShowContractSetup] = useState(false);
  const [selectedProposalForHiring, setSelectedProposalForHiring] = useState(null);

  const myPostedProjects = state.projects.filter(p => p.client?.id === state.currentUser.id || p.clientId === state.currentUser.id);

  // AI Freelancer Match (Feature #1)
  const runSmartMatch = async (proj) => {
    setActiveProject(proj);
    setMatchingLoading(true);
    setMatchingResults(null);
    setEvaluationResults(null);
    addToast("Executing AI Smart Match on freelancer vector indexes...");

    try {
      let result;
      if (state.apiKey) {
        const sys = "You are a freelancer matching engine. Ranks the top 5 freelancers for a brief. Return ONLY JSON: { \"matches\": [ { \"freelancerId\": \"...\", \"matchScore\": 92, \"reasoning\": \"...\" } ] }";
        const user = `Project: ${proj.title}. Skills: ${proj.skills.join(', ')}. Budget: ${proj.budget}. Freelancers: ${JSON.stringify(state.freelancers)}`;
        result = await callClaudeAPI(sys, user, state.apiKey);
      } else {
        result = await simulateClaudeIntelligence('match', { 
          title: proj.title, description: proj.description, 
          skills: proj.skills, budget: proj.budget, 
          freelancers: state.freelancers 
        });
      }
      setMatchingResults(result.matches);
      addToast("Smart match complete! Ranked lists available.");
    } catch (e) {
      addToast(`Matching failed: ${e.message}`);
    } finally {
      setMatchingLoading(false);
    }
  };

  // AI Evaluate Proposals (Feature #2)
  const evaluateProposalsAI = async (proj) => {
    const bids = state.proposals.filter(p => p.projectId === proj.id);
    if (bids.length === 0) {
      addToast("No proposals bid on this project yet.");
      return;
    }

    setEvaluationLoading(true);
    setEvaluationResults(null);
    addToast("Claude is auditing each cover letter relevance...");

    try {
      let result;
      if (state.apiKey) {
        const sys = "You are a proposal evaluator. Grade bids on Relevance (0-10), Clarity (0-10), Value (0-10). Return ONLY JSON: { \"evaluations\": [ { \"proposalId\": \"...\", \"relevance\": 8, \"clarity\": 9, \"valueForMoney\": 7, \"totalScore\": 24, \"recommendation\": \"...\", \"shortlist\": true } ] }";
        const user = `Project: ${proj.title}. Deliverables: ${proj.deliverables.join(', ')}. Proposals: ${JSON.stringify(bids)}`;
        result = await callClaudeAPI(sys, user, state.apiKey);
      } else {
        result = await simulateClaudeIntelligence('evaluate', { proposals: bids });
      }
      setEvaluationResults(result.evaluations);
      addToast("AI evaluation done! Highlighted optimal proposals.");
    } catch (e) {
      addToast(`Evaluation failed: ${e.message}`);
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleHireClick = (proposal) => {
    setSelectedProposalForHiring(proposal);
    setShowContractSetup(true);
  };

  const finalizeHiring = async () => {
    if (!selectedProposalForHiring) return;
    const proj = state.projects.find(p => p.id === selectedProposalForHiring.projectId);
    const fl = state.freelancers.find(f => f.id === selectedProposalForHiring.freelancerId);
    
    try {
      // Create contract in backend
      const newContract = await apiFetch('/api/contracts', {
        method: 'POST',
        body: JSON.stringify({
          projectId: proj.id,
          freelancerId: fl.id,
          totalValue: selectedProposalForHiring.bidAmount
        })
      });

      // Update proposal status in backend
      await apiFetch(`/api/projects/proposals/${selectedProposalForHiring.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Hired' })
      });

      // Update local state immediately
      const localContract = {
        ...newContract,
        projectName: proj.title,
        freelancerName: fl.name,
        clientName: state.currentUser.name,
        deliverables: newContract.deliverables || proj.deliverables.map(d => ({ name: d, status: 'Not Started' })),
        messages: [{ sender: 'System', text: `Contract established with ${fl.name} for $${selectedProposalForHiring.bidAmount}. Milestone funds locked in escrow.`, time: 'Just now' }]
      };

      dispatch({ type: 'ADD_CONTRACT', payload: localContract });
      dispatch({ type: 'UPDATE_PROPOSAL_STATUS', payload: { id: selectedProposalForHiring.id, status: 'Hired' } });
      
      addToast(`Hired ${fl.name}! Escrow contract activated.`);
    } catch (error) {
      addToast(`Failed to create contract: ${error.message}`);
    } finally {
      setShowContractSetup(false);
      setSelectedProposalForHiring(null);
      dispatch({ type: 'SET_VIEW', payload: 'cl-my-projects' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Posted projects */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">Your Posted Briefs</h3>
          {myPostedProjects.length === 0 ? (
            <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl text-center">
              <p className="text-xs text-[#9B97B2]">No active projects posted.</p>
              <button 
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'cl-post-project' })}
                className="mt-3 px-4 py-1.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all"
              >
                Post Now
              </button>
            </div>
          ) : (
            myPostedProjects.map(proj => (
              <div 
                key={proj.id} 
                onClick={() => runSmartMatch(proj)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${activeProject?.id === proj.id ? 'border-gold-500 bg-[#1A1A28]' : 'border-[#2A2A42] bg-[#12121A] hover:border-gold-500/20'}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold font-serif text-[#F0EDE8] leading-snug">{proj.title}</h4>
                  <span className="text-[9px] bg-[#22223A] border border-[#2A2A42] text-gold-500 px-1.5 py-0.5 rounded uppercase font-mono">${proj.budget}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-[#9B97B2] font-mono justify-between">
                  <span>Deadline: {proj.deadline}</span>
                  <span className="text-gold-500 bg-gold-500/5 px-2 py-0.5 border border-gold-500/20 rounded-full">{proj.category}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Center/Right: Matching Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {activeProject ? (
            <div className="space-y-6">
              
              {/* Project Detail Header */}
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
                <span className="text-[9px] text-[#5C5878] font-mono uppercase">Managing Project</span>
                <h2 className="text-xl font-serif font-bold text-gold-500 mt-1">{activeProject.title}</h2>
                <p className="text-xs text-[#9B97B2] mt-2 leading-relaxed">{activeProject.description}</p>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => evaluateProposalsAI(activeProject)}
                    disabled={evaluationLoading}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-xs text-gold-500 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{evaluationLoading ? "Evaluating..." : "AI Evaluate All Bids"}</span>
                  </button>
                </div>
              </div>

              {/* Proposal Evaluations if they exist */}
              {evaluationResults && (
                <div className="space-y-3 animate-slide-up">
                  <h3 className="text-sm font-mono text-[#5C5878] uppercase">Claude Proposal Audit Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluationResults.map(evalItem => {
                      const proposal = state.proposals.find(p => p.id === evalItem.proposalId);
                      if (!proposal) return null;
                      const fl = state.freelancers.find(f => f.id === proposal.freelancerId) || state.currentUser;
                      
                      return (
                        <div 
                          key={evalItem.proposalId}
                          className={`p-4 bg-[#1A1A28] border rounded-xl flex flex-col justify-between ${evalItem.shortlist ? 'border-gold-500 glow-active' : 'border-[#2A2A42]'}`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2 justify-between">
                              <div className="flex items-center gap-2">
                                <img src={fl.avatar} alt="" className="w-6 h-6 rounded-full" />
                                <span className="text-xs font-bold">{fl.name}</span>
                              </div>
                              <span className="text-[10px] text-gold-500 font-mono font-semibold">${proposal.bidAmount}</span>
                            </div>
                            
                            {/* Score mini charts */}
                            <div className="space-y-1 mt-2 bg-[#12121A] p-2 rounded border border-[#2A2A42]">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span>Relevance</span>
                                <span className="text-gold-500">{evalItem.relevance}/10</span>
                              </div>
                              <div className="w-full bg-[#1A1A28] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${evalItem.relevance * 10}%` }} />
                              </div>

                              <div className="flex justify-between text-[10px] font-mono mt-1.5">
                                <span>Clarity</span>
                                <span className="text-gold-500">{evalItem.clarity}/10</span>
                              </div>
                              <div className="w-full bg-[#1A1A28] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${evalItem.clarity * 10}%` }} />
                              </div>

                              <div className="flex justify-between text-[10px] font-mono mt-1.5">
                                <span>Value</span>
                                <span className="text-gold-500">{evalItem.valueForMoney}/10</span>
                              </div>
                              <div className="w-full bg-[#1A1A28] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${evalItem.valueForMoney * 10}%` }} style={{ width: `${evalItem.valueForMoney * 10}%` }} />
                              </div>
                            </div>
                            
                            <p className="text-[10px] text-[#9B97B2] leading-normal mt-2 italic">"{evalItem.recommendation}"</p>
                          </div>

                          <div className="flex gap-2 mt-4 pt-2 border-t border-[#2A2A42]">
                            {proposal.status === "Hired" ? (
                              <span className="w-full text-center py-1 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-semibold rounded">Contract Active</span>
                            ) : (
                              <button 
                                onClick={() => handleHireClick(proposal)}
                                className="w-full py-1 bg-gold-500 hover:bg-gold-600 text-black text-xs font-semibold rounded"
                              >
                                Accept & Hire
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Smart Matches (Feature #1) */}
              <div className="space-y-3">
                <h3 className="text-sm font-mono text-[#5C5878] uppercase">Claude Matching Engine Rank</h3>
                {matchingLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-[#1A1A28] border border-[#2A2A42] rounded-xl animate-pulse flex items-center px-4 justify-between">
                        <div className="w-1/3 h-4 bg-[#22223A] rounded" />
                        <div className="w-12 h-6 bg-[#22223A] rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : matchingResults ? (
                  <div className="space-y-3">
                    {matchingResults.map((match, idx) => {
                      const fl = state.freelancers.find(f => f.id === match.freelancerId);
                      if (!fl) return null;
                      return (
                        <div 
                          key={fl.id} 
                          className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl flex items-center justify-between gap-4 hover:border-gold-500/30 transition-all hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={fl.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1A1A28]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold">{fl.name}</span>
                                {fl.proMember && <span className="text-[9px] bg-gold-500/20 text-gold-500 border border-gold-500/30 px-1 py-0.2 rounded uppercase font-mono">Pro</span>}
                              </div>
                              <p className="text-xs text-[#9B97B2]">{fl.specialty}</p>
                              <p className="text-[10px] text-[#5C5878] leading-tight max-w-sm mt-1">{match.reasoning}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs bg-gold-500/20 border border-gold-500/30 text-gold-500 px-2 py-0.5 rounded-full font-bold font-mono">
                              Match Score: {match.matchScore}%
                            </span>
                            <div className="flex gap-2 mt-2 justify-end">
                              <button 
                                onClick={() => {
                                  dispatch({ type: 'SET_USER', payload: { savedNotes: "" } });
                                  dispatch({ type: 'TOGGLE_SAVE_FREELANCER', payload: fl });
                                  addToast(`Saved ${fl.name} to bookmarks.`);
                                }}
                                className="p-1.5 bg-[#12121A] border border-[#2A2A42] text-[#9B97B2] hover:text-[#F0EDE8] rounded hover:border-gold-500/20"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => addToast(`Invite sent to ${fl.name}!`)}
                                className="px-3 py-1 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 active:scale-95 transition-all"
                              >
                                Invite
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl text-center">
                    <p className="text-xs text-[#9B97B2]">Click Smart Match or evaluate proposals to begin analysis.</p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-64 bg-[#1A1A28] border border-[#2A2A42] rounded-xl flex items-center justify-center text-center">
              <div>
                <Sparkles className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
                <h3 className="text-sm font-serif text-[#F0EDE8]">No brief selected.</h3>
                <p className="text-xs text-[#9B97B2] mt-1">Select an active brief from the sidebar to inspect AI rankings.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contract setup modal */}
      {showContractSetup && selectedProposalForHiring && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-serif font-bold text-gold-500">Milestone Contract Setup</h3>
            <p className="text-xs text-[#9B97B2] leading-normal">
              You are hiring a developer. The bid amount is locked in escrow. Releases occur when deliverables are approved.
            </p>

            <div className="bg-[#12121A] p-3 rounded border border-[#2A2A42] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>Contract Total:</span>
                <span className="text-gold-500 font-bold">${selectedProposalForHiring.bidAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission (10%):</span>
                <span className="text-[#5C5878]">${selectedProposalForHiring.bidAmount * 0.1}</span>
              </div>
              <div className="flex justify-between border-t border-[#2A2A42] pt-2">
                <span>Developer Receives:</span>
                <span className="text-emerald-400 font-bold">${selectedProposalForHiring.bidAmount * 0.9}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowContractSetup(false)}
                className="w-1/2 py-2 bg-transparent border border-[#2A2A42] text-[#9B97B2] rounded hover:border-[#9B97B2] text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={finalizeHiring}
                className="w-1/2 py-2 bg-gold-500 text-black rounded hover:scale-105 text-xs font-semibold transition-all"
              >
                Lock Escrow & Hire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 11. SAVED FREELANCERS (CLIENT BOOKMARKS)
// ==========================================

function SavedFreelancersView({ state, dispatch, addToast }) {
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const saveNote = (flId) => {
    dispatch({
      type: 'SET_USER',
      payload: { savedNotes: { ...state.currentUser.savedNotes, [flId]: noteText } }
    });
    addToast("Private note updated successfully!");
    setActiveNotesId(null);
  };

  const startNote = (flId) => {
    setActiveNotesId(flId);
    setNoteText(state.currentUser.savedNotes?.[flId] || "");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">Your Saved Talent Vector Directory</h3>
      {state.savedFreelancers.length === 0 ? (
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-8 rounded-xl text-center max-w-md mx-auto">
          <Bookmark className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
          <p className="text-sm text-[#9B97B2]">No bookmarked freelancers.</p>
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'cl-my-projects' })}
            className="mt-3 px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] text-gold-500 text-xs font-semibold rounded hover:scale-105 transition-all"
          >
            Explore Matching
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.savedFreelancers.map(fl => {
            const privateNote = state.currentUser.savedNotes?.[fl.id] || "";
            return (
              <div key={fl.id} className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-all">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <img src={fl.avatar} alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold">{fl.name}</h4>
                          {fl.verified && <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-[#9B97B2]">{fl.specialty}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gold-500 font-mono">${fl.hourlyRate}/hr</span>
                  </div>

                  {privateNote && (
                    <div className="mt-3 bg-[#12121A] p-2.5 rounded border border-gold-500/10 text-[10px] text-gold-500 font-mono italic">
                      Note: {privateNote}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-[#2A2A42]">
                  <button 
                    onClick={() => startNote(fl.id)}
                    className="w-1/2 py-1.5 bg-[#12121A] border border-[#2A2A42] text-xs hover:border-[#9B97B2] rounded"
                  >
                    Edit Note
                  </button>
                  <button 
                    onClick={() => dispatch({ type: 'TOGGLE_SAVE_FREELANCER', payload: fl })}
                    className="w-1/2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded border border-red-500/20"
                  >
                    Remove
                  </button>
                </div>

                {activeNotesId === fl.id && (
                  <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl max-w-sm w-full space-y-4">
                      <h4 className="text-sm font-semibold">Private Portfolio Note ({fl.name})</h4>
                      <textarea
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        className="w-full h-24 p-3 bg-[#12121A] border border-[#2A2A42] rounded text-xs text-[#F0EDE8]"
                        placeholder="Write client remarks..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setActiveNotesId(null)} className="px-3 py-1 bg-transparent text-xs">Cancel</button>
                        <button onClick={() => saveNote(fl.id)} className="px-4 py-1 bg-gold-500 text-black text-xs font-semibold rounded">Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. FREELANCER VIEW: PORTFOLIO GALLERY
// ==========================================

function PortfolioGalleryView({ state, dispatch, addToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Dev");
  const [desc, setDesc] = useState("");
  const [tools, setTools] = useState("");
  const [gitLink, setGitLink] = useState("");
  const [liveLink, setLiveLink] = useState("");

  const myPortfolio = state.currentUser.portfolio || [];

  const handleAddProject = async () => {
    if (!title || !desc) {
      addToast("Title and Description are required.");
      return;
    }
    try {
      const updatedUser = await apiFetch('/api/auth/profile/portfolio', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          tools: tools.split(',').map(x => x.trim()).filter(Boolean),
          desc,
          github: gitLink,
          live: liveLink
        })
      });
      dispatch({ type: 'SET_USER', payload: updatedUser });
      addToast(`Portfolio item "${title}" added to gallery!`);
      setShowAddModal(false);
      setTitle("");
      setCategory("Web Dev");
      setDesc("");
      setTools("");
      setGitLink("");
      setLiveLink("");
    } catch (error) {
      addToast(`Failed to add portfolio item: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-[#2A2A42] pb-3">
        <h3 className="text-lg font-serif font-semibold text-[#F0EDE8]">My Portfolio Showcase</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 hover:bg-gold-600 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {myPortfolio.length === 0 ? (
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-8 rounded-xl text-center max-w-sm mx-auto">
          <BookOpen className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
          <p className="text-xs text-[#9B97B2]">No assets inside showcase. Click add project to present credentials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myPortfolio.map(item => (
            <div 
              key={item.id} 
              onClick={() => setActiveProjectDetail(item)}
              className="bg-[#1A1A28] border border-[#2A2A42] rounded-xl overflow-hidden hover:border-gold-500/30 transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01]"
            >
              {/* Cover placeholder */}
              <div className="h-32 bg-gradient-to-br from-[#12121A] to-[#22223A] border-b border-[#2A2A42] flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gold-500/40" />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-gold-500/5 text-gold-500 border border-gold-500/10 px-2 py-0.5 rounded">{item.category}</span>
                </div>
                <h4 className="text-sm font-bold mt-2 truncate font-serif text-[#F0EDE8]">{item.title}</h4>
                <p className="text-xs text-[#9B97B2] line-clamp-2 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-1">
                {item.tools?.slice(0, 3).map(t => <span key={t} className="text-[9px] bg-[#12121A] text-[#9B97B2] px-2 py-0.5 border border-[#2A2A42] rounded">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
              <h3 className="text-md font-serif font-bold text-gold-500">Inject Portfolio Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Project Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]" placeholder="Glassmorphism Prompt Editor" />
              </div>
              
              <div>
                <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]">
                  <option value="Web Dev">Web Development</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Video">Video Production</option>
                  <option value="Writing">Technical Blog</option>
                  <option value="Other">Other Specialty</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Tools Used (Comma separated)</label>
                <input type="text" value={tools} onChange={e => setTools(e.target.value)} className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]" placeholder="React, NextJS, CSS" />
              </div>

              <div>
                <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Project Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full h-20 px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8] resize-none" placeholder="Describe the problem, outcomes, and code challenges resolved..." />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">GitHub URL</label>
                  <input type="url" value={gitLink} onChange={e => setGitLink(e.target.value)} className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]" placeholder="https://github.com" />
                </div>
                <div>
                  <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Live URL</label>
                  <input type="url" value={liveLink} onChange={e => setLiveLink(e.target.value)} className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]" placeholder="https://live.com" />
                </div>
              </div>
            </div>

            <button onClick={handleAddProject} className="w-full py-2 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-[1.02] transition-all">Save Project Showcase</button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeProjectDetail && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
              <h3 className="text-md font-serif font-bold text-gold-500">{activeProjectDetail.title}</h3>
              <button onClick={() => setActiveProjectDetail(null)} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
            </div>
            
            <p className="text-xs text-[#9B97B2] leading-relaxed">{activeProjectDetail.desc}</p>
            
            <div>
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Scope Badges</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {activeProjectDetail.tools?.map(t => <span key={t} className="px-2 py-0.5 bg-[#12121A] text-xs border border-[#2A2A42] text-gold-500 rounded">{t}</span>)}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#2A2A42]">
              {activeProjectDetail.github && (
                <a href={activeProjectDetail.github} target="_blank" className="w-1/2 text-center py-2 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-gold-500 text-xs font-semibold rounded">
                  GitHub Code
                </a>
              )}
              {activeProjectDetail.live && (
                <a href={activeProjectDetail.live} target="_blank" className="w-1/2 text-center py-2 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 transition-all">
                  Live Preview
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 13. FREELANCER VIEW: MY PROPOSALS
// ==========================================

function MyProposalsView({ state, dispatch, addToast }) {
  const myBids = state.proposals.filter(p => p.freelancerId === state.currentUser.id || p.freelancerId === "fl-1");

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">My Submitted Bid Packages</h3>
      {myBids.length === 0 ? (
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-8 rounded-xl text-center max-w-sm mx-auto">
          <FileText className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
          <p className="text-xs text-[#9B97B2]">No active proposal packages filed yet. Click "Browse Projects" to bid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map(bid => {
            const proj = state.projects.find(p => p.id === bid.projectId) || { title: "Custom Admin Suite", budget: 1200 };
            return (
              <div key={bid.id} className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-serif text-[#F0EDE8]">{proj.title}</h4>
                    <span className="text-[10px] bg-[#12121A] border border-[#2A2A42] text-gold-500 px-2 py-0.5 rounded font-mono">${bid.bidAmount}</span>
                  </div>
                  <p className="text-xs text-[#9B97B2] mt-2 line-clamp-2 italic">"{bid.cover}"</p>
                  <div className="flex gap-2 items-center text-[10px] text-[#5C5878] font-mono mt-3">
                    <span>Bid Date: {bid.postedDate || "May 26, 2026"}</span>
                    <span>•</span>
                    <span>Timeline: {bid.timeline}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-mono uppercase font-bold ${
                    bid.status === "Hired" ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" :
                    bid.status === "Shortlisted" ? "bg-gold-500/20 text-gold-500 border border-gold-500/30 animate-pulse" :
                    "bg-[#22223A] text-[#9B97B2] border border-[#2A2A42]"
                  }`}>
                    {bid.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 14. FREELANCER VIEW: BROWSE PROJECTS
// ==========================================

function BrowseProjectsView({ state, dispatch, addToast }) {
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);
  const [showBidPanel, setShowBidPanel] = useState(false);
  const [selectedProjectForBid, setSelectedProjectForBid] = useState(null);
  
  // Bid input fields
  const [bidAmt, setBidAmt] = useState("");
  const [bidTimeline, setBidTimeline] = useState("1 week");
  const [bidCover, setBidCover] = useState("");
  const [bidPortfolio, setBidPortfolio] = useState([]);

  const openBidPanel = (proj) => {
    setSelectedProjectForBid(proj);
    setShowBidPanel(true);
    setBidAmt(proj.budget);
  };

  const submitProposal = async () => {
    if (!bidAmt || bidCover.length < 20) {
      addToast("Please fill in Bid Amount and a cover letter (>20 characters)");
      return;
    }
    try {
      const newProposal = await apiFetch(`/api/projects/${selectedProjectForBid.id}/proposals`, {
        method: 'POST',
        body: JSON.stringify({
          bidAmount: Number(bidAmt),
          timeline: bidTimeline,
          cover: bidCover
        })
      });
      dispatch({ type: 'SUBMIT_PROPOSAL', payload: newProposal });
      addToast(`Proposal for "${selectedProjectForBid.title}" filed!`);
      setShowBidPanel(false);
      setSelectedProjectForBid(null);
      setBidCover("");
    } catch (error) {
      addToast(`Failed to submit proposal: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">Active Developer Briefs Marketplace</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Marketplace cards */}
        <div className="lg:col-span-2 space-y-4">
          {state.projects.map(proj => (
            <div 
              key={proj.id}
              className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-gold-500/20 transition-all hover:scale-[1.01]"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-gold-500">{proj.title}</h4>
                    <p className="text-[10px] text-[#9B97B2] font-mono mt-1">Client: {proj.client.name}</p>
                  </div>
                  <span className="text-xs bg-[#12121A] border border-[#2A2A42] text-gold-500 px-3 py-1 rounded font-mono font-bold">${proj.budget}</span>
                </div>
                <p className="text-xs text-[#9B97B2] mt-3 line-clamp-2 leading-relaxed">{proj.description}</p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#2A2A42] text-[10px] font-mono text-[#5C5878]">
                <div className="flex gap-2 items-center">
                  <span className="px-2 py-0.5 bg-[#12121A] text-gold-500 rounded border border-[#2A2A42]">{proj.category}</span>
                  <span>Level: {proj.experienceLevel}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveProjectDetail(proj)}
                    className="px-3 py-1.5 bg-transparent border border-[#2A2A42] text-[#9B97B2] hover:text-[#F0EDE8] rounded"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => openBidPanel(proj)}
                    className="px-4 py-1.5 bg-gold-500 text-black font-semibold rounded hover:scale-105 transition-all"
                  >
                    Apply & Bid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar challenges / Wins */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
            <h4 className="text-sm font-serif font-bold text-gold-500 mb-3 border-b border-[#2A2A42] pb-1.5">Weekly Active Challenges</h4>
            {state.challenges.filter(c => c.active).map(c => (
              <div key={c.id} className="space-y-2 text-xs">
                <span className="text-[9px] bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">Active Contest</span>
                <h5 className="font-serif font-bold">{c.title}</h5>
                <p className="text-[#9B97B2] leading-normal">{c.description}</p>
                <div className="flex justify-between items-center text-[10px] font-mono pt-2 border-t border-[#2A2A42]">
                  <span className="text-gold-500">{c.prize}</span>
                  <span>Ends: {c.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {activeProjectDetail && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
              <h3 className="text-md font-serif font-bold text-gold-500">{activeProjectDetail.title}</h3>
              <button onClick={() => setActiveProjectDetail(null)} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
            </div>
            
            <p className="text-xs text-[#9B97B2] leading-relaxed">{activeProjectDetail.description}</p>
            
            <div>
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Skills Map</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {activeProjectDetail.skills.map(s => <span key={s} className="px-2 py-0.5 bg-[#12121A] text-xs border border-[#2A2A42] text-gold-500 rounded">{s}</span>)}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Expected Deliverables Checklist</span>
              <ul className="list-disc pl-4 text-xs text-[#9B97B2] mt-1 space-y-1">
                {activeProjectDetail.deliverables.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            <button 
              onClick={() => {
                setActiveProjectDetail(null);
                openBidPanel(activeProjectDetail);
              }}
              className="w-full py-2.5 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 transition-all"
            >
              Submit Bid Proposal Layout
            </button>
          </div>
        </div>
      )}

      {/* Submit Bid slide-in modal */}
      {showBidPanel && selectedProjectForBid && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
              <h3 className="text-md font-serif font-bold text-gold-500">Bidding: {selectedProjectForBid.title}</h3>
              <button onClick={() => setShowBidPanel(false)} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Bid Amount ($ USD)</label>
                  <input 
                    type="number" 
                    value={bidAmt} 
                    onChange={e => setBidAmt(e.target.value)} 
                    className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]" 
                  />
                </div>
                <div>
                  <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Timeline</label>
                  <select 
                    value={bidTimeline} 
                    onChange={e => setBidTimeline(e.target.value)} 
                    className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8]"
                  >
                    <option value="1 week">1 Week</option>
                    <option value="2 weeks">2 Weeks</option>
                    <option value="1 month">1 Month</option>
                    <option value="Custom">Custom timeline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Cover Message & Outlines</label>
                <textarea 
                  value={bidCover} 
                  onChange={e => setBidCover(e.target.value)} 
                  className="w-full h-24 px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8] resize-none" 
                  placeholder="Introduce your Next/React credentials. Outline your approach in at least 20 chars..." 
                />
                <span className="text-[10px] text-[#5C5878] mt-1 block">Character count: {bidCover.length}</span>
              </div>
            </div>

            <button onClick={submitProposal} className="w-full py-2 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 transition-all">Submit Bid Package</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 15. FREELANCER VIEW: CONTRACTS TRACKER & CHAT
// ==========================================

function ContractsView({ state, dispatch, addToast }) {
  const [activeContract, setActiveContract] = useState(null);
  const [chatText, setChatText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Check if they are freelancer or client, and filter active escrow agreements
  const activeContracts = state.contracts;

  const handleSendMessage = () => {
    if (!chatText) return;
    const updateMsg = {
      sender: "Me",
      text: chatText,
      time: "Just now"
    };

    dispatch({
      type: 'ADD_CONTRACT_MSG',
      payload: { contractId: activeContract.id, msg: updateMsg }
    });

    // Simulate Client response
    setTimeout(() => {
      dispatch({
        type: 'ADD_CONTRACT_MSG',
        payload: {
          contractId: activeContract.id,
          msg: { sender: activeContract.freelancerName, text: "Excellent submission. Let me review your code artifacts and trigger escrow unlock.", time: "Just now" }
        }
      });
    }, 1500);

    setChatText("");
  };

  const handleDeliverableStatusChange = async (cId, idx, status) => {
    // Optimistic local update
    dispatch({ type: 'UPDATE_DELIVERABLE', payload: { contractId: cId, index: idx, status } });
    addToast(`Milestone Status updated to: ${status}`);

    try {
      await apiFetch(`/api/contracts/${cId}/deliverables/${idx}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      if (status === 'Approved') {
        // Release payment in backend
        const releaseResult = await apiFetch(`/api/contracts/${cId}/release`, {
          method: 'POST',
          body: JSON.stringify({ deliverableIndex: idx })
        });

        dispatch({ type: 'RELEASE_PAYMENT', payload: { contractId: cId } });

        const amt = Math.round(activeContract.totalValue / activeContract.deliverables.length);
        const fee = Math.round(amt * 0.1);
        const net = amt - fee;

        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            id: `t-${Date.now()}`,
            date: new Date().toLocaleDateString(),
            project: activeContract.projectName,
            client: activeContract.clientName,
            type: 'Income',
            gross: amt,
            net: net,
            commission: fee,
            status: 'completed'
          }
        });

        addToast(`Escrow release complete! $${net} credited to wallet.`);
      }
    } catch (error) {
      console.error('Contract update error:', error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Escrow contracts lists */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">Active Escrow Contracts</h3>
          {activeContracts.length === 0 ? (
            <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl text-center">
              <p className="text-xs text-[#9B97B2]">No active agreements locked. Bids must be accepted first.</p>
            </div>
          ) : (
            activeContracts.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveContract(c)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${activeContract?.id === c.id ? 'border-gold-500 bg-[#1A1A28]' : 'border-[#2A2A42] bg-[#12121A] hover:border-gold-500/20'}`}
              >
                <h4 className="text-xs font-bold font-serif text-[#F0EDE8]">{c.projectName}</h4>
                <div className="flex justify-between items-center text-[10px] text-[#9B97B2] font-mono mt-3">
                  <span>Val: ${c.totalValue}</span>
                  <span className="text-gold-500 bg-gold-500/5 px-2 py-0.5 rounded border border-gold-500/20">Active Contract</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Center/Right Details and simulated workspace */}
        <div className="lg:col-span-2 space-y-6">
          {activeContract ? (
            <div className="space-y-6">
              
              {/* Deliverables Tracker Checklist */}
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
                <span className="text-[9px] text-[#5C5878] font-mono uppercase">Escrow Tracker</span>
                <h3 className="text-md font-serif font-bold text-gold-500 mt-1">{activeContract.projectName}</h3>
                
                <div className="mt-4 space-y-3">
                  {activeContract.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#12121A] border border-[#2A2A42] p-3 rounded-lg text-xs">
                      <div>
                        <span className="font-mono text-[#5C5878] block">MILESTONE 0{idx+1}</span>
                        <span className="text-[#F0EDE8] font-medium">{del.name}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {state.currentUser.role === 'client' || state.currentUser.role === 'both' ? (
                          <div className="flex gap-1.5">
                            {del.status !== "Approved" && (
                              <button 
                                onClick={() => handleDeliverableStatusChange(activeContract.id, idx, "Approved")}
                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-[10px]"
                              >
                                Approve & Pay
                              </button>
                            )}
                            {del.status === "Approved" ? (
                              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[10px] rounded uppercase font-bold">Approved</span>
                            ) : (
                              <span className="px-2.5 py-1 bg-[#1A1A28] border border-[#2A2A42] text-[10px] rounded">{del.status}</span>
                            )}
                          </div>
                        ) : (
                          <select 
                            value={del.status} 
                            onChange={(e) => handleDeliverableStatusChange(activeContract.id, idx, e.target.value)}
                            className="bg-[#1A1A28] border border-[#2A2A42] rounded text-[#F0EDE8] text-[10px] px-2 py-1"
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Approved" disabled>Approved (Client locked)</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Drag & Drop File upload */}
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
                <span className="text-[9px] text-[#5C5878] font-mono uppercase">Artifact Delivery Repository</span>
                <div 
                  onClick={() => setUploadedFiles(p => [...p, { name: "Dashboard_Codes.zip", size: "4.8MB" }])}
                  className="border border-dashed border-[#2A2A42] hover:border-gold-500/50 rounded-lg p-5 text-center bg-[#12121A] mt-2 cursor-pointer transition-all"
                >
                  <Upload className="w-5 h-5 text-gold-500 mx-auto mb-1.5 animate-bounce" />
                  <span className="text-xs text-[#9B97B2]">Click to drop production files</span>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] bg-[#12121A] px-3 py-1.5 rounded border border-[#2A2A42] font-mono text-gold-500">
                        <span>{f.name}</span>
                        <span>{f.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Messaging Panel */}
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl flex flex-col justify-between h-72">
                <div className="overflow-y-auto space-y-2 border-b border-[#2A2A42] pb-3 flex-1 pr-1">
                  <div className="bg-[#12121A] p-2 rounded text-[10px] text-gold-500 font-mono italic">
                    Security Warning: All transaction discussions must stay inside TalentStage.
                  </div>
                  {activeContract.messages?.map((msg, i) => (
                    <div key={i} className={`p-2 rounded text-xs max-w-xs ${msg.sender === 'Me' ? 'bg-[#22223A] ml-auto text-right' : 'bg-[#12121A] text-left'}`}>
                      <span className="text-[9px] text-[#5C5878] font-mono block">{msg.sender}</span>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-3">
                  <input 
                    type="text" 
                    placeholder="Ask client to release locked milestone..."
                    value={chatText}
                    onChange={e => setChatText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs text-[#F0EDE8] focus:outline-none"
                  />
                  <button onClick={handleSendMessage} className="p-2 bg-gold-500 text-black rounded hover:scale-105 transition-all"><Send className="w-4 h-4" /></button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-64 bg-[#1A1A28] border border-[#2A2A42] rounded-xl flex items-center justify-center text-center">
              <div>
                <ShieldCheck className="w-8 h-8 text-[#5C5878] mx-auto mb-2" />
                <h3 className="text-sm font-serif text-[#F0EDE8]">No contract selected.</h3>
                <p className="text-xs text-[#9B97B2] mt-1">Select an active contract from the sidebar list to submit files.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 16. FREELANCER VIEW: MY PROFILE & EDIT
// ==========================================

function FreelancerProfileView({ state, dispatch, addToast }) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedVerifySkill, setSelectedVerifySkill] = useState("React");
  const [skillTest, setSkillTest] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // Quiz running state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Confetti triggering
  const [confettiActive, setConfettiActive] = useState(false);

  const [activeAudit, setActiveAudit] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const fl = state.currentUser;

  // AI Verify Skill (Feature #4)
  const generateSkillTest = async () => {
    setTestLoading(true);
    setSkillTest(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizFinished(false);
    addToast(`Claude formulation engine writing 10-questions check for ${selectedVerifySkill}...`);

    try {
      let result;
      if (state.apiKey) {
        const sys = "You are a skill assessment quiz generator. Generate a 10-question test. 8 MCQs (options A,B,C,D) and 2 practicals. Return ONLY valid JSON: { \"questions\": [ { \"q\": \"...\", \"options\": [\"A\",\"B\",\"C\",\"D\"], \"answer\": \"A\", \"type\": \"mcq\" } ] }";
        result = await callClaudeAPI(sys, `Generate assessment for ${selectedVerifySkill}`, state.apiKey);
      } else {
        result = await simulateClaudeIntelligence('skill_test', { skill: selectedVerifySkill });
      }
      setSkillTest(result.questions);
      addToast("Quiz generated! Timer: 15 minutes.");
    } catch (e) {
      addToast(`Quiz creation failed: ${e.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  const submitQuiz = () => {
    let mcqCorrect = 0;
    let mcqTotal = 0;
    
    skillTest.forEach((q, idx) => {
      if (q.type === 'mcq') {
        mcqTotal++;
        if (answers[idx] === q.answer) {
          mcqCorrect++;
        }
      }
    });

    const pct = (mcqCorrect / mcqTotal) * 100;
    const passed = pct >= 70; // Pass threshold

    setQuizPassed(passed);
    setQuizFinished(true);

    if (passed) {
      dispatch({ type: 'ADD_VERIFIED_SKILL', payload: selectedVerifySkill });
      setConfettiActive(true);
      addToast(`Congratulations! You passed! Verified [${selectedVerifySkill}] badge unlocked!`);
      setTimeout(() => setConfettiActive(false), 5000);
    } else {
      addToast("Score below 70%. Retake quiz in 24 hours.");
    }
  };

  // AI Portfolio Auditor (Feature #3)
  const auditPortfolio = async () => {
    setAuditLoading(true);
    setActiveAudit(null);
    addToast("Claude is auditing your portfolio gallery items...");

    try {
      let result;
      if (state.apiKey) {
        const sys = "You are an elite portfolio auditor. Return ONLY JSON: { \"overallScore\": 72, \"strengths\": [\"...\"], \"improvements\": [ { \"area\": \"...\", \"issue\": \"...\", \"suggestion\": \"...\", \"priority\": \"high\" } ], \"missingElements\": [\"...\"] }";
        result = await callClaudeAPI(sys, `Audit this portfolio data: ${JSON.stringify(fl.portfolio)}`, state.apiKey);
      } else {
        result = await simulateClaudeIntelligence('portfolio_review', { portfolio: fl.portfolio });
      }
      setActiveAudit(result);
      addToast("Portfolio review generated! Check score ring.");
    } catch (e) {
      addToast(`Audit failed: ${e.message}`);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <ConfettiEffect active={confettiActive} />

      {/* Hero Section */}
      <div className="bg-[#1A1A28] border border-[#2A2A42] rounded-xl overflow-hidden shadow-xl">
        <div className="h-32 bg-gradient-to-r from-gold-600/30 to-[#22223A]" />
        
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 -mt-16">
            <div className="flex items-end gap-4">
              <img src={fl.avatar} alt="" className="w-24 h-24 rounded-full border-4 border-[#1A1A28] shadow-lg object-cover" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif">{fl.name}</h2>
                  {fl.verified && <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />}
                </div>
                <p className="text-xs text-gold-500 font-mono">{fl.specialty}</p>
                <p className="text-[10px] text-[#5C5878] font-mono mt-1">Location: {fl.location} • Member since {fl.memberSince}</p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button 
                onClick={() => setShowVerifyModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-gold-500 text-xs font-semibold rounded-lg transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Verify a Skill</span>
              </button>

              <button 
                onClick={auditPortfolio}
                disabled={auditLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{auditLoading ? "Auditing..." : "AI Portfolio Audit"}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-t border-[#2A2A42] pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[#12121A] p-3 rounded-lg border border-[#2A2A42]">
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Hourly Rate</span>
              <span className="block text-md font-bold text-gold-500 font-mono mt-1">${fl.hourlyRate}/hr</span>
            </div>
            <div className="bg-[#12121A] p-3 rounded-lg border border-[#2A2A42]">
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Verified Badges</span>
              <span className="block text-md font-bold text-[#F0EDE8] mt-1">{fl.verifiedSkills?.length || 0} Badges</span>
            </div>
            <div className="bg-[#12121A] p-3 rounded-lg border border-[#2A2A42]">
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Showcase Items</span>
              <span className="block text-md font-bold text-[#F0EDE8] mt-1">{fl.portfolio?.length || 0} Projects</span>
            </div>
            <div className="bg-[#12121A] p-3 rounded-lg border border-[#2A2A42]">
              <span className="text-[10px] font-mono text-[#5C5878] uppercase">Availability Status</span>
              <span className="block text-xs font-bold text-emerald-400 mt-2 font-mono uppercase">{fl.availability}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-mono text-[#5C5878] uppercase border-b border-[#2A2A42] pb-1">Professional Bio</h4>
            <p className="text-xs text-[#9B97B2] leading-relaxed mt-2">{fl.bio}</p>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-mono text-[#5C5878] uppercase border-b border-[#2A2A42] pb-1">Claimed Skill Badges</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {fl.skills?.map(s => {
                const verified = fl.verifiedSkills?.includes(s);
                return (
                  <span 
                    key={s} 
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-sans border ${verified ? 'bg-gold-500/10 text-gold-500 border-gold-500/30 font-semibold' : 'bg-[#12121A] text-[#9B97B2] border-[#2A2A42]'}`}
                  >
                    <span>{s}</span>
                    {verified && <Check className="w-3.5 h-3.5 text-gold-500" />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Portfolio Auditor Report */}
      {activeAudit && (
        <div className="bg-[#1A1A28] border border-gold-500/20 p-6 rounded-xl space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-[#2A2A42] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h3 className="text-md font-serif font-bold text-[#F0EDE8]">Claude Portfolio Audit Report</h3>
            </div>
            
            <div className="bg-gold-500/20 border border-gold-500/30 text-gold-500 px-3 py-0.5 rounded-full font-mono text-xs font-bold">
              Score: {activeAudit.overallScore}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#5C5878] uppercase block">Areas for Action ({activeAudit.improvements?.length})</span>
              <div className="space-y-2">
                {activeAudit.improvements?.map((imp, idx) => (
                  <div key={idx} className="p-3 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-gold-500">{imp.area}</span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${imp.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-gold-500/10 text-gold-500'}`}>{imp.priority}</span>
                    </div>
                    <p className="text-[#9B97B2] leading-normal">{imp.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#5C5878] uppercase block">Key Strengths</span>
                <ul className="list-disc pl-4 text-xs text-emerald-400 mt-2 space-y-1">
                  {activeAudit.strengths?.map((str, idx) => <li key={idx}>{str}</li>)}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#5C5878] uppercase block">Missing Key Metrics</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeAudit.missingElements?.map(m => (
                    <span key={m} className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-400 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Verify Quiz Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-6 rounded-xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
              <h3 className="text-md font-serif font-bold text-gold-500">Fast Credential Quiz</h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
            </div>

            {!skillTest && !testLoading && (
              <div className="space-y-4">
                <p className="text-xs text-[#9B97B2] leading-normal">
                  Claiming verified credentials allows AI matcher modules to double your index weight values. Pick from your active skill claims list below to begin test.
                </p>
                <div>
                  <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Select claim skill</label>
                  <select 
                    value={selectedVerifySkill} 
                    onChange={e => setSelectedVerifySkill(e.target.value)}
                    className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-[#F0EDE8] text-xs"
                  >
                    {fl.skills?.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button 
                  onClick={generateSkillTest} 
                  className="w-full py-2 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-[1.02]"
                >
                  Generate Test Package
                </button>
              </div>
            )}

            {testLoading && (
              <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                <Sparkles className="w-8 h-8 text-gold-500 animate-bounce" />
                <span className="text-xs text-[#9B97B2]">Claude Formulation Engine formulating MCQ models...</span>
              </div>
            )}

            {skillTest && !quizFinished && (
              <div className="space-y-4">
                {/* Progress timer bar */}
                <div className="w-full bg-[#12121A] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gold-500 h-full animate-pulse" style={{ width: `${((currentQuestionIndex + 1) / skillTest.length) * 100}%` }} />
                </div>

                <div className="text-xs font-mono text-[#5C5878] flex justify-between">
                  <span>Question {currentQuestionIndex + 1} of {skillTest.length}</span>
                  <span className="text-gold-500 font-bold">14m 58s remaining</span>
                </div>

                <div className="bg-[#12121A] border border-[#2A2A42] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold leading-relaxed text-[#F0EDE8]">{skillTest[currentQuestionIndex].q}</h4>
                </div>

                {/* Question Renderers */}
                {skillTest[currentQuestionIndex].type === 'mcq' ? (
                  <div className="space-y-2">
                    {skillTest[currentQuestionIndex].options.map((opt, oIdx) => {
                      const label = ['A', 'B', 'C', 'D'][oIdx];
                      const selected = answers[currentQuestionIndex] === label;
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestionIndex]: label }))}
                          className={`w-full p-3 text-left rounded-lg text-xs border transition-all ${selected ? 'border-gold-500 bg-[#22223A]' : 'border-[#2A2A42] bg-[#12121A] hover:border-gold-500/20'}`}
                        >
                          <span className="font-mono text-gold-500 font-bold mr-2">{label}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <textarea 
                      value={answers[currentQuestionIndex] || ""}
                      onChange={e => setAnswers(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                      className="w-full h-24 p-3 bg-[#12121A] border border-[#2A2A42] rounded text-xs text-[#F0EDE8] resize-none"
                      placeholder="Write your explanation code outlines here..."
                    />
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button 
                    onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-1 bg-transparent text-xs text-[#9B97B2] disabled:opacity-30"
                  >
                    Back
                  </button>

                  {currentQuestionIndex < skillTest.length - 1 ? (
                    <button 
                      onClick={() => setCurrentQuestionIndex(p => p + 1)}
                      className="px-4 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500/50 text-xs rounded"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button 
                      onClick={submitQuiz}
                      className="px-5 py-1.5 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 transition-all"
                    >
                      Submit Exam Paper
                    </button>
                  )}
                </div>
              </div>
            )}

            {quizFinished && (
              <div className="text-center space-y-4 py-6">
                {quizPassed ? (
                  <>
                    <Award className="w-12 h-12 text-gold-500 mx-auto animate-bounce" />
                    <h4 className="text-lg font-serif font-bold text-gold-500">Exam Passed! (70%+)</h4>
                    <p className="text-xs text-[#9B97B2] max-w-sm mx-auto leading-normal">
                      Excellent demonstration of skills credentials. A gold checkmark verification badge has been successfully added to your profile!
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                    <h4 className="text-lg font-serif font-bold text-red-400">Score Below Threshold</h4>
                    <p className="text-xs text-[#9B97B2] max-w-sm mx-auto leading-normal">
                      We scored MCQ answers below the 70% bounds. Please review resources materials and re-apply in 24 hours.
                    </p>
                  </>
                )}
                <button 
                  onClick={() => {
                    setShowVerifyModal(false);
                    setSkillTest(null);
                  }}
                  className="px-6 py-2 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-xs rounded-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 17. FREELANCER VIEW: EARNINGS TRACKER
// ==========================================

function EarningsView({ state, dispatch, addToast }) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");

  const handleWithdraw = () => {
    if (!withdrawAmt || Number(withdrawAmt) <= 0) {
      addToast("Please input valid withdrawal amount.");
      return;
    }
    addToast("Funds withdrawal request submitted to banks routing pipelines!");
    setShowWithdrawModal(false);
    setWithdrawAmt("");
  };

  // Recharts Seed Maps
  const earningsHistoryData = [
    { name: "Dec", amount: 4200 },
    { name: "Jan", amount: 3800 },
    { name: "Feb", amount: 5400 },
    { name: "Mar", amount: 6800 },
    { name: "Apr", amount: 8200 },
    { name: "May", amount: 9600 }
  ];

  const categoryShareData = [
    { name: "Web Dev", value: 54000, color: "#F5C842" },
    { name: "Design", value: 32000, color: "#C9A227" },
    { name: "Videos", value: 18000, color: "#4ADE80" },
    { name: "Writing", value: 12500, color: "#FB923C" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      
      {/* Earnings Dashboard summaries */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase">Gross Wallet Balance</span>
          <span className="block text-2xl font-bold font-serif text-gold-500 mt-1">$4,850</span>
        </div>
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase">Total Life Earnings</span>
          <span className="block text-2xl font-bold font-serif text-[#F0EDE8] mt-1">$116,500</span>
        </div>
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase">Pending Escrow Funds</span>
          <span className="block text-2xl font-bold font-serif text-amber-500 mt-1">$1,800</span>
        </div>
        <div className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase">Funds Withdrawal</span>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="mt-2 w-full py-1.5 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-105 transition-all"
          >
            Withdraw Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart: Earnings last 6 months */}
        <div className="lg:col-span-2 bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase mb-4 block">Earnings Progression</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsHistoryData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5C842" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F5C842" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E30" />
                <XAxis dataKey="name" stroke="#9B97B2" fontSize={11} />
                <YAxis stroke="#9B97B2" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#1A1A28", borderColor: "#2A2A42" }} />
                <Area type="monotone" dataKey="amount" stroke="#F5C842" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Earnings share by category */}
        <div className="lg:col-span-1 bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-[#5C5878] uppercase mb-2 block">Specialization Share</span>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryShareData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {categoryShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-4 border-t border-[#2A2A42] pt-3">
            {categoryShareData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="truncate text-[#9B97B2]">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Transaction Table */}
      <div className="bg-[#1A1A28] border border-[#2A2A42] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A2A42] flex justify-between items-center bg-[#12121A]">
          <h4 className="text-sm font-serif font-bold text-gold-500">Vault Transactions Logs</h4>
        </div>
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12121A] text-[#5C5878] font-mono border-b border-[#2A2A42] uppercase text-[10px]">
                <th className="p-4">Date</th>
                <th className="p-4">Project Brief</th>
                <th className="p-4">Client</th>
                <th className="p-4">Gross Amt</th>
                <th className="p-4">Platform Fee</th>
                <th className="p-4 text-right">Net Credited</th>
              </tr>
            </thead>
            <tbody>
              {state.transactions.map(t => (
                <tr key={t.id} className="border-b border-[#2A2A42]/50 hover:bg-[#22223A]/10">
                  <td className="p-4 font-mono text-[#5C5878]">{t.date}</td>
                  <td className="p-4 font-semibold text-[#F0EDE8]">{t.project}</td>
                  <td className="p-4 text-[#9B97B2]">{t.client}</td>
                  <td className="p-4 font-mono">${t.gross}</td>
                  <td className="p-4 font-mono text-[#5C5878]">${t.commission}</td>
                  <td className={`p-4 font-mono text-right font-bold ${t.net > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${t.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl max-w-sm w-full space-y-4">
            <h4 className="text-sm font-semibold text-gold-500">Withdraw Funds to Chase Bank</h4>
            <p className="text-xs text-[#9B97B2]">Masked bank route: ****5628</p>
            <div>
              <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Amount ($ USD)</label>
              <input 
                type="number" 
                value={withdrawAmt}
                onChange={e => setWithdrawAmt(e.target.value)}
                className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-xs text-[#F0EDE8]"
                placeholder="2000"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowWithdrawModal(false)} className="px-3 py-1 text-xs">Cancel</button>
              <button onClick={handleWithdraw} className="px-4 py-1 bg-gold-500 text-black text-xs font-semibold rounded">Confirm Withdrawal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 18. SHAREABLE COMMUNITIES VIEWS (FEED)
// ==========================================

function CommunityFeedView({ state, dispatch, addToast }) {
  const [newPostText, setNewPostText] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const submitPost = async () => {
    if (!newPostText) return;
    try {
      const newPost = await apiFetch('/api/community/feed', {
        method: 'POST',
        body: JSON.stringify({ content: newPostText, category: 'Wins' })
      });
      dispatch({ type: 'ADD_FEED_POST', payload: newPost });
      addToast("Post shared with communities developers!");
      setNewPostText("");
    } catch (error) {
      addToast(`Failed to share post: ${error.message}`);
    }
  };

  const filteredPosts = activeCat === 'All' 
    ? state.feedPosts 
    : state.feedPosts.filter(p => p.category === activeCat);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* Post Composer */}
      <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl space-y-3">
        <textarea 
          value={newPostText}
          onChange={e => setNewPostText(e.target.value)}
          className="w-full h-20 p-3 bg-[#12121A] border border-[#2A2A42] rounded-lg text-xs text-[#F0EDE8] resize-none focus:outline-none focus:border-gold-500"
          placeholder="Share developer tips, wins, or tool directories..."
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-[#5C5878]">Markdown elements supported.</span>
          <button 
            onClick={submitPost}
            className="px-5 py-1.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all"
          >
            Share Broadcast
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 border-b border-[#2A2A42] pb-3 text-xs">
        {["All", "Tips", "Wins", "Resources"].map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCat(cat)}
            className={`px-3 py-1 rounded-full transition-all ${activeCat === cat ? 'bg-gold-500 text-black font-semibold' : 'text-[#9B97B2] hover:text-[#F0EDE8]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed post cards */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <img src={post.avatar} alt="" className="w-8 h-8 rounded-full" />
              <div>
                <h4 className="text-xs font-bold text-[#F0EDE8]">{post.author}</h4>
                <span className="text-[9px] text-[#5C5878] font-mono">{post.time}</span>
              </div>
              <span className="ml-auto text-[9px] bg-gold-500/10 text-gold-500 border border-gold-500/30 px-2 py-0.5 rounded uppercase font-mono font-bold">
                {post.category}
              </span>
            </div>

            <p className="text-xs text-[#9B97B2] leading-relaxed">{post.content}</p>

            <div className="flex gap-4 pt-2 border-t border-[#2A2A42]/50 text-xs text-[#5C5878] font-mono">
              <button 
                onClick={() => dispatch({ type: 'LIKE_FEED_POST', payload: post.id })}
                className={`flex items-center gap-1 hover:text-gold-500 ${post.liked ? 'text-gold-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-gold-500 text-gold-500' : ''}`} />
                <span>{post.likes} Likes</span>
              </button>
              <button className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comments} Comments</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 19. SKILL CHALLENGES VIEW
// ==========================================

function SkillChallengesView({ state, dispatch, addToast }) {
  const [showSubModal, setShowSubModal] = useState(false);
  const [subUrl, setSubUrl] = useState("");

  const handleChallengeSubmit = () => {
    if (!subUrl) {
      addToast("Please input a valid URL to your sandbox/github project code.");
      return;
    }
    addToast("Challenge submission locked! Juries will audit codes.");
    setShowSubModal(false);
    setSubUrl("");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      
      {/* Banner card */}
      {state.challenges.filter(c => c.active).map(c => (
        <div key={c.id} className="bg-[#1A1A28] border border-gold-500/20 p-6 rounded-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="space-y-3 relative">
            <span className="px-3 py-1 bg-gold-500/20 text-gold-500 border border-gold-500/30 text-xs rounded-full uppercase font-mono font-semibold animate-pulse">Weekly Core Hack</span>
            <h3 className="text-2xl font-serif font-bold text-[#F0EDE8]">{c.title}</h3>
            <p className="text-xs text-[#9B97B2] max-w-lg leading-relaxed">{c.description}</p>
            <div className="flex gap-4 text-xs font-mono text-[#5C5878] pt-2">
              <span>Prize pool: <span className="text-gold-500 font-bold">{c.prize}</span></span>
              <span>•</span>
              <span>Deadline: <span className="text-red-400">{c.deadline}</span></span>
            </div>
          </div>

          <button 
            onClick={() => setShowSubModal(true)}
            className="px-6 py-2.5 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all shrink-0 relative"
          >
            Submit Hack Entry
          </button>
        </div>
      ))}

      {/* Past winner cards */}
      <h3 className="text-sm font-mono text-[#5C5878] uppercase border-b border-[#2A2A42] pb-1">Past Challenge Legends</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.challenges.filter(c => !c.active).map(c => (
          <div key={c.id} className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl flex flex-col justify-between gap-4">
            <div>
              <span className="text-[9px] bg-[#12121A] text-gold-500 border border-[#2A2A42] px-2 py-0.5 rounded uppercase font-mono">Archived Hack</span>
              <h4 className="text-xs font-bold font-serif text-[#F0EDE8] mt-2">{c.title}</h4>
              <p className="text-[11px] text-[#9B97B2] leading-normal mt-1">{c.description}</p>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t border-[#2A2A42] text-[10px] font-mono">
              <Award className="w-4 h-4 text-gold-500" />
              <span>Jury Pick Winner: <span className="text-gold-500 font-bold">{c.winner}</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Entry submission modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl max-w-sm w-full space-y-4">
            <h4 className="text-sm font-semibold text-gold-500">Submit Your Hack Code</h4>
            <p className="text-xs text-[#9B97B2]">Provide repository URL or deployment sandbox previews.</p>
            <div>
              <label className="block text-[#9B97B2] mb-1 font-mono uppercase text-[10px]">Sandbox / Git link</label>
              <input 
                type="url" 
                value={subUrl}
                onChange={e => setSubUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#12121A] border border-[#2A2A42] rounded text-xs text-[#F0EDE8]"
                placeholder="https://github.com/my-submission"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowSubModal(false)} className="px-3 py-1 text-xs">Cancel</button>
              <button onClick={handleChallengeSubmit} className="px-4 py-1 bg-gold-500 text-black text-xs font-semibold rounded">File Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 20. MENTORSHIP MATCHING VIEW
// ==========================================

function MentorshipView({ addToast }) {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h3 className="text-lg font-serif font-semibold text-[#F0EDE8] border-b border-[#2A2A42] pb-2">Elite System Product & Tech Coaches</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_MENTORS.map(m => (
          <div key={m.id} className="bg-[#1A1A28] border border-[#2A2A42] p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={m.avatar} alt="" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="text-xs font-bold text-[#F0EDE8] font-serif">{m.name}</h4>
                <p className="text-[11px] text-[#9B97B2] leading-tight mt-0.5">{m.specialty}</p>
                <span className="text-[10px] text-gold-500 font-mono mt-1 block">Session Cost: {m.rate}</span>
              </div>
            </div>

            <button 
              onClick={() => addToast(`Session scheduled with coach ${m.name}! Link sent to mail inbox.`)}
              className="px-3 py-1.5 bg-[#22223A] border border-[#2A2A42] hover:border-gold-500 text-gold-500 text-xs font-semibold rounded hover:scale-105 transition-all"
            >
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 21. API KEY CONTROL DRAWER (SETTINGS)
// ==========================================

function ApiKeyDrawer({ isOpen, onClose, apiKey, setApiKey, addToast }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#0A0A0F]/80 backdrop-glass z-50 flex justify-end">
      <div className="bg-[#12121A] border-l border-[#2A2A42] w-80 p-6 flex flex-col justify-between h-full animate-slide-left">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#2A2A42] pb-2">
            <h3 className="text-md font-serif font-bold text-[#F0EDE8]">AI Orchestration Setup</h3>
            <button onClick={onClose} className="text-[#9B97B2] hover:text-[#F0EDE8]"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-[#9B97B2] leading-normal">
              We execute real direct API triggers utilizing `claude-sonnet-4-20250514` model definitions. Provide your Anthropic credentials below.
            </p>

            <div className="bg-[#1A1A28] border border-gold-500/20 p-3 rounded-lg text-[10px] text-gold-500 font-mono leading-normal">
              Note: If no API key is provided, the environment automatically activates high-fidelity local sandbox simulations so everything remains functional.
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9B97B2] uppercase mb-1.5">Anthropic API Key</label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={e => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A28] border border-[#2A2A42] rounded text-xs text-[#F0EDE8] font-mono focus:outline-none focus:border-gold-500" 
                placeholder="sk-ant-v1-..."
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            addToast("API keys mapping updated in in-memory state.");
            onClose();
          }}
          className="w-full py-2 bg-gold-500 text-black text-xs font-semibold rounded hover:scale-[1.02] transition-all"
        >
          Confirm Credentials
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 22. ROOT RENDER COMPONENT
// ==========================================

async function fetchAllDatabaseContent(dispatch) {
  try {
    const freelancers = await apiFetch('/api/auth/freelancers');
    const projects = await apiFetch('/api/projects');
    const feedPosts = await apiFetch('/api/community/feed');
    const challenges = await apiFetch('/api/community/challenges');
    const transactions = await apiFetch('/api/contracts/transactions');
    const contracts = await apiFetch('/api/contracts');
    const proposals = await apiFetch('/api/projects/my/proposals');
    
    dispatch({
      type: 'INIT_DATA',
      payload: { freelancers, projects, feedPosts, challenges, transactions, contracts, proposals }
    });
  } catch (error) {
    console.error('Error fetching database contents:', error);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialReducerState);
  
  // Toast notifications state
  const [toasts, setToasts] = useState([]);
  
  // UI Panels toggling
  const [apiDrawerOpen, setApiDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await apiFetch('/api/auth/profile');
          dispatch({ type: 'INIT_AUTH', payload: { user, token } });
          await fetchAllDatabaseContent(dispatch);
          dispatch({ type: 'SET_VIEW', payload: 'home-dashboard' });
        } catch (error) {
          console.error('Initialization error:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'SET_VIEW', payload: 'onboarding' });
        }
      } else {
        dispatch({ type: 'SET_VIEW', payload: 'onboarding' });
      }
    };
    initApp();
  }, []);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message: msg }]);
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  const setView = (v) => dispatch({ type: 'SET_VIEW', payload: v });
  const setApiKey = (k) => dispatch({ type: 'SET_API_KEY', payload: k });

  // Map view strings into page-level views
  const renderViewContent = () => {
    switch (state.activeView) {
      case 'onboarding':
        return <OnboardingScreen dispatch={dispatch} addToast={addToast} />;
      case 'home-dashboard':
        return (
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-[#1A1A28] border border-[#2A2A42] p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
              <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-[10px] font-mono rounded uppercase">Welcome dashboard</span>
              <h2 className="text-3xl font-serif text-[#F0EDE8] font-bold mt-3">Welcome back, {state.currentUser.name}!</h2>
              <p className="text-xs text-[#9B97B2] max-w-lg mt-2 leading-relaxed">
                Your credentials are live on vector lists indexes. Check matching dashboards, verify more skill badges, or publish scoping audits.
              </p>
              
              <div className="flex gap-3 mt-6 relative z-10">
                <button onClick={() => setView('fl-profile')} className="px-4 py-2 bg-gold-500 text-black text-xs font-semibold rounded-lg hover:scale-105 transition-all">My Profile</button>
                <button onClick={() => setView('cl-post-project')} className="px-4 py-2 bg-[#22223A] border border-[#2A2A42] text-[#F0EDE8] text-xs font-semibold rounded-lg hover:border-gold-500/50">Post brief</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
                <h3 className="text-sm font-serif font-bold text-gold-500 mb-2">My verified badges</h3>
                <div className="flex flex-wrap gap-1.5">
                  {state.currentUser.verifiedSkills?.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-gold-500/10 text-gold-500 border border-gold-500/30 text-[10px] font-mono rounded-full flex items-center gap-1">
                      <span>{s}</span>
                      <Check className="w-3 h-3 text-gold-500" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#1A1A28] border border-[#2A2A42] p-5 rounded-xl">
                <h3 className="text-sm font-serif font-bold text-gold-500 mb-2">Active Notifications</h3>
                {state.notifications.map(n => (
                  <div key={n.id} className="text-xs text-[#9B97B2] leading-normal flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>{n.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'fl-profile':
        return <FreelancerProfileView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-portfolio':
        return <PortfolioGalleryView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-browse-projects':
        return <BrowseProjectsView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-my-proposals':
        return <MyProposalsView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-contracts':
        return <ContractsView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-earnings':
        return <EarningsView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'cl-post-project':
        return <PostProjectView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'cl-my-projects':
        return <ManageAuditsView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'cl-saved':
        return <SavedFreelancersView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-community':
        return <CommunityFeedView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-challenges':
        return <SkillChallengesView state={state} dispatch={dispatch} addToast={addToast} />;
      case 'fl-mentorship':
        return <MentorshipView addToast={addToast} />;
      default:
        return <div>Not found</div>;
    }
  };

  // If onboarding view, we skip standard layouts sidebar
  if (state.activeView === 'onboarding') {
    return (
      <TalentStageContext.Provider value={{ state, dispatch }}>
        <div className="min-h-screen bg-[#0A0A0F] font-sans antialiased text-[#F0EDE8]">
          <OnboardingScreen dispatch={dispatch} addToast={addToast} />
          <Toaster toasts={toasts} removeToast={removeToast} />
        </div>
      </TalentStageContext.Provider>
    );
  }

  return (
    <TalentStageContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-[#0A0A0F] font-sans antialiased text-[#F0EDE8] flex">
        {/* Left navigation sidebar */}
        <LeftSidebar currentUser={state.currentUser} activeView={state.activeView} setView={setView} dispatch={dispatch} />
        
        {/* Main core window */}
        <div className="flex-1 flex flex-col min-w-0">
          <HeaderBar 
            title={state.activeView.replace('fl-', 'Freelancer: ').replace('cl-', 'Client: ').toUpperCase().replace('-', ' ')}
            unreadCount={state.notifications.filter(n => n.unread).length}
            toggleApiDrawer={() => setApiDrawerOpen(true)}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
            dispatch={dispatch}
          />
          
          <main className="flex-1 overflow-y-auto pb-10">
            {renderViewContent()}
          </main>
        </div>

        {/* API Settings config drawer */}
        <ApiKeyDrawer 
          isOpen={apiDrawerOpen} 
          onClose={() => setApiDrawerOpen(false)} 
          apiKey={state.apiKey}
          setApiKey={setApiKey}
          addToast={addToast}
        />

        {/* Floating toast reports */}
        <Toaster toasts={toasts} removeToast={removeToast} />
      </div>
    </TalentStageContext.Provider>
  );
}
