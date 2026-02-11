/**
 * MCP Discovery Client
 * 
 * Semantic search for 14,000+ Model Context Protocol servers
 */

import { MCPServer, DiscoveryResponse, CategoriesResponse, Category, DiscoveryOptions } from './types';

const DEFAULT_API_URL = 'https://mcp-discovery-two.vercel.app';
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

export class MCPDiscovery {
  private apiUrl: string;

  /**
   * Create a new MCP Discovery client
   * 
   * @param apiUrl - API endpoint (default: https://mcp-discovery-two.vercel.app)
   */
  constructor(apiUrl: string = DEFAULT_API_URL) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Discover MCP servers matching a natural language need
   * 
   * @param need - Description of what you need (e.g., "send slack notifications")
   * @param options - Discovery options
   * @returns Promise with discovery results
   * 
   * @example
   * ```typescript
   * const client = new MCPDiscovery();
   * const results = await client.discover("I need a PostgreSQL database");
   * console.log(results.recommendations[0].install_command);
   * ```
   */
  async discover(need: string, options: DiscoveryOptions = {}): Promise<DiscoveryResponse> {
    const { limit = DEFAULT_LIMIT, category, minConfidence } = options;
    
    // Validate limit
    const validatedLimit = Math.min(Math.max(1, limit), MAX_LIMIT);

    const body: Record<string, unknown> = {
      need,
      limit: validatedLimit,
    };

    if (category) {
      body.category = category;
    }

    if (minConfidence !== undefined) {
      body.min_confidence = minConfidence;
    }

    const response = await fetch(`${this.apiUrl}/api/v1/discover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<DiscoveryResponse>;
  }

  /**
   * Get all available categories
   * 
   * @returns Promise with categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.apiUrl}/api/v1/categories`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as CategoriesResponse;
    return data.categories;
  }

  /**
   * Get a specific server by slug
   * 
   * @param slug - Server slug
   * @returns Promise with server details
   */
  async getServer(slug: string): Promise<MCPServer> {
    const response = await fetch(`${this.apiUrl}/api/v1/servers/${slug}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Server not found: ${slug}`);
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<MCPServer>;
  }

  /**
   * Check API health
   * 
   * @returns Promise<boolean>
   */
  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Quick discovery function for simple use cases
 * 
 * @param need - What you need
 * @param limit - Maximum results
 * @returns Array of matching servers
 * 
 * @example
 * ```typescript
 * const servers = await discoverMcpServers("slack notifications", 3);
 * ```
 */
export async function discoverMcpServers(
  need: string, 
  limit: number = DEFAULT_LIMIT
): Promise<MCPServer[]> {
  const client = new MCPDiscovery();
  const response = await client.discover(need, { limit });
  return response.recommendations;
}

// Default export
export default MCPDiscovery;
