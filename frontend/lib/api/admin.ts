/**
 * Admin API Client
 * Handles all admin analytics API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("campusor_jwt");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Type definitions matching backend responses
export interface DashboardSummary {
  activeTokens: number;
  servedToday: number;
  skippedTokens: number;
  totalTokensToday: number;
  peakHour: string;
}

export interface QueueLoad {
  time: string;
  activeTokens: number;
}

export interface TokensServed {
  hour: string;
  served: number;
}

export interface AvgWaitTime {
  queue: string;
  avgWaitMinutes: number;
}

export interface TokenStatusCount {
  status: string;
  count: number;
}

/**
 * Fetch dashboard summary with overview metrics
 */
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch queue load analytics (active tokens over time)
 */
export const fetchQueueLoadAnalytics = async (): Promise<QueueLoad[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/queue-load`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch queue load analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch tokens served per hour analytics
 */
export const fetchTokensServedAnalytics = async (): Promise<TokensServed[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/tokens-served`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tokens served analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch average wait time per queue analytics
 */
export const fetchAvgWaitTimeAnalytics = async (): Promise<AvgWaitTime[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/avg-wait-time`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wait time analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch token status distribution analytics
 */
export const fetchTokenStatusAnalytics = async (): Promise<TokenStatusCount[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/token-status`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch token status analytics: ${response.statusText}`);
  }

  return response.json();
};

export interface AdminUser {
  _id: string;
  email: string;
  emailVerified: boolean;
  createdByAdmin: {
    _id: string;
  } | null;
}

/**
 * Fetch all admin users
 */
export const fetchAdmins = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch admins: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Create a new admin (direct creation)
 */
export const createAdmin = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create admin");
  }

  return response.json();
};

/**
 * Fetch all queues for management
 */
export const fetchAllQueues = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/queues`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch queues");
  }

  return response.json();
};

/**
 * Delete a queue
 */
export const deleteQueue = async (queueId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/queues/${queueId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete queue");
  }

  return response.json();
};

/**
 * Fetch all operators for management
 */
export const fetchAllOperators = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/operators`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch operators");
  }

  return response.json();
};

/**
 * Reset operator password
 */
export const resetOperatorPassword = async (operatorId: string, newPassword: string) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/operators/${operatorId}/reset-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to reset password");
  }

  return response.json();
};


