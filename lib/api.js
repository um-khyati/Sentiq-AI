/**
 * Centralized API client for the SentiqAI backend.
 *
 * All pages import from here instead of calling `fetch` directly, so the
 * base URL and error handling only need to live in one place.
 *
 * Points at localhost during development via NEXT_PUBLIC_API_URL — see
 * .env.local.example at the project root.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Low-level request helper. Throws an Error with a useful message when
 * the backend responds with a non-2xx status, so callers can catch it
 * and show it in a toast / inline error state.
 */
async function request(path, { method = "GET", body, headers = {} } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // fetch itself threw — almost always means the backend isn't running
    throw new Error(
      "Could not reach the SentiqAI API. Make sure the backend server is running on " +
        API_BASE_URL
    );
  }

  // Some endpoints (e.g. DELETE) may return no body
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/** Review endpoints */
export const reviewsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reviews${query ? `?${query}` : ""}`);
  },
  getById: (id) => request(`/reviews/${id}`),
  create: (payload) => request("/reviews", { method: "POST", body: payload }),
  update: (id, payload) => request(`/reviews/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/reviews/${id}`, { method: "DELETE" }),
  search: (q) => request(`/reviews/search?q=${encodeURIComponent(q)}`),
  stats: () => request("/reviews/stats"),
};

/** Auth endpoints */
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
};

/** Small helpers for persisting the logged-in user/token client-side */
export const authStorage = {
  save: ({ token, user }) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sentiqai_token", token);
    window.localStorage.setItem("sentiqai_user", JSON.stringify(user));
  },
  clear: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("sentiqai_token");
    window.localStorage.removeItem("sentiqai_user");
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("sentiqai_user");
    return raw ? JSON.parse(raw) : null;
  },
};
