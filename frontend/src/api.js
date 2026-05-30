/**
 * TalentStage API Client
 * Handles all backend API calls with automatic JWT token management
 *
 * In local dev:  VITE_API_URL is not set → falls back to '/api' (proxied by Vite to localhost:5000)
 * On Render:     VITE_API_URL=https://talentstage-backend.onrender.com/api
 */

// Strip any trailing slash so we never get double-slashes in URLs
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/**
 * Helper function to make API requests with JWT token.
 * `endpoint` must start with '/', e.g. '/auth/login'
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Normalise endpoint: strip leading /api prefix if present (App.jsx uses /api/... paths)
  const cleanEndpoint = endpoint.startsWith('/api/')
    ? endpoint.slice(4)   // '/api/auth/login' → '/auth/login'
    : endpoint;           // '/auth/login'     → '/auth/login'

  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

export { apiFetch };

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export const authAPI = {
  // Register a new user
  register: async (name, email, password, role = 'both') => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
  },

  // Login user
  login: async (email, password) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Get current user profile
  getProfile: async () => {
    return apiFetch('/auth/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiFetch('/auth/profile/update', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Get all freelancers
  getFreelancers: async () => {
    return apiFetch('/auth/freelancers');
  },

  // Get single freelancer by ID
  getFreelancer: async (id) => {
    return apiFetch(`/auth/freelancers/${id}`);
  },

  // Update saved notes for a freelancer
  updateSavedNotes: async (freelancerId, note) => {
    return apiFetch(`/auth/freelancers/${freelancerId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ note })
    });
  },

  // Add portfolio item
  addPortfolioItem: async (portfolioData) => {
    return apiFetch('/auth/profile/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolioData)
    });
  }
};

// ==========================================
// PROJECTS ENDPOINTS
// ==========================================

export const projectsAPI = {
  // Get all projects (marketplace)
  getAllProjects: async () => {
    return apiFetch('/projects');
  },

  // Get user's posted projects
  getMyProjects: async () => {
    return apiFetch('/projects/my');
  },

  // Get project by ID
  getProject: async (id) => {
    return apiFetch(`/projects/${id}`);
  },

  // Post a new project
  createProject: async (projectData) => {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  // Submit a proposal (bid)
  submitProposal: async (projectId, proposalData) => {
    return apiFetch(`/projects/${projectId}/proposals`, {
      method: 'POST',
      body: JSON.stringify(proposalData)
    });
  },

  // Get all proposals for a project (client view)
  getProjectProposals: async (projectId) => {
    return apiFetch(`/projects/${projectId}/proposals`);
  },

  // Get user's submitted proposals (freelancer view)
  getMyProposals: async () => {
    return apiFetch('/projects/my/proposals');
  },

  // Update proposal status
  updateProposalStatus: async (proposalId, status) => {
    return apiFetch(`/projects/proposals/${proposalId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};

// ==========================================
// CONTRACTS ENDPOINTS
// ==========================================

export const contractsAPI = {
  // Get all contracts for current user
  getContracts: async () => {
    return apiFetch('/contracts');
  },

  // Create a contract (hire freelancer)
  createContract: async (contractData) => {
    return apiFetch('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData)
    });
  },

  // Update deliverable status
  updateDeliverable: async (contractId, index, status) => {
    return apiFetch(`/contracts/${contractId}/deliverables/${index}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Approve deliverable (release payment)
  approveDeliverable: async (contractId, index) => {
    return contractsAPI.updateDeliverable(contractId, index, 'Approved');
  },

  // Get transaction history
  getTransactions: async () => {
    return apiFetch('/contracts/transactions');
  }
};

// ==========================================
// COMMUNITY ENDPOINTS
// ==========================================

export const communityAPI = {
  // Get feed posts
  getFeed: async () => {
    return apiFetch('/community/feed');
  },

  // Create a feed post
  createPost: async (content, category = 'Wins') => {
    return apiFetch('/community/feed', {
      method: 'POST',
      body: JSON.stringify({ content, category })
    });
  },

  // Like/unlike a post
  toggleLike: async (postId) => {
    return apiFetch(`/community/feed/${postId}/like`, {
      method: 'POST'
    });
  },

  // Get active challenges
  getChallenges: async () => {
    return apiFetch('/community/challenges');
  },

  // Get mentorship list
  getMentors: async () => {
    return apiFetch('/community/mentors');
  }
};

// ==========================================
// AI ENDPOINTS
// ==========================================

export const aiAPI = {
  // AI Scoping Assistant
  getScope: async (vagueness) => {
    return apiFetch('/ai/scope', {
      method: 'POST',
      body: JSON.stringify({ vagueness })
    });
  },

  // AI Smart Matching
  getMatches: async (projectId) => {
    return apiFetch('/ai/match', {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
  },

  // AI Proposal Evaluation
  evaluateProposals: async (projectId) => {
    return apiFetch('/ai/evaluate', {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
  },

  // AI Portfolio Review
  reviewPortfolio: async () => {
    return apiFetch('/ai/portfolio-review', {
      method: 'POST'
    });
  },

  // AI Skill Test Generator
  generateSkillTest: async (skill) => {
    return apiFetch('/ai/skill-test', {
      method: 'POST',
      body: JSON.stringify({ skill })
    });
  }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isLoggedIn() {
  return !!getToken();
}
