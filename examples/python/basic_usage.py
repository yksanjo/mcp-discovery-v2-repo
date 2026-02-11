"""
MCP Discovery - Python Example
Basic usage of the MCP Discovery API
"""

import requests
from typing import List, Dict, Optional


class MCPDiscovery:
    """Python client for MCP Discovery API"""
    
    def __init__(self, api_url: str = "https://mcp-discovery-two.vercel.app"):
        self.api_url = api_url.rstrip('/')
    
    def discover(self, need: str, limit: int = 5) -> Dict:
        """
        Discover MCP servers matching a need.
        
        Args:
            need: Natural language description of what you need
            limit: Maximum number of results (1-50)
            
        Returns:
            Dictionary with recommendations, query_time_ms, total_found
        """
        response = requests.post(
            f"{self.api_url}/api/v1/discover",
            json={"need": need, "limit": limit}
        )
        response.raise_for_status()
        return response.json()
    
    def get_categories(self) -> List[Dict]:
        """Get all available categories."""
        response = requests.get(f"{self.api_url}/api/v1/categories")
        response.raise_for_status()
        return response.json()["categories"]


def main():
    # Create client
    client = MCPDiscovery()
    
    print("🔍 MCP Discovery - Python Example\n")
    
    # Example 1: Basic discovery
    print("Example 1: Find Slack integration")
    print("-" * 40)
    
    result = client.discover("send slack notifications", limit=3)
    
    print(f"Query time: {result['query_time_ms']}ms")
    print(f"Total found: {result['total_found']}")
    print()
    
    for i, server in enumerate(result['recommendations'], 1):
        print(f"{i}. {server['name']}")
        print(f"   Description: {server['description']}")
        print(f"   Install: {server['install_command']}")
        print(f"   Confidence: {server['confidence']:.0%}")
        print()
    
    # Example 2: Database search
    print("\nExample 2: Find database servers")
    print("-" * 40)
    
    result = client.discover("postgresql database", limit=3)
    
    for server in result['recommendations']:
        print(f"• {server['name']}: {server['install_command']}")
    
    # Example 3: List categories
    print("\n\nExample 3: Available categories")
    print("-" * 40)
    
    categories = client.get_categories()
    
    for category in categories[:5]:  # Show first 5
        print(f"• {category['name']}: {category['count']} servers")


if __name__ == "__main__":
    main()
