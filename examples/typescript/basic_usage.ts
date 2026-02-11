/**
 * MCP Discovery - TypeScript Example
 * Type-safe usage of the MCP Discovery API
 */

import { MCPDiscovery, MCPServer, DiscoveryResponse } from '@yksanjo/mcp-discovery';

async function main(): Promise<void> {
  // Create client with type safety
  const client = new MCPDiscovery();

  console.log('🔍 MCP Discovery - TypeScript Example\n');

  // Example 1: Basic discovery with full type safety
  console.log('Example 1: Find Slack integration');
  console.log('-'.repeat(40));

  const result: DiscoveryResponse = await client.discover('send slack notifications', { limit: 3 });

  console.log(`Query time: ${result.query_time_ms}ms`);
  console.log(`Total found: ${result.total_found}\n`);

  result.recommendations.forEach((server: MCPServer, i: number) => {
    console.log(`${i + 1}. ${server.name}`);
    console.log(`   Description: ${server.description}`);
    console.log(`   Install: ${server.install_command}`);
    console.log(`   Confidence: ${(server.confidence * 100).toFixed(0)}%`);
    console.log(`   Category: ${server.category}\n`);
  });

  // Example 2: Using with category filter
  console.log('\nExample 2: Filter by category');
  console.log('-'.repeat(40));

  const dbResult = await client.discover('database access', { 
    limit: 3, 
    category: 'database' 
  });

  console.log(`Found ${dbResult.total_found} database servers`);
  dbResult.recommendations.forEach((server: MCPServer) => {
    console.log(`• ${server.name}: ${server.install_command}`);
  });

  // Example 3: Get categories
  console.log('\n\nExample 3: Browse categories');
  console.log('-'.repeat(40));

  const categories = await client.getCategories();
  categories.slice(0, 5).forEach(cat => {
    console.log(`• ${cat.name} (${cat.count} servers)`);
  });

  // Example 4: Health check
  console.log('\n\nExample 4: Health check');
  console.log('-'.repeat(40));

  const isHealthy = await client.health();
  console.log(`API is ${isHealthy ? 'healthy ✅' : 'unhealthy ❌'}`);
}

// Run
main().catch(console.error);
