"""
MCP Discovery - Python Client
Semantic search for 14,000+ Model Context Protocol servers

Example:
    >>> from mcp_discovery import MCPDiscovery
    >>> client = MCPDiscovery()
    >>> servers = client.discover("I need a PostgreSQL database")
    >>> print(servers[0]['install_command'])
"""

import requests
from typing import List, Dict, Optional, Any

__version__ = "2.0.0"
__author__ = "Yoshi Kondo"


class MCPDiscovery:
    """
    Client for MCP Discovery API
    
    Provides semantic search over 14,000+ MCP servers.
    
    Args:
        api_url: API endpoint URL (default: https://mcp-discovery-two.vercel.app)
    
    Example:
        >>> client = MCPDiscovery()
        >>> result = client.discover("slack notifications", limit=3)
        >>> for server in result['recommendations']:
        ...     print(f"{server['name']}: {server['install_command']}")
    """
    
    def __init__(self, api_url: str = "https://mcp-discovery-two.vercel.app"):
        self.api_url = api_url.rstrip('/')
        self.session = requests.Session()
    
    def discover(
        self, 
        need: str, 
        limit: int = 5, 
        category: Optional[str] = None,
        min_confidence: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Discover MCP servers matching a need.
        
        Args:
            need: Natural language description of what you need
            limit: Maximum number of results (1-50)
            category: Filter by category slug
            min_confidence: Minimum confidence threshold (0-1)
        
        Returns:
            Dictionary with recommendations, query_time_ms, total_found
        
        Raises:
            requests.HTTPError: If API request fails
        
        Example:
            >>> client = MCPDiscovery()
            >>> result = client.discover("send slack notifications")
            >>> print(f"Found {result['total_found']} servers")
        """
        payload = {"need": need, "limit": limit}
        
        if category:
            payload["category"] = category
        if min_confidence is not None:
            payload["min_confidence"] = min_confidence
        
        response = self.session.post(
            f"{self.api_url}/api/v1/discover",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    def get_categories(self) -> List[Dict[str, Any]]:
        """
        Get all available categories.
        
        Returns:
            List of category dictionaries with slug, name, description, count
        
        Example:
            >>> client = MCPDiscovery()
            >>> categories = client.get_categories()
            >>> for cat in categories:
            ...     print(f"{cat['name']}: {cat['count']} servers")
        """
        response = self.session.get(f"{self.api_url}/api/v1/categories")
        response.raise_for_status()
        return response.json()["categories"]
    
    def get_server(self, slug: str) -> Dict[str, Any]:
        """
        Get details for a specific server.
        
        Args:
            slug: Server slug/identifier
        
        Returns:
            Server details dictionary
        
        Raises:
            requests.HTTPError: If server not found (404) or other error
        """
        response = self.session.get(f"{self.api_url}/api/v1/servers/{slug}")
        response.raise_for_status()
        return response.json()
    
    def health(self) -> bool:
        """
        Check API health.
        
        Returns:
            True if API is healthy, False otherwise
        
        Example:
            >>> client = MCPDiscovery()
            >>> if client.health():
            ...     print("API is ready")
        """
        try:
            response = self.session.get(f"{self.api_url}/health")
            return response.status_code == 200
        except requests.RequestException:
            return False


def discover_mcp_servers(need: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Quick function to discover MCP servers.
    
    Convenience function for simple use cases. For more control,
    use the MCPDiscovery class.
    
    Args:
        need: What you need
        limit: Maximum results
    
    Returns:
        List of matching servers
    
    Example:
        >>> servers = discover_mcp_servers("database", 3)
        >>> for s in servers:
        ...     print(s['name'])
    """
    client = MCPDiscovery()
    result = client.discover(need, limit=limit)
    return result["recommendations"]


# Aliases for convenience
MCPDiscoveryClient = MCPDiscovery
discover = discover_mcp_servers

__all__ = [
    "MCPDiscovery",
    "MCPDiscoveryClient", 
    "discover_mcp_servers",
    "discover",
    "__version__"
]
