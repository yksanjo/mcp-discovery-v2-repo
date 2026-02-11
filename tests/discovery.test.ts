import { MCPDiscovery, discoverMcpServers } from '../src/discovery';

describe('MCPDiscovery', () => {
  let client: MCPDiscovery;

  beforeEach(() => {
    client = new MCPDiscovery();
  });

  describe('constructor', () => {
    it('should use default API URL', () => {
      const c = new MCPDiscovery();
      expect(c).toBeDefined();
    });

    it('should accept custom API URL', () => {
      const c = new MCPDiscovery('https://custom.api.com');
      expect(c).toBeDefined();
    });

    it('should handle trailing slash', () => {
      const c = new MCPDiscovery('https://api.example.com/');
      expect(c).toBeDefined();
    });
  });

  describe('health', () => {
    it('should return true for healthy API', async () => {
      const isHealthy = await client.health();
      expect(typeof isHealthy).toBe('boolean');
    });
  });

  describe('discover', () => {
    it('should discover servers for a valid query', async () => {
      const response = await client.discover('slack notifications');
      
      expect(response).toHaveProperty('recommendations');
      expect(response).toHaveProperty('query_time_ms');
      expect(response).toHaveProperty('total_found');
      expect(Array.isArray(response.recommendations)).toBe(true);
      
      if (response.recommendations.length > 0) {
        const server = response.recommendations[0];
        expect(server).toHaveProperty('server');
        expect(server).toHaveProperty('name');
        expect(server).toHaveProperty('description');
        expect(server).toHaveProperty('install_command');
        expect(server).toHaveProperty('confidence');
        expect(server).toHaveProperty('category');
      }
    });

    it('should respect limit parameter', async () => {
      const response = await client.discover('database', { limit: 3 });
      expect(response.recommendations.length).toBeLessThanOrEqual(3);
    });

    it('should handle category filter', async () => {
      const response = await client.discover('database', { category: 'database' });
      expect(response.recommendations).toBeDefined();
    });
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      const categories = await client.getCategories();
      
      expect(Array.isArray(categories)).toBe(true);
      
      if (categories.length > 0) {
        const category = categories[0];
        expect(category).toHaveProperty('slug');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('count');
      }
    });
  });
});

describe('discoverMcpServers', () => {
  it('should be a convenience function', async () => {
    const servers = await discoverMcpServers('slack', 3);
    
    expect(Array.isArray(servers)).toBe(true);
    expect(servers.length).toBeLessThanOrEqual(3);
  });
});
