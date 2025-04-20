// API client for communicating with the server
const API = import.meta.env.VITE_API_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

// Posts
export async function fetchPosts(token: string, page = 1, limit = 50) {
  const res = await fetch(`${API}/api/posts?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function fetchFeed(token: string, page = 1, limit = 50) {
  const res = await fetch(`${API}/api/posts/feed?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function createPost(
  token: string,
  payload: { content: string; imageUrl?: string }
) {
  const res = await fetch(`${API}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Comments
export async function fetchComments(
  token: string,
  postId: string,
  page = 1,
  limit = 20
) {
  const res = await fetch(
    `${API}/api/posts/${postId}/comments?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

export async function addComment(
  token: string,
  postId: string,
  content: string
) {
  const res = await fetch(`${API}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  return handleResponse(res);
}

// Users
export async function fetchUser(token: string, id: string) {
  const res = await fetch(`${API}/api/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function fetchCurrentUser(token: string) {
  const res = await fetch(`${API}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function upsertUser(
  token: string,
  user: {
    sub: string;
    name: string;
    title?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
  }
) {
  const res = await fetch(`${API}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
}

// Connections
export async function fetchUserConnections(
  token: string,
  id: string,
  page = 1,
  limit = 50
) {
  const res = await fetch(
    `${API}/api/users/${id}/connections?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

export async function fetchConnections(token: string, page = 1, limit = 50) {
  const res = await fetch(
    `${API}/api/connections?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

export async function fetchPendingConnections(
  token: string,
  page = 1,
  limit = 50
) {
  const res = await fetch(
    `${API}/api/connections/pending?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

export async function createConnection(token: string, to: string) {
  const res = await fetch(`${API}/api/connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to }),
  });
  return handleResponse(res);
}

export async function updateConnection(
  token: string,
  id: string,
  status: "pending" | "connected"
) {
  const res = await fetch(`${API}/api/connections/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

/**
 * Reject (delete) a pending connection request by ID
 */
export async function deleteConnection(token: string, id: string) {
  const res = await fetch(`${API}/api/connections/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// Suggestions: fetch "People You May Know" for the current user
export async function fetchSuggestions(token: string, page = 1, limit = 10) {
  const res = await fetch(
    `${API}/api/connections/suggestions?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

// Fetch posts created by a specific user
export async function fetchUserPosts(
  token: string,
  userId: string,
  page = 1,
  limit = 50
) {
  const res = await fetch(
    `${API}/api/users/${userId}/posts?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}

// Likes
/**
 * Increment the like count for a post
 */
export async function likePost(token: string, postId: string) {
  const res = await fetch(`${API}/api/posts/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

/**
 * Decrement the like count for a post
 */
export async function unlikePost(token: string, postId: string) {
  const res = await fetch(`${API}/api/posts/${postId}/like`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

// Users search
/**
 * Search users by name or title
 */
export async function searchUsers(token: string, query: string) {
  const res = await fetch(
    `${API}/api/users/search?query=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(res);
}
