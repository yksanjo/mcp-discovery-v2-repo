# MCP Discovery

<p align="center">
  <b>Semantic search for 14,000+ Model Context Protocol servers.</b><br>
  Your agents find the right tool in 50ms, not 10 minutes.
</p>

<p align="center">
  <a href="https://mcp-discovery-two.vercel.app">
    <img src="https://img.shields.io/badge/API-LIVE-brightgreen?style=flat-square" alt="API Status">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/servers-14,000%2B-blue?style=flat-square" alt="Servers Indexed">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/response-50ms-purple?style=flat-square" alt="Response Time">
  </a>
  <a href="https://github.com/yksanjo/mcp-discovery-v2">
    <img src="https://img.shields.io/github/stars/yksanjo/mcp-discovery-v2?style=flat-square" alt="GitHub Stars">
  </a>
</p>

<p align="center">
  <a href="https://mcp-discovery-two.vercel.app">Live API</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#documentation">Docs</a> •
  <a href="#integrations">Integrations</a>
</p>

---

## The Problem

AI agents are limited to pre-configured tools. When they need a new capability—database access, API integration, file processing—they can't discover what's available.

**Current workflow:**
```
Agent: "I need to send Slack notifications"
→ Human googles for 10 minutes
→ Finds 50 different MCP servers
→ Picks one arbitrarily
→ Configures it manually
→ Agent finally uses it
```

**With MCP Discovery:**
```
Agent: "I need to send Slack notifications"
→ API call (50ms)
→ Gets ranked servers with install commands
→ Auto-installs top match
→ Done
```

---

## Quick Start

### 1. Try the API (No Signup Required)

```bash
curl -X POST https://mcp-discovery-two.vercel.app/api/v1/discover \
  -H "Content-Type: application/json" \
  -d '{"need": "send slack notifications", "limit": 3}'
```

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
      "repository": "https://github.com/anthropics/servers"
    }
  ],
  "query_time_ms": 52,
  "total_found": 12
}
```

### 2. Browse All Servers

```bash
# List categories
curl https://mcp-discovery-two.vercel.app/api/v1/categories

# Browse by category
curl "https://mcp-discovery-two.vercel.app/api/v1/servers?category=database&limit=20"
```

### 3. Python Integration

```python
import requests

class AgentWithDiscovery:
    def __init__(self, api_url="https://mcp-discovery-two.vercel.app"):
        self.api_url = api_url
    
    def find_tool(self, need: str, limit: int = 3):
        """Find the right MCP server for any task."""
        response = requests.post(
            f"{self.api_url}/api/v1/discover",
            json={"need": need, "limit": limit}
        )
        return response.json()["recommendations"]

# Usage
agent = AgentWithDiscovery()
tools = agent.find_tool("I need a PostgreSQL database")
# Returns ready-to-install server with confidence score
```

### 4. JavaScript/TypeScript Integration

```typescript
async function discoverTool(need: string, limit = 3) {
  const response = await fetch('https://mcp-discovery-two.vercel.app/api/v1/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ need, limit })
  });
  return response.json();
}

// Your agent just got smarter
discoverTool("database for user preferences");
// Returns: ranked servers with install commands
```

---

## Documentation

### API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Check API status |
| `/api/v1/discover` | POST | Semantic search for servers |
| `/api/v1/servers` | GET | Browse all servers |
| `/api/v1/categories` | GET | List categories with counts |
| `/api/v1/servers/:slug` | GET | Get specific server details |

### Discovery Endpoint

```http
POST /api/v1/discover
Content-Type: application/json

{
  "need": "natural language description",
  "limit": 5,              // Optional: 1-20 results (default: 5)
  "category": "database"   // Optional: filter by category
}
```

**Parameters:**
- `need` (required): Natural language description of what you need
- `limit` (optional): Maximum results to return (1-20, default: 5)
- `category` (optional): Filter by category slug

### Categories

- `database` - PostgreSQL, SQLite, MongoDB, Redis, etc.
- `ai-ml` - LLM integrations, model serving
- `communication` - Slack, Discord, email
- `development` - Git, GitHub, code tools
- `cloud` - AWS, GCP, Azure
- `security` - Auth, encryption
- `monitoring` - Metrics, logging, observability
- `search` - Elasticsearch, semantic search
- `automation` - CI/CD, workflows
- And 12 more...

---

## Integrations

### LangChain

```python
from langchain.tools import tool
import requests

