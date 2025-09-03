import httpx
import json
from typing import Dict, List, Any, Optional
from core.config import settings
import logging

logger = logging.getLogger(__name__)

class MCPClient:
    """Model Context Protocol client for AI model interactions"""
    
    def __init__(self):
        self.base_url = settings.mcp_server_url or "http://localhost:8001"
        self.api_key = settings.mcp_api_key
        self.client = httpx.AsyncClient(timeout=5.0)  # Shorter timeout for faster fallback
        self.enabled = bool(settings.mcp_server_url and settings.mcp_api_key)
    
    async def get_context(self, query: str, context_type: str = "general") -> Dict[str, Any]:
        """Get relevant context for a query using MCP"""
        if not self.enabled:
            # Fallback context generation
            return self._generate_fallback_context(query, context_type)
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            
            payload = {
                "query": query,
                "context_type": context_type,
                "max_context_length": 1000
            }
            
            response = await self.client.post(
                f"{self.base_url}/context",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"MCP context request failed: {response.status_code}")
                return self._generate_fallback_context(query, context_type)
                
        except Exception as e:
            logger.debug(f"MCP context not available (expected if MCP server not running): {e}")
            return self._generate_fallback_context(query, context_type)
    
    def _generate_fallback_context(self, query: str, context_type: str) -> Dict[str, Any]:
        """Generate fallback context when MCP is not available"""
        if context_type == "summarization":
            return {
                "context": "Documentation summarization context",
                "confidence": 0.8,
                "keywords": ["documentation", "summary", "technical"]
            }
        elif context_type == "qa":
            return {
                "context": "Q&A context for technical documentation",
                "confidence": 0.7,
                "keywords": ["question", "answer", "help"]
            }
        elif context_type == "code_analysis":
            return {
                "context": "Code analysis and documentation context",
                "confidence": 0.6,
                "keywords": ["code", "analysis", "structure"]
            }
        else:
            return {
                "context": "General documentation context",
                "confidence": 0.5,
                "keywords": ["documentation", "technical", "guide"]
            }
    
    async def enhance_response(self, query: str, base_response: str, context: Dict[str, Any]) -> str:
        """Enhance a response using MCP context"""
        if not self.enabled:
            return base_response
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            
            payload = {
                "query": query,
                "base_response": base_response,
                "context": context,
                "enhancement_type": "context_aware"
            }
            
            response = await self.client.post(
                f"{self.base_url}/enhance",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("enhanced_response", base_response)
            else:
                return base_response
                
        except Exception as e:
            logger.debug(f"MCP enhancement not available (expected if MCP server not running): {e}")
            return base_response
    
    async def get_code_context(self, file_path: str, language: str) -> Dict[str, Any]:
        """Get code-specific context using MCP"""
        if not self.enabled:
            return self._generate_code_fallback_context(file_path, language)
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            
            payload = {
                "file_path": file_path,
                "language": language,
                "context_type": "code_analysis"
            }
            
            response = await self.client.post(
                f"{self.base_url}/code-context",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return self._generate_code_fallback_context(file_path, language)
                
        except Exception as e:
            logger.debug(f"MCP code context not available (expected if MCP server not running): {e}")
            return self._generate_code_fallback_context(file_path, language)
    
    def _generate_code_fallback_context(self, file_path: str, language: str) -> Dict[str, Any]:
        """Generate fallback code context"""
        return {
            "structure": f"Code structure for {file_path}",
            "dependencies": ["standard library", "common patterns"],
            "complexity": "medium",
            "language": language,
            "patterns": ["standard", "conventional"]
        }
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global MCP client instance
mcp_client = MCPClient()
