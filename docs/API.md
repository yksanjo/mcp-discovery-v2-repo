# MCP Discovery API Documentation

## Base URL

```
https://mcp-discovery-two.vercel.app
```

## Endpoints

### POST /api/v1/discover

Semantic search for MCP servers.

**Request Body:**

```json
{
  "need": "send slack notifications",
  "limit": 5,
  "category": "communication",
  "min_confidence": 0.5
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `need` | string | ✅ | Natural language description |
| `limit` | number | ❌ | Max results (1-50, default: 5) |
| `category` | string | ❌ | Filter by category |
| `min_confidence` | number | ❌ | Minimum confidence (0-1) |

**Response:**

```json
{
  "recommendations": [
    {
      "server": "slack-server",
      "name": "Slack MCP Server",
      "description": "Official Slack integration for MCP",
      "install_command": "npx -y @anthropic/mcp-server-slack",
      "confidence": 0.95,
      "category": "communication",
      "repository": "https://github.com/anthropics/servers",
      "source": "official"
    }
  ],
  "query_time_ms": 52,
  "total_found": 12
}
```

### GET /api/v1/categories

List all available categories.

**Response:**

```json
{
  "categories": [
    {
      "slug": "database",
      "name": "Database",
      "description": "Database integrations",
      "count": 2450
    }
  ]
}
```

### GET /api/v1/servers

Browse all servers.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `limit` | number | Max results |
| `offset` | number | Pagination offset |

### GET /api/v1/servers/:slug

Get details for a specific server.

**Example:** `/api/v1/servers/slack-server`

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "servers_indexed": 14000
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Invalid request",
  "message": "Limit must be between 1 and 50"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limiting

- Free tier: 100 requests/minute
- No authentication required

## SDKs

- **JavaScript/TypeScript:** `npm install @yksanjo/mcp-discovery`
- **Python:** `pip install mcp-discovery`
