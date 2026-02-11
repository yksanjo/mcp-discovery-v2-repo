/**
 * MCP Discovery - JavaScript Example
 * Basic usage of the MCP Discovery API
 */

// Using native fetch (Node 18+)
class MCPDiscovery {
  constructor(apiUrl = 'https://mcp-discovery-two.vercel.app') {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  /**
   * Discover MCP servers
   * @param {string} need - What you need
   * @param {number} limit - Max results
   * @returns {Promise<Object>}
   */
  async discover(need, limit = 5) {
    const response = await fetch(`${this.apiUrl}/api/v1/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ need, limit })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get categories
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const response = await fetch(`${this.apiUrl}/api/v1/categories`);
    const data = await response.json();
    return data.categories;
  }
}

// Example usage
async function main() {
  const client = new MCPDiscovery();

  console.log('🔍 MCP Discovery - JavaScript Example\n');

  // Example 1: Basic discovery
  console.log('Example 1: Find Slack integration');
  console.log('-'.repeat(40));

  try {
    const result = await client.discover('send slack notifications', 3);

    console.log(`Query time: ${result.query_time_ms}ms`);
    console.log(`Total found: ${result.total_found}\n`);

    result.recommendations.forEach((server, i) => {
      console.log(`${i + 1}. ${server.name}`);
      console.log(`   Description: ${server.description}`);
      console.log(`   Install: ${server.install_command}`);
      console.log(`   Confidence: ${(server.confidence * 100).toFixed(0)}%\n`);
    });

    // Example 2: Database search
    console.log('\nExample 2: Find database servers');
    console.log('-'.repeat(40));

    const dbResult = await client.discover('postgresql database', 3);
    dbResult.recommendations.forEach(server => {
      console.log(`• ${server.name}: ${server.install_command}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { MCPDiscovery };
