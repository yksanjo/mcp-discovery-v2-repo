/**
 * Type definitions for MCP Discovery
 */

export interface MCPServer {
  /** Unique identifier for the server */
  server: string;
  
  /** Display name */
  name: string;
  
  /** Description of capabilities */
  description: string;
  
  /** Installation command */
  install_command: string;
  
  /** Match confidence (0-1) */
  confidence: number;
  
  /** Category slug */
  category: string;
  
  /** Repository URL */
  repository?: string;
  
  /** NPM package name */
  npm_package?: string;
  
  /** Author information */
  author?: {
    name: string;
    url?: string;
  };
  
  /** License type */
  license?: string;
  
  /** GitHub stars (if available) */
  stars?: number;
  
  /** Source registry */
  source: 'glama' | 'npm' | 'github' | 'awesome' | 'official';
}

export interface DiscoveryResponse {
  /** Matched servers */
  recommendations: MCPServer[];
  
  /** Query execution time in ms */
  query_time_ms: number;
  
  /** Total matches found */
  total_found: number;
}

export interface Category {
  /** Category slug */
  slug: string;
  
  /** Display name */
  name: string;
  
  /** Description */
  description: string;
  
  /** Number of servers in category */
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface DiscoveryOptions {
  /** Maximum results (1-50) */
  limit?: number;
  
  /** Filter by category */
  category?: string;
  
  /** Minimum confidence threshold */
  minConfidence?: number;
}
