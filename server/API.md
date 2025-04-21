# API Documentation

## Health Check

### GET /health

Description: Check service health.
Response: 200 OK, JSON `{ status: 'ok' }`.

## Authentication

- All endpoints (except GET /health) require a valid JWT in the Authorization header.

## Posts

### GET /api/posts

Description: List all posts (sorted by most recent first).
Response: 200 OK, JSON array of post objects.

### GET /api/posts/feed

Description: List the authenticated user's feed, including posts from their connections and posts those connections have commented on.
Response: 200 OK, JSON array of post objects.

### POST /api/posts

Description: Create a new post.
Request Body: `{ content: string, imageUrl?: string }`
Response: 201 Created, JSON of the created post.

## Users

### GET /api/users/:id

Description: Get details for a specific user.
Response: 200 OK, JSON of user object or 404 if not found.
User Object example:

```
{
  _id: string,
  name: string,
  title: string,
  avatarUrl: string,
  bio?: string,
  createdAt: string,
  updatedAt: string
}
```

### GET /api/users/:id/connections

Description: List connections for a specific user.
Response: 200 OK, JSON array of user objects.

### GET /api/users/:id/posts

Description: List posts created by a specific user (sorted by most recent first).
Query Params: `page` (number), `limit` (number)
Response: 200 OK, JSON array of post objects.

## User Management

### POST /api/users

Description: Create or update a user record after Auth0 login (upsert by `sub`).
Request Body: `{ sub: string, name: string, title?: string, avatarUrl?: string, bio?: string }`
Response: 201 Created, JSON of the user object.

### GET /api/users/me

Description: Get the profile for the currently authenticated user (upsert if not exists).
Response: 200 OK, JSON of the user object.

## Connections

### GET /api/connections

Description: List connections for the currently authenticated user.
Response: 200 OK, JSON array of user objects.

### POST /api/connections

Description: Create a new connection from the current user to another.
Request Body: `{ "to": string }`
Response: 201 Created, JSON of the created connection document.
Connection Object example:

```
{
  _id: string,
  from: string,
  to: string,
  status: 'pending' | 'connected',
  createdAt: string,
  updatedAt: string
}
```

### GET /api/connections/pending

Description: List pending connection requests for the current user.
Response: 200 OK, JSON array of connection objects.

### PATCH /api/connections/:id

Description: Accept or reject a connection request.
Request Body: `{ status: 'pending' | 'connected' }`
Response: 200 OK, JSON of the updated connection object.

### GET /api/connections/suggestions

Description: List "People You May Know" suggestions for the authenticated user. Excludes current user and any existing or pending connections.
Query Params: `page` (number), `limit` (number)
Response: 200 OK, JSON array of user objects.

## Comments

### GET /api/posts/:postId/comments

Description: List comments under a specific post.
Response: 200 OK, JSON array of comment objects.

### POST /api/posts/:postId/comments

Description: Add a comment to a specific post.
Request Body: `{ content: string }`
Response: 201 Created, JSON of the created comment object.

Comment Object example:

```
{
  _id: string,
  post: string,
  author: string,
  content: string,
  createdAt: string,
  updatedAt: string
}
```

## Pagination

All list endpoints support optional pagination query parameters:

- `page` (number, default: 1) — the page of results to return (1‑indexed)
- `limit` (number, default: endpoint‑specific) — the maximum number of items per page

List endpoints include:

- GET /api/posts
- GET /api/posts/feed
- GET /api/posts/:postId/comments
- GET /api/users/:id/connections
- GET /api/connections
- GET /api/connections/pending

Example: `GET /api/posts?page=2&limit=10` returns posts 11–20.
