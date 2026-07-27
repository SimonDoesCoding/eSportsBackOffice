// Base API configuration and utilities
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "sitech-esports-2026";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Sitech-Api-Key": API_KEY,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  // Handle empty responses (e.g. 204 No Content or empty body)
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}
