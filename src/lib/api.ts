const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, payload?.message ?? "Request failed");
  }

  return payload as T;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "sender" | "viewer";
}

export interface CustomerPayload {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: "Male" | "Female" | "Other" | null;
  createdAt: string;
  updatedAt: string;
  emailOptIn: boolean;
}

export interface DeliveryPayload {
  id: string;
  campaignId: string;
  campaignRecipientId: string;
  customerId: string;
  provider: string;
  providerMessageId: string | null;
  status: "queued" | "accepted" | "delivered" | "bounced" | "complained" | "failed";
  errorCode: string | null;
  errorMessage: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(token: string) {
  return request<{ user: AuthUser }>("/auth/me", { token });
}

export async function listCustomers(token: string) {
  return request<{ customers: CustomerPayload[] }>("/customers", { token });
}

export async function createCustomer(token: string, customer: CustomerInput) {
  return request<{ customer: CustomerPayload }>("/customers", {
    method: "POST",
    token,
    body: JSON.stringify(customer),
  });
}

export async function updateCustomer(token: string, customerId: string, customer: CustomerInput) {
  return request<{ customer: CustomerPayload }>(`/customers/${customerId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(customer),
  });
}

export async function deleteCustomer(token: string, customerId: string) {
  return request<void>(`/customers/${customerId}`, {
    method: "DELETE",
    token,
  });
}

export async function bulkDeleteCustomers(token: string, ids: string[]) {
  return request<{ deletedCount: number }>("/customers/bulk-delete", {
    method: "POST",
    token,
    body: JSON.stringify({ ids }),
  });
}

export async function listDeliveries(token: string) {
  return request<{ deliveries: DeliveryPayload[] }>("/deliveries", { token });
}
