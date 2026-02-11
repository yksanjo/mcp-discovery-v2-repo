/**
 * MCP Discovery v2
 * 
 * Semantic search for 14,000+ Model Context Protocol servers
 * 
 * @example
 * ```typescript
 * import { MCPDiscovery } from '@yksanjo/mcp-discovery';
 * 
 * const client = new MCPDiscovery();
 * const results = await client.discover("I need a PostgreSQL database");
 * 
 * for (const server of results.recommendations) {
 *   console.log(`${server.name}: ${server.install_command}`);
 * }
 * ```
 */

export { MCPDiscovery, discoverMcpServers } from './discovery';
export type { 
  MCPServer, 
  DiscoveryResponse, 
  CategoriesResponse, 
  Category,
  DiscoveryOptions 
} from './types';

// Version
export const VERSION = '2.0.0';

// Re-export as default
export { MCPDiscovery as default } from './discovery';
