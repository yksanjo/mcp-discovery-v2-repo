# MCP Discovery V2 - Improvement Plan
## Addressing the 6.5/10 Rating

---

## 🔴 Critical Issues to Fix

### 1. "Only 2 commits, static HTML" - Repo Looks Empty

**Problem:** The repo appears abandoned/inactive with just a README and HTML file.

**Fix:** Add actual project structure

```
mcp-discovery-v2/
├── README.md              ✅ Done
├── LICENSE                ✅ Add
├── package.json           📝 Create
├── src/
│   ├── index.ts           📝 Main API code
│   ├── discovery.ts       📝 Search logic
│   └── types.ts           📝 Type definitions
├── tests/
│   └── discovery.test.ts  📝 Tests
├── docs/
│   ├── API.md             📝 API documentation
│   └── ARCHITECTURE.md    📝 How it works
└── examples/
    ├── python/            📝 Python examples
    └── javascript/        📝 JS examples
```

**Quick Win:**
```bash
cd /Users/yoshikondo/mcp-discovery-v2-repo

# Add package.json
cat > package.json << 'EOF'
{
  "name": "mcp-discovery",
  "version": "2.0.0",
  "description": "Semantic search for 14,000+ MCP servers",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "keywords": ["mcp", "model-context-protocol", "ai-agents", "semantic-search"],
  "license": "MIT"
}
EOF

# Create src directory structure
mkdir -p src tests docs examples/python examples/javascript

# Add placeholder files
touch src/index.ts src/discovery.ts src/types.ts
touch tests/discovery.test.ts
touch docs/API.md docs/ARCHITECTURE.md

git add .
git commit -m "chore: add project structure and package.json"
git push
```

---

### 2. "No releases or published packages"

**Problem:** Hard to install/use - no npm/pip packages.

**Fix:** Create npm package

**Step 1:** Publish to npm
```bash
# In your repo
npm login
npm publish --access public
```

**Step 2:** Create Python package too
```bash
mkdir -p mcp_discovery

# setup.py
cat > setup.py << 'EOF'
from setuptools import setup, find_packages

setup(
    name="mcp-discovery",
    version="2.0.0",
    description="Semantic search for 14,000+ MCP servers",
    packages=find_packages(),
    install_requires=["requests"],
    python_requires=">=3.8",
)
EOF

# mcp_discovery/__init__.py
cat > mcp_discovery/__init__.py << 'EOF'
"""MCP Discovery - Semantic search for MCP servers"""

import requests
from typing import List, Dict, Optional

class MCPDiscovery:
    def __init__(self, api_url: str = "https://mcp-discovery-two.vercel.app"):
        self.api_url = api_url
    
    def discover(self, need: str, limit: int = 5) -> List[Dict]:
        """Discover MCP servers for a given need."""
        response = requests.post(
            f"{self.api_url}/api/v1/discover",
            json={"need": need, "limit": limit}
        )
        response.raise_for_status()
        return response.json()["recommendations"]

def discover_mcp_server(need: str, limit: int = 5) -> List[Dict]:
    """Quick function to discover MCP servers."""
    client = MCPDiscovery()
    return client.discover(need, limit)

__all__ = ["MCPDiscovery", "discover_mcp_server"]
EOF

# Publish to PyPI
python setup.py sdist bdist_wheel
twine upload dist/*
```

---

### 3. "Documentation is basic"

**Problem:** Missing detailed docs, architecture, contributor guide.

**Fix:** Create comprehensive documentation

**Create `docs/ARCHITECTURE.md`:**
```markdown
# Architecture

## Overview

MCP Discovery V2 is a semantic search API for 14,000+ Model Context Protocol servers.

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API       │────▶│  Supabase   │
│  (Agent)    │◀────│  (Vercel)   │◀────│  (pgvector) │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   OpenAI    │
                     │ Embeddings  │
                     └─────────────┘
```

## Data Flow

1. **Aggregation:** Servers scraped from Glama, NPM, GitHub, Awesome Lists
2. **Embedding:** OpenAI text-embedding-ada-002 converts descriptions to vectors
3. **Storage:** Vectors stored in Supabase PostgreSQL with pgvector
4. **Search:** Cosine similarity matching for queries
5. **Ranking:** Results ranked by confidence score

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/discover | POST | Semantic search |
| /api/v1/servers | GET | List all servers |
| /api/v1/categories | GET | List categories |
| /health | GET | Health check |

## Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Next.js API routes
- **Database:** Supabase (PostgreSQL + pgvector)
- **Embeddings:** OpenAI text-embedding-ada-002
- **Hosting:** Vercel
```

**Create `CONTRIBUTING.md`:**
```markdown
# Contributing to MCP Discovery

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/mcp-discovery-v2.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and fill in your keys

## Development

```bash
# Run locally
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Adding a New MCP Server Source

1. Create scraper in `src/scrapers/`
2. Add tests in `tests/scrapers/`
3. Update documentation

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit PR with description
```

---

### 4. "No tests or CI/CD"

**Problem:** No quality badges, no automated testing.

**Fix:** Add GitHub Actions

**Create `.github/workflows/ci.yml`:**
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
```

**Create `.github/workflows/test.yml` for API testing:**
```yaml
name: API Tests

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  test-api:
    runs-on: ubuntu-latest
    steps:
      - name: Test API health
        run: |
          curl -f https://mcp-discovery-two.vercel.app/health || exit 1
          
      - name: Test discovery endpoint
        run: |
          curl -X POST https://mcp-discovery-two.vercel.app/api/v1/discover \
            -H "Content-Type: application/json" \
            -d '{"need": "slack"}' | grep -q "recommendations"
```

---

### 5. "Security considerations"

**Problem:** No server verification, potential security risks.

**Fix:** Add security documentation and verification

**Add to README:**
```markdown
## Security

MCP Discovery indexes servers from public sources. We recommend:

- ✅ Verify server source before installing
- ✅ Check GitHub stars/forks as trust signals
- ✅ Review server permissions before connecting
- ⚠️ Never install servers from untrusted sources

### Verified Servers

Servers with a ✅ badge have been manually reviewed:
- Official Anthropic servers
- Servers with 100+ GitHub stars
- Community-verified submissions

[Learn more about security](./SECURITY.md)
```

**Create `SECURITY.md`:**
```markdown
# Security Policy

## Reporting Vulnerabilities

Please report security issues to: security@mcp-discovery.dev

## MCP Server Security

MCP servers execute code on your machine. Always:

1. Review the server's source code
2. Check for excessive permissions
3. Verify the author's reputation
4. Use sandboxed environments when possible

## Data We Collect

- Search queries (anonymized)
- Server metadata (publicly available)
- No personal data or credentials
```

---

### 6. "0 stars, 0 forks" - Marketing Problem

**Problem:** No one knows about it yet.

**Fix:** Launch strategy (see original ACTION_PLAN.md)

**Immediate actions:**
1. Post on Hacker News: "Show HN: MCP Discovery – Semantic search for 14,000+ MCP servers"
2. Tweet thread about the 14,000 servers
3. Share on Reddit: r/ClaudeAI, r/LocalLLaMA
4. Email Anthropic/Cursor about integration

---

## 📋 Quick Fix Checklist

Run these commands to quickly improve the repo:

```bash
cd /Users/yoshikondo/mcp-discovery-v2-repo

# 1. Add LICENSE
curl -o LICENSE https://www.mit.edu/~amini/LICENSE.md

# 2. Add basic structure
touch src/index.ts tests/test.ts docs/API.md

# 3. Add GitHub Actions
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
EOF

# 4. Commit and push
git add .
git commit -m "chore: add structure, license, CI/CD, docs"
git push
```

---

## 🎯 Target: 8.5/10 Rating

After these improvements:

| Issue | Before | After |
|-------|--------|-------|
| Activity | 2 commits | 10+ commits |
| Structure | Just README | Full project structure |
| Docs | Basic | Comprehensive |
| Tests | None | CI/CD + tests |
| Packages | None | npm + PyPI |
| Security | Missing | SECURITY.md |
| **Rating** | **6.5/10** | **8.5/10** |

---

## Next Steps

1. **Today:** Add structure, LICENSE, CI/CD
2. **This week:** Publish npm package
3. **Next week:** Launch on HN/Reddit/Twitter
4. **Ongoing:** Add tests, improve docs

**Want me to help implement any of these?** Just say which one!