@tool
def discover_mcp_server(need: str) -> str:
    """Discover MCP servers for a given need."""
    response = requests.post(
        "https://mcp-discovery-two.vercel.app/api/v1/discover",
        json={"need": need, "limit": 3}
    )
    servers = response.json()["recommendations"]
    return f"Found {len(servers)} servers: " + ", ".join(
        f"{s['name']} ({s['install_command']})" for s in servers
    )

# Add to your agent's tools
agent = initialize_agent(tools=[discover_mcp_server, ...], ...)
```

### AutoGPT

MCP Discovery is available as a native block in AutoGPT:

1. Open AutoGPT web interface
2. Add **MCP Discovery** block from Search category
3. Connect your workflow
4. Agents discover tools dynamically

See: [autogpt-mcp-discovery](./autogpt-mcp-discovery)

### Custom MCP Client

```python
# Your MCP client can use discovery before tool execution
async def execute_with_discovery(agent_need: str):
    # 1. Discover the right server
    server = await discover_tool(agent_need)
    
    # 2. Install it
    await install_server(server["install_command"])
    
    # 3. Execute
    return await execute_tool(server["name"], agent_need)
```

---

## Data Sources

MCP Discovery aggregates from multiple sources for comprehensive coverage:

| Source | Servers | Last Updated |
|--------|---------|--------------|
| Glama.ai Registry | 10,000+ | Daily |
| NPM Registry | 2,500+ | Daily |
| GitHub Search | 800+ | Weekly |
| Awesome Lists | 1,500+ | Weekly |
| Official Anthropic Registry | 50+ | Real-time |
| **Total Unique** | **14,000+** | - |

*Note: Totals are after deduplication across sources.*

---

## Self-Hosting

```bash
# Clone the repository
git clone https://github.com/yksanjo/mcp-discovery-v2.git
cd mcp-discovery

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase & OpenAI credentials

# Deploy to Vercel
vercel --prod
```

**Requirements:**
- Supabase account (PostgreSQL + pgvector)
- OpenAI API key (for embeddings)
- Vercel account (for hosting)

---

## Why MCP Discovery?

| Feature | MCP Discovery | Static Directories | GitHub Search |
|---------|--------------|-------------------|---------------|
| Semantic search | ✅ | ❌ | ❌ |
| Install commands | ✅ | Partial | ❌ |
| Performance metrics | 🚧 Coming | ❌ | ❌ |
| Multi-source aggregation | ✅ | ❌ | ❌ |
| API access | ✅ | ❌ | ❌ |
| 14,000+ servers | ✅ | ❌ | ❌ |

---

## Roadmap

### Q1 2026
- [ ] Performance metrics (latency, uptime tracking)
- [ ] Auto-install endpoints for major clients
- [ ] Server verification badges
- [ ] Rate limiting & API keys

### Q2 2026
- [ ] 10,000+ servers indexed
- [ ] Community submission portal
- [ ] Server analytics dashboard
- [ ] Enterprise deployment options

### Q3 2026
- [ ] Real-time server health monitoring
- [ ] AI-powered server recommendations
- [ ] Multi-language support

---

## Contributing

We welcome contributions! Areas where help is needed:

- [ ] Additional MCP server sources
- [ ] Performance monitoring implementation
- [ ] Client integrations (Cursor, Windsurf, etc.)
- [ ] Documentation improvements
- [ ] Bug reports and feature requests

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

<p align="center">
  Built for the agentic web.<br>
  <a href="https://mcp-discovery-two.vercel.app">mcp-discovery-two.vercel.app</a>
</p>
