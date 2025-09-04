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
    
    async def get_context(self, query: str, context_type: str = "general", document_content: str = None, document_title: str = None) -> Dict[str, Any]:
        """Get relevant context for a query using MCP with document awareness"""
        if not self.enabled:
            # Enhanced fallback context generation with document content
            return self._generate_document_aware_context(query, context_type, document_content, document_title)
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
            
            payload = {
                "query": query,
                "context_type": context_type,
                "max_context_length": 1000,
                "document_content": document_content,
                "document_title": document_title
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
                return self._generate_document_aware_context(query, context_type, document_content, document_title)
                
        except Exception as e:
            logger.debug(f"MCP context not available (expected if MCP server not running): {e}")
            return self._generate_document_aware_context(query, context_type, document_content, document_title)
    
    def _generate_document_aware_context(self, query: str, context_type: str, document_content: str = None, document_title: str = None) -> Dict[str, Any]:
        """Generate document-aware context when MCP is not available"""
        if document_content and document_title:
            # Extract relevant information from document content
            relevant_info = self._extract_relevant_content(query, document_content)
            
            if context_type == "qa":
                return {
                    "context": f"Document: {document_title}\n\nRelevant content:\n{relevant_info}",
                    "confidence": 0.9 if relevant_info else 0.7,
                    "keywords": self._extract_keywords(query, document_content),
                    "document_title": document_title,
                    "has_document_content": True
                }
            elif context_type == "summarization":
                return {
                    "context": f"Document to summarize: {document_title}\n\nContent:\n{document_content[:1000]}...",
                    "confidence": 0.8,
                    "keywords": self._extract_keywords(query, document_content),
                    "document_title": document_title,
                    "has_document_content": True
                }
            elif context_type == "code_analysis":
                return {
                    "context": f"Code analysis for: {document_title}\n\nCode content:\n{document_content[:1000]}...",
                    "confidence": 0.7,
                    "keywords": self._extract_keywords(query, document_content),
                    "document_title": document_title,
                    "has_document_content": True
                }
            else:
                return {
                    "context": f"Document context: {document_title}\n\nContent:\n{document_content[:500]}...",
                    "confidence": 0.6,
                    "keywords": self._extract_keywords(query, document_content),
                    "document_title": document_title,
                    "has_document_content": True
                }
        else:
            # Fallback to original context generation
            return self._generate_fallback_context(query, context_type)
    
    def _extract_relevant_content(self, query: str, document_content: str) -> str:
        """Extract content relevant to the query from the document"""
        try:
            query_words = set(query.lower().split())
            lines = document_content.split('\n')
            relevant_lines = []
            
            for line in lines:
                line_lower = line.lower()
                # Check if line contains query keywords
                if any(word in line_lower for word in query_words if len(word) > 2):
                    relevant_lines.append(line.strip())
            
            # Return relevant content (limit to 500 characters)
            if relevant_lines:
                return '\n'.join(relevant_lines[:5])  # Take first 5 relevant lines
            else:
                # If no direct matches, return first few lines
                return '\n'.join(lines[:10])
                
        except Exception as e:
            logger.error(f"Error extracting relevant content: {e}")
            return document_content[:500] if document_content else ""
    
    def _extract_keywords(self, query: str, document_content: str) -> List[str]:
        """Extract keywords from query and document content"""
        try:
            keywords = []
            
            # Add query keywords
            query_words = query.lower().split()
            keywords.extend([word for word in query_words if len(word) > 2])
            
            # Add document keywords (common technical terms)
            doc_lower = document_content.lower()
            tech_keywords = ['function', 'class', 'method', 'api', 'endpoint', 'database', 'config', 'setup', 'install', 'usage', 'example']
            
            for keyword in tech_keywords:
                if keyword in doc_lower:
                    keywords.append(keyword)
            
            return list(set(keywords))[:10]  # Return unique keywords, max 10
                
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            return []
    
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
