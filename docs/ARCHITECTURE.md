# MCP Discovery Architecture

## Overview

MCP Discovery V2 is a semantic search platform for Model Context Protocol (MCP) servers. It enables AI agents to discover tools dynamically using natural language queries.

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  API Layer  │────▶│  Database   │
│  (Agent)    │◀────│  (Next.js)  │◀────│  (Supabase) │
└─────────────┘     └─────────────┘     └──────┬──────┘
       │                                       │
       │                                       │
       │         ┌─────────────┐              │
       └────────▶│   OpenAI    │◀─────────────┘
                 │ Embeddings  │
                 └─────────────┘
```

## Components

### 1. Data Aggregation Layer

**Purpose:** Collect MCP server metadata from multiple sources

**Sources:**
- Glama.ai Registry (~10,000 servers)
- NPM Registry (~2,500 packages)
- GitHub Search (~800 repos)
- Awesome Lists (~1,500 listings)
- Official Anthropic Registry (~50 servers)

**Process:**
```
Source APIs → Normalization → Deduplication → Database
```

### 2. Embedding Pipeline

**Purpose:** Convert server metadata to searchable vectors

**Technology:**
- Model: OpenAI `text-embedding-ada-002`
- Vector dimension: 1536
- Batch size: 100

**Fields embedded:**
- Name
- Description
- Category
- Keywords/tags

### 3. Vector Database

**Purpose:** Store and search embeddings efficiently

**Technology:**
- PostgreSQL 15+
- pgvector extension
- HNSW index for approximate nearest neighbors

**Schema:**
```sql
CREATE TABLE mcp_servers (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  description TEXT,
  install_command TEXT,
  category TEXT,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMP
);

CREATE INDEX ON mcp_servers USING hnsw (embedding vector_cosine_ops);
```

### 4. API Layer

**Purpose:** Serve discovery requests

**Technology:**
- Next.js API Routes
- Edge functions (Vercel)
- ~50ms average response time

**Endpoints:**
- `POST /api/v1/discover` - Semantic search
- `GET /api/v1/categories` - List categories
- `GET /api/v1/servers` - Browse servers
- `GET /health` - Health check

### 5. Search Algorithm

**Query Flow:**

1. **Receive query:** "I need a database"
2. **Embed query:** Convert to 1536-dim vector via OpenAI
3. **Vector search:** `SELECT * FROM mcp_servers ORDER BY embedding <=> query_vector LIMIT 10`
4. **Post-process:** Filter by category, apply confidence threshold
5. **Return:** Ranked results with metadata

**Ranking Formula:**
```
score = cosine_similarity(query_vector, server_vector)
confidence = normalize(score, min_threshold=0.5, max=1.0)
```

## Data Flow

### Discovery Request

```
1. Client sends: POST /api/v1/discover
   Body: { "need": "slack notifications" }

2. API embeds query via OpenAI

3. Vector search in PostgreSQL
   Query time: ~20ms

4. Fetch full metadata for top matches

5. Return JSON response
   Total time: ~50ms
```

### Indexing New Servers

```
1. Scraper collects from source

2. Normalization (common schema)

3. Generate embedding

4. Insert/update in database

5. Update category counts
```

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Query latency | ~50ms (p95) |
| Index size | ~50MB (14k vectors) |
| Throughput | 1000+ req/min |
| Uptime | 99.9% |

## Scaling Strategy

### Current (14k servers)
- Single PostgreSQL instance (Supabase)
- Edge-cached API responses
- Sufficient for current load

### Future (100k+ servers)
- Read replicas for query load
- Connection pooling
- CDN caching for popular queries
- Sharding by category if needed

## Security Considerations

### Data Safety
- No user data stored
- Search queries logged (anonymized)
- Server metadata is public

### API Security
- Rate limiting per IP
- No authentication (public API)
- HTTPS only

### MCP Server Security
- We index, don't execute
- Users must verify before installing
- Security warnings in documentation

## Monitoring

### Metrics Tracked
- Query latency (p50, p95, p99)
- Search result quality (user feedback)
- API error rates
- Database performance

### Alerts
- API down
- High error rate (>1%)
- Slow queries (>200ms)

## Development

### Local Setup
```bash
git clone https://github.com/yksanjo/mcp-discovery-v2.git
cd mcp-discovery-v2
npm install
npm run dev
```

### Environment Variables
```
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

## Future Improvements

1. **Performance metrics** - Track server latency/uptime
2. **Auto-install** - One-click install for major clients
3. **Community ratings** - User reviews and ratings
4. **Multi-language** - Support for non-English queries
