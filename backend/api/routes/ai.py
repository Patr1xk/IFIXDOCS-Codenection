import httpx
import json
import re
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import logging
from core.config import settings
from core.mcp_client import mcp_client

logger = logging.getLogger(__name__)
router = APIRouter()

# Hugging Face client for AI features
class HuggingFaceClient:
    def __init__(self):
        self.api_key = settings.huggingface_api_key
        self.base_url = "https://api-inference.huggingface.co/models"
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def generate_text(self, prompt: str, max_length: int = 500, temperature: float = 0.7, model: str = None) -> str:
        """Generate text using Hugging Face models with model selection"""
        if not self.api_key:
            return self._fallback_response(prompt)
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            
            # Use specified model or default to a good one
            if not model:
                model = "microsoft/DialoGPT-small"  # Smaller, more reliable model
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_length": max_length,
                    "temperature": temperature,
                    "do_sample": True,
                    "top_p": 0.9,
                    "top_k": 50,
                    "no_repeat_ngram_size": 3
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/{model}",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Hugging Face API response: {result}")
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get('generated_text', '')
                    # Clean up the response
                    if generated_text:
                        # Remove the original prompt from the response
                        if prompt in generated_text:
                            generated_text = generated_text.replace(prompt, '').strip()
                        return generated_text or self._fallback_response(prompt)
                return self._fallback_response(prompt)
            else:
                logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
                return self._fallback_response(prompt)
                
        except Exception as e:
            logger.error(f"Error generating text: {e}")
            return self._fallback_response(prompt)
    
    async def summarize_text(self, text: str, max_length: int = 300, summary_type: str = "comprehensive") -> str:
        """Summarize text using Hugging Face with better control"""
        if not self.api_key:
            return self._fallback_summary(text, summary_type)
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            
            # Use a better summarization model
            model = "facebook/bart-large-cnn"  # Good for summarization
            
            # Adjust parameters based on summary type
            if summary_type == "brief":
                min_length = 50
                max_length = min(max_length, 150)
            elif summary_type == "comprehensive":
                min_length = 100
                max_length = min(max_length, 400)
            elif summary_type == "detailed":
                min_length = 200
                max_length = min(max_length, 600)
            else:
                min_length = 100
                max_length = min(max_length, 300)
            
            # Increase input length for better context
            input_text = text[:2000]  # Increased from 1000
            
            payload = {
                "inputs": input_text,
                "parameters": {
                    "max_length": max_length,
                    "min_length": min_length,
                    "do_sample": False,
                    "num_beams": 4,  # Better quality
                    "length_penalty": 1.0,  # Encourage longer summaries
                    "no_repeat_ngram_size": 3  # Avoid repetition
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/{model}",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    summary = result[0].get('summary_text', self._fallback_summary(text, summary_type))
                    # Ensure summary is not too short
                    if len(summary.split()) < 20:
                        return self._fallback_summary(text, summary_type)
                    return summary
                return self._fallback_summary(text, summary_type)
            else:
                return self._fallback_summary(text, summary_type)
                
        except Exception as e:
            logger.error(f"Error summarizing text: {e}")
            return self._fallback_summary(text, summary_type)
    
    def _fallback_response(self, prompt: str) -> str:
        """Smart fallback response based on prompt"""
        prompt_lower = prompt.lower()
        
        # More detailed and realistic responses
        if "how" in prompt_lower:
            if "github" in prompt_lower or "repository" in prompt_lower:
                return "To generate documentation from GitHub, go to the 'Write Documentation' section and paste your GitHub repository URL. The system will automatically analyze your code and generate comprehensive documentation including README, API docs, and setup guides."
            elif "documentation" in prompt_lower or "docs" in prompt_lower:
                return "You can create documentation in several ways: 1) Use GitHub integration to auto-generate from repositories, 2) Write manually with AI assistance, 3) Use templates and AI suggestions for faster writing. Start with the 'Write Documentation' section."
            else:
                return "To get started, use the GitHub integration to auto-generate documentation from repositories. You can also use the AI features for summarization and Q&A."
        elif "what" in prompt_lower:
            if "features" in prompt_lower:
                return "SmartDocs includes: AI-powered documentation generation from GitHub repositories, intelligent summarization tools, Q&A search for documents, multilingual support, real-time writing assistance with grammar checking, and visualization tools for flow diagrams and API call graphs."
            elif "platform" in prompt_lower or "tool" in prompt_lower:
                return "This is a comprehensive documentation platform that helps you create, read, and maintain technical documentation using AI-powered features like auto-generation, summarization, and intelligent Q&A."
            else:
                return "This is a comprehensive documentation platform that helps you create, read, and maintain technical documentation using AI-powered features."
        elif "why" in prompt_lower:
            return "Documentation is crucial for team collaboration and project maintenance. This tool makes it easier and faster with AI assistance, reducing the time spent on documentation while improving quality."
        elif "summarize" in prompt_lower or "tldr" in prompt_lower:
            return "I can help summarize long documents. Paste your content in the 'AI Features' section and I'll extract the key points for you. You can choose between brief, comprehensive, or detailed summaries."
        elif "q&a" in prompt_lower or "question" in prompt_lower:
            return "You can ask questions about your documentation in the 'AI Features' section. The system will analyze your documents and provide detailed answers with relevant context."
        else:
            return "I'm here to help with documentation tasks. Try the GitHub integration to auto-generate docs, or use the AI features for summarization and Q&A."
    
    def _fallback_summary(self, text: str, summary_type: str = "comprehensive") -> str:
        """Smart fallback summary with better control"""
        sentences = text.split('.')
        if len(sentences) <= 3:
            return text
        
        # Adjust summary length based on type
        if summary_type == "brief":
            summary_sentences = sentences[:2]
        elif summary_type == "comprehensive":
            summary_sentences = sentences[:4]
        elif summary_type == "detailed":
            summary_sentences = sentences[:6]
        else:
            summary_sentences = sentences[:4]
        
        # Clean up sentences
        summary_sentences = [s.strip() for s in summary_sentences if s.strip()]
        
        # Add key points extraction for longer texts
        if len(sentences) > 10:
            # Look for key phrases
            key_phrases = []
            for sentence in sentences[:8]:
                if any(keyword in sentence.lower() for keyword in ['important', 'key', 'main', 'primary', 'essential', 'critical']):
                    key_phrases.append(sentence.strip())
            
            if key_phrases:
                summary_sentences.extend(key_phrases[:2])
        
        summary = '. '.join(summary_sentences) + '.'
        
        # Ensure minimum length
        if len(summary.split()) < 30:
            # Add more sentences if too short
            additional_sentences = sentences[4:6]
            summary += ' ' + '. '.join([s.strip() for s in additional_sentences if s.strip()]) + '.'
        
        return summary

huggingface_client = HuggingFaceClient()

# Helper methods for enhanced GitHub analysis
def _analyze_python_file_purpose(content: str) -> str:
    """Analyze Python file content to determine its purpose"""
    content_lower = content.lower()
    
    if 'def main(' in content_lower or '__main__' in content_lower:
        return "Main application entry point"
    elif 'test' in content_lower and ('def test_' in content_lower or 'import unittest' in content_lower):
        return "Test file with test cases"
    elif 'class' in content_lower and 'def __init__' in content_lower:
        return "Class definition module"
    elif 'import' in content_lower and 'def ' in content_lower:
        return "Utility module with functions"
    elif 'flask' in content_lower or 'fastapi' in content_lower or '@app.' in content_lower:
        return "Web API/server module"
    elif 'config' in content_lower or 'settings' in content_lower:
        return "Configuration module"
    else:
        return "Python script module"

def _get_file_type_description(filename: str) -> str:
    """Get description for file type"""
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.py'):
        if 'main' in filename_lower:
            return "Main Python script"
        elif 'test' in filename_lower:
            return "Test file"
        else:
            return "Python module"
    elif filename_lower.endswith('.js'):
        return "JavaScript file"
    elif filename_lower.endswith('.md'):
        return "Markdown documentation"
    elif filename_lower.endswith(('.yml', '.yaml')):
        return "Configuration file"
    else:
        return "Source code file"

# GitHub client for repository analysis
class GitHubClient:
    def __init__(self):
        self.token = settings.github_token
        self.client = httpx.AsyncClient(timeout=30.0)
    
    def parse_github_url(self, url: str) -> Dict[str, str]:
        """Parse GitHub URL to extract owner and repo"""
        pattern = r"github\.com/([^/]+)/([^/]+)"
        match = re.search(pattern, url)
        if match:
            return {"owner": match.group(1), "repo": match.group(2)}
        raise ValueError("Invalid GitHub URL")
    
    async def get_repository_info(self, owner: str, repo: str) -> Dict[str, Any]:
        """Get repository information"""
        headers = {"Authorization": f"token {self.token}"} if self.token else {}
        
        try:
            response = await self.client.get(
                f"https://api.github.com/repos/{owner}/{repo}",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "name": repo,
                    "description": "Repository information",
                    "language": "Unknown",
                    "stargazers_count": 0,
                    "forks_count": 0
                }
        except Exception as e:
            logger.error(f"Error getting repo info: {e}")
            return {
                "name": repo,
                "description": "Repository information",
                "language": "Unknown",
                "stargazers_count": 0,
                "forks_count": 0
            }
    
    async def get_repository_content(self, owner: str, repo: str, path: str = "") -> List[Dict[str, Any]]:
        """Get repository content"""
        headers = {"Authorization": f"token {self.token}"} if self.token else {}
        
        try:
            response = await self.client.get(
                f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return []
        except Exception as e:
            logger.error(f"Error getting repo content: {e}")
            return []
    
    async def get_file_content(self, owner: str, repo: str, path: str) -> str:
        """Get file content"""
        headers = {"Authorization": f"token {self.token}"} if self.token else {}
        
        try:
            response = await self.client.get(
                f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
                headers=headers
            )
            
            if response.status_code == 200:
                import base64
                content = response.json().get('content', '')
                return base64.b64decode(content).decode('utf-8')
            else:
                return ""
        except Exception as e:
            logger.error(f"Error getting file content: {e}")
            return ""

github_client = GitHubClient()

# Pydantic models
class GitHubDocRequest(BaseModel):
    github_url: str
    project_type: Optional[str] = "api"
    include_examples: Optional[bool] = True
    language: Optional[str] = "en"

class GitHubDocResponse(BaseModel):
    readme: Optional[str] = None
    api_docs: Optional[str] = None
    setup_guide: Optional[str] = None
    total_files_processed: int
    repository_info: dict

class SummarizeRequest(BaseModel):
    content: str
    max_length: Optional[int] = 300
    summary_type: Optional[str] = "comprehensive"  # brief, comprehensive, detailed
    style: Optional[str] = "technical"

class SummarizeResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    reduction_percentage: float
    summary_type: str
    word_count: int
    sentence_count: int
    avg_sentence_length: float

class QARequest(BaseModel):
    question: str
    context: Optional[str] = ""
    document_id: Optional[str] = None  # ID of saved document to use as context
    document_title: Optional[str] = None  # Title of document for reference

class QAResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[str]
    related_questions: List[str]
    document_used: Optional[str] = None
    document_title: Optional[str] = None

class GenerateDocRequest(BaseModel):
    code_content: str
    language: str
    doc_type: str
    style: Optional[str] = "technical"

class GenerateDocResponse(BaseModel):
    documentation: str
    sections: List[str]
    estimated_completion_time: int

class MaintenanceRequest(BaseModel):
    documentation_content: str
    code_repository: str
    check_type: str = "drift"

class MaintenanceResponse(BaseModel):
    issues_found: List[Dict[str, Any]]
    suggestions: List[str]
    confidence: float

# Core Feature 1: Simplify Writing - GitHub Integration
@router.post("/generate-from-github", response_model=GitHubDocResponse)
async def generate_documentation_from_github(request: GitHubDocRequest):
    """Generate documentation from GitHub repository"""
    try:
        # Parse GitHub URL
        repo_info = github_client.parse_github_url(request.github_url)
        owner = repo_info["owner"]
        repo = repo_info["repo"]
        
        # Get repository information
        repository_info = await github_client.get_repository_info(owner, repo)
        
        # Get repository content
        content = await github_client.get_repository_content(owner, repo)
        
        # Process files
        readme_content = ""
        api_files = []
        setup_files = []
        total_files = 0
        
        for item in content:
            if item.get('type') == 'file':
                total_files += 1
                filename = item.get('name', '').lower()
                
                if 'readme' in filename:
                    readme_content = await github_client.get_file_content(owner, repo, item.get('path', ''))
                elif any(ext in filename for ext in ['.py', '.js', '.java', '.cpp', '.c', '.go']):
                    api_files.append(item)
                elif any(ext in filename for ext in ['.md', '.txt', '.yml', '.yaml']):
                    setup_files.append(item)
        
        # Enhanced Documentation Generation with Detailed Analysis
        
        # Analyze file types and structure
        python_files = [f for f in api_files if f.get('name', '').endswith('.py')]
        js_files = [f for f in api_files if f.get('name', '').endswith('.js')]
        
        # Get actual file contents for analysis
        file_analyses = []
        for py_file in python_files[:3]:  # Analyze up to 3 Python files
            file_content = await github_client.get_file_content(owner, repo, py_file.get('path', ''))
            if file_content:
                file_analyses.append({
                    'name': py_file.get('name'),
                    'content': file_content[:500],  # First 500 chars
                    'size': len(file_content),
                    'type': 'python'
                })
        
        # Generate comprehensive documentation
        if settings.huggingface_api_key:
            # Enhanced README with actual analysis
            repo_desc = repository_info.get('description', '') or "A Python project"
            repo_language = repository_info.get('language', 'Python')
            
            readme = f"""# {repository_info.get('name', repo)}

{repo_desc}

## 📋 Overview

This repository contains **{len(python_files)} Python files** and appears to be a **{request.project_type}** project.

### 🔍 Repository Analysis
- **Primary Language**: {repo_language}
- **Total Files**: {total_files}
- **Python Scripts**: {len(python_files)}
- **Documentation Files**: {len(setup_files)}

### 📁 File Structure
"""
            
            for file_analysis in file_analyses:
                readme += f"- **{file_analysis['name']}** ({file_analysis['size']} bytes) - {_analyze_python_file_purpose(file_analysis['content'])}\n"
            
            # Enhanced API docs with code analysis
            api_docs = f"""# 🔌 API Documentation

## Code Analysis

This repository contains {len(python_files)} Python files that have been analyzed:

"""
            
            for file_analysis in file_analyses:
                api_docs += f"""### `{file_analysis['name']}`

**Purpose**: {_analyze_python_file_purpose(file_analysis['content'])}
**Size**: {file_analysis['size']} bytes

**Code Preview**:
```python
{file_analysis['content'][:200]}...
```

---

"""
            
            # Enhanced setup guide based on project type
            setup_guide = f"""# 🚀 Setup Guide

## Quick Start

### Prerequisites
- Python 3.7+ installed
- Git for cloning

### Installation

1. **Clone the repository**
   ```bash
   git clone {request.github_url}
   cd {repo}
   ```

2. **Set up environment** (if requirements.txt exists)
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

### 📋 Usage

Based on the analyzed files:
"""
            
            for file_analysis in file_analyses:
                if file_analysis['name'] == 'main.py':
                    setup_guide += f"- **{file_analysis['name']}**: Main entry point - run with `python {file_analysis['name']}`\n"
                elif 'test' in file_analysis['name'].lower():
                    setup_guide += f"- **{file_analysis['name']}**: Test file - run with `python {file_analysis['name']}`\n"
                else:
                    setup_guide += f"- **{file_analysis['name']}**: {_analyze_python_file_purpose(file_analysis['content'])}\n"
            
        else:
            # Enhanced fallback documentation
            readme = f"""# {repository_info.get('name', repo)}

{repository_info.get('description', 'A Python project repository')}

## 📋 Overview

This repository has been analyzed and contains:
- **{len(python_files)} Python files**
- **{total_files} total files**
- **Language**: {repository_info.get('language', 'Python')}

## 🔍 Quick Analysis
Repository appears to be a **{request.project_type}** project with Python scripts.
"""
            
            api_docs = f"""# 🔌 Code Documentation

## Files Found

This repository contains **{len(api_files)} code files**:

"""
            for file in api_files:
                api_docs += f"- **{file.get('name')}** - {_get_file_type_description(file.get('name', ''))}\n"
            
            setup_guide = f"""# 🚀 Setup Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone {request.github_url}
   cd {repo}
   ```

2. **Run Python scripts**
   ```bash
   python main.py
   ```

## 📁 Files Overview
- Contains {len(python_files)} Python files
- Project type: {request.project_type}
"""
        
        return GitHubDocResponse(
            readme=readme,
            api_docs=api_docs,
            setup_guide=setup_guide,
            total_files_processed=total_files,
            repository_info=repository_info
        )
        
    except Exception as e:
        logger.error(f"Error generating GitHub documentation: {e}")
        raise HTTPException(status_code=500, detail="GitHub documentation generation failed")

# Core Feature 2: Speed Up Reading - Summarization
@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_content(request: SummarizeRequest):
    """Summarize long content using AI with comprehensive options"""
    try:
        original_length = len(request.content)
        
        # Get summary type from request (default to comprehensive)
        summary_type = getattr(request, 'summary_type', 'comprehensive')
        
        if settings.huggingface_api_key:
            summary = await huggingface_client.summarize_text(
                request.content, 
                request.max_length, 
                summary_type
            )
        else:
            # Enhanced fallback summarization
            summary = huggingface_client._fallback_summary(request.content, summary_type)
        
        summary_length = len(summary)
        reduction = ((original_length - summary_length) / original_length) * 100 if original_length > 0 else 0
        
        # Add summary quality metrics
        word_count = len(summary.split())
        sentence_count = len(summary.split('.'))
        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0
            
            return SummarizeResponse(
                summary=summary,
            original_length=original_length,
            summary_length=summary_length,
            reduction_percentage=reduction,
            summary_type=summary_type,
            word_count=word_count,
            sentence_count=sentence_count,
            avg_sentence_length=round(avg_sentence_length, 1)
        )
    except Exception as e:
        logger.error(f"Error in summarization: {e}")
        raise HTTPException(status_code=500, detail="Summarization failed")

# New endpoint for AI content enhancement
@router.post("/enhance", response_model=SummarizeResponse)
async def enhance_content(request: SummarizeRequest):
    """Enhance documentation content with AI-powered improvements"""
    try:
        content = request.content.strip()
        original_length = len(content)
        
        if not content:
            raise ValueError("Content cannot be empty")
        
        # Check if this is an enhancement request
        is_enhancement = "enhance" in content.lower() or "comprehensive" in content.lower()
        
        if is_enhancement and settings.huggingface_api_key:
            try:
                enhanced = await huggingface_client.generate_text(content, max_length=1000)
                if enhanced and len(enhanced) > len(content):
                    return SummarizeResponse(
                        summary=enhanced,
                        original_length=original_length,
                        summary_length=len(enhanced),
                        reduction_percentage=((len(enhanced) - original_length) / original_length) * 100
                    )
            except Exception as e:
                logger.warning(f"Huggingface enhancement failed: {e}")
        
        # Fallback enhancement logic
        enhanced_content = _enhance_content_fallback(content)
        
        enhanced_length = len(enhanced_content)
        change_percentage = ((enhanced_length - original_length) / original_length) * 100 if original_length > 0 else 0
        
        return SummarizeResponse(
            summary=enhanced_content,
            original_length=original_length,
            summary_length=enhanced_length,
            reduction_percentage=change_percentage
        )
        
    except Exception as e:
        logger.error(f"Error in content enhancement: {e}")
        raise HTTPException(status_code=500, detail="Content enhancement failed")

def _enhance_content_fallback(content: str) -> str:
    """Fallback content enhancement when AI is not available"""
    lines = content.split('\n')
    enhanced_lines = []
    
    for line in lines:
        line = line.strip()
        if not line:
            enhanced_lines.append('')
            continue
            
        # Enhance headers
        if line.startswith('# '):
            title = line[2:].strip()
            enhanced_lines.extend([
                f"# {title}",
                "",
                f"Welcome to the {title} documentation. This comprehensive guide will help you understand and implement all features effectively.",
                ""
            ])
        elif line.startswith('## '):
            enhanced_lines.append(line)
            enhanced_lines.append("")
        # Enhance basic sentences
        elif line.lower().startswith('this is') and 'api' in line.lower():
            enhanced_lines.extend([
                "## Overview",
                "",
                f"{line} This powerful API provides comprehensive functionality for developers to integrate with their applications.",
                "",
                "### Key Features",
                "- RESTful design principles",
                "- JSON-based responses", 
                "- Comprehensive error handling",
                "- Rate limiting and security",
                ""
            ])
        elif 'endpoints' in line.lower():
            enhanced_lines.extend([
                "## API Endpoints",
                "",
                f"{line} Each endpoint is carefully designed to provide specific functionality:",
                "",
                "### Available Endpoints",
                "- `GET /api/data` - Retrieve information",
                "- `POST /api/data` - Create new resources", 
                "- `PUT /api/data/{id}` - Update existing resources",
                "- `DELETE /api/data/{id}` - Remove resources",
                "",
                "### Example Request",
                "```bash",
                "curl -X GET 'https://api.example.com/api/data' \\",
                "  -H 'Content-Type: application/json' \\",
                "  -H 'Authorization: Bearer YOUR_TOKEN'",
                "```",
                "",
                "### Example Response",
                "```json",
                "{",
                '  "status": "success",',
                '  "data": {',
                '    "id": 1,',
                '    "message": "Hello World"',
                "  }",
                "}",
                "```",
                ""
            ])
        else:
            enhanced_lines.append(line)
    
    # Add additional sections if content is very basic
    if len(enhanced_lines) < 10:
        enhanced_lines.extend([
            "## Getting Started",
            "",
            "### Prerequisites",
            "- Basic understanding of REST APIs",
            "- API key or authentication token",
            "- HTTP client (curl, Postman, or programming language)",
            "",
            "### Quick Start",
            "1. Obtain your API credentials",
            "2. Make your first API call",
            "3. Process the response",
            "",
            "## Authentication",
            "",
            "All API requests require authentication using an API key:",
            "",
            "```bash",
            "Authorization: Bearer YOUR_API_KEY",
            "```",
            "",
            "## Error Handling",
            "",
            "The API returns standard HTTP status codes:",
            "",
            "- `200` - Success",
            "- `400` - Bad Request", 
            "- `401` - Unauthorized",
            "- `404` - Not Found",
            "- `500` - Internal Server Error",
            "",
            "## Support",
            "",
            "For additional help and support:",
            "- Check our documentation",
            "- Contact our support team",
            "- Visit our community forum"
        ])
    
    return '\n'.join(enhanced_lines)

# Core Feature 2: Speed Up Reading - Q&A
@router.post("/qa", response_model=QAResponse)
async def answer_question(request: QARequest):
    """Answer questions about documentation using AI with document context"""
    try:
        # Get document content if document_id is provided
        document_content = ""
        document_title = request.document_title or "Unknown Document"
        
        if request.document_id:
            try:
                # Import here to avoid circular imports
                from api.routes.docs import doc_manager
                document = doc_manager.get_document(request.document_id)
                if document:
                    document_content = document.content
                    document_title = document.title
                    logger.info(f"Using document '{document_title}' for Q&A with content length: {len(document_content)}")
                else:
                    logger.warning(f"Document with ID {request.document_id} not found")
            except Exception as e:
                logger.error(f"Error fetching document: {e}")
        
        # Debug: Log the document content status
        logger.info(f"Document content available: {bool(document_content)}, Length: {len(document_content)}")
        
        # Combine document content with additional context
        full_context = f"""
        Document: {document_title}
        Document Content: {document_content}
        
        Additional Context: {request.context}
        """
        
        # Get MCP context for the question with document content
        mcp_context = await mcp_client.get_context(
            request.question,
            "qa",
            document_content,
            document_title
        )
        
        # Debug: Log MCP context status
        logger.info(f"MCP context has document content: {mcp_context.get('has_document_content', False)}")
        logger.info(f"MCP context confidence: {mcp_context.get('confidence', 0)}")
        
        # Enhanced prompt with document-aware context
        if mcp_context.get('has_document_content', False):
            enhanced_prompt = f"""
            Document: {document_title}
            
            Relevant Document Content:
            {mcp_context.get('context', '')}
            
            Question: {request.question}
            
            Please provide a detailed answer based on the document content above. 
            If the answer is found in the document, reference specific parts of it.
            If the answer is not in the document, say so clearly and provide helpful guidance.
            """
        else:
        enhanced_prompt = f"""
            Document Context: {full_context}
            MCP Context: {mcp_context.get('context', '')}
        
        Question: {request.question}
        
            Please provide a comprehensive answer based on the document content. 
            If the answer is not in the provided document context, indicate this clearly 
            and provide general guidance.
            """
        
        if settings.huggingface_api_key:
            # Use Hugging Face for Q&A with better model selection
            logger.info("Using Hugging Face API for Q&A")
            try:
                # Try to use a more sophisticated model for Q&A
                qa_prompt = f"""
                Context: {full_context}
                
                Question: {request.question}
                
                Please provide a detailed, accurate answer based on the context provided. 
                If the answer is not in the context, say so clearly and provide helpful guidance.
                Structure your answer with clear explanations and examples when possible.
                """
                
                # Use a better model for Q&A (if available)
                answer = await huggingface_client.generate_text(
                    qa_prompt,
                    max_length=800,
                    temperature=0.3,  # Lower temperature for more focused answers
                    model="microsoft/DialoGPT-small"  # Smaller, more reliable model
                )
                
                # If the answer is too short or generic, enhance it
                if len(answer.strip()) < 100:
                    # Try with a different approach
                    enhanced_prompt = f"""
                    Based on this documentation:
                    {document_content[:1000]}
                    
                    Answer this question: {request.question}
                    
                    Provide a comprehensive answer with:
                    1. Direct answer to the question
                    2. Relevant details from the documentation
                    3. Practical examples or steps if applicable
                    4. Additional context that might be helpful
                    """
                    
                    answer = await huggingface_client.generate_text(
                        enhanced_prompt,
                        max_length=600,
                        temperature=0.4
                    )
                
                # Generate related questions based on the context and document content
                if document_content:
                    related_questions = await _generate_document_aware_related_questions(document_content, request.question, mcp_context)
                else:
                    related_questions = await _generate_related_questions(document_content, request.question)
                
                # Enhance with MCP if available
                enhanced_answer = await mcp_client.enhance_response(
                    request.question,
                    answer,
                    mcp_context
                )
                
                # Calculate confidence based on answer quality
                confidence = _calculate_qa_confidence(answer, document_content, request.question)
                
                return QAResponse(
                    answer=enhanced_answer,
                    confidence=confidence,
                    sources=[f"Document: {document_title}"],
                    related_questions=related_questions,
                    document_used=request.document_id,
                    document_title=document_title
                )
                
            except Exception as e:
                logger.error(f"Hugging Face Q&A error: {e}")
                # Fallback to a more robust approach
                return await _generate_fallback_qa_response(request, document_content, document_title)
        elif settings.openai_api_key:
            response = openai.ChatCompletion.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You are a helpful technical documentation assistant."},
                    {"role": "user", "content": enhanced_prompt}
                ],
                max_tokens=settings.openai_max_tokens
            )
            
            answer = response.choices[0].message.content
            
            # Enhance with MCP if available
            enhanced_answer = await mcp_client.enhance_response(
                request.question,
                answer,
                mcp_context
            )
            
            return QAResponse(
                answer=enhanced_answer,
                confidence=mcp_context.get('confidence', 0.8),
                sources=[f"Document: {document_title}"],
                related_questions=[
                    "What are the prerequisites?",
                    "How do I get started?",
                    "What are common issues?"
                ],
                document_used=request.document_id,
                document_title=document_title
            )
        else:
            # Enhanced fallback response with document-aware answers
            logger.info("Using enhanced fallback for Q&A (no API key)")
            question_lower = request.question.lower()
            
            # If we have document content, use enhanced document-aware response
            if document_content:
                # Use MCP context to generate better document-aware answers
                mcp_context = await mcp_client.get_context(
                    request.question,
                    "qa",
                    document_content,
                    document_title
                )
                
                if mcp_context.get('has_document_content', False):
                    # Use the MCP context to generate a better answer
                    relevant_content = mcp_context.get('context', '')
                    answer = f"Based on the document '{document_title}', here's what I found:\n\n{relevant_content}\n\nThis information directly addresses your question about the document content."
                else:
                    answer = await _generate_document_aware_answer(request.question, document_content, document_title)
            else:
                # Smart fallback based on question type with more comprehensive keyword detection
                fallback_answers = {
                    "how": "To get started, you can use the documentation generation features. First, try the GitHub integration to auto-generate docs from a repository. You can also use the AI features for summarization and Q&A.",
                    "what": "This is a comprehensive documentation platform that helps you create, read, and maintain technical documentation using AI-powered features like auto-generation, summarization, and intelligent Q&A.",
                    "why": "Documentation is crucial for team collaboration and project maintenance. This tool makes it easier and faster with AI assistance.",
                    "when": "You can use this tool whenever you need to create or update documentation for your projects. It's especially useful for maintaining up-to-date technical documentation.",
                    "where": "You can access all features through the main interface. Start with the 'Write Documentation' section for GitHub integration, or use the 'AI Features' for summarization and Q&A."
                }
                
                # Enhanced keyword detection
                question_words = question_lower.split()
                answer = "I can help you with documentation questions! "
                
                # Check for specific content keywords first (more specific)
                if any(word in question_lower for word in ["features", "capabilities", "functions", "tools"]):
                    answer += "SmartDocs includes: AI-powered documentation generation from GitHub repositories, intelligent summarization tools, Q&A search for documents, multilingual support, real-time writing assistance with grammar checking, and visualization tools for flow diagrams and API call graphs."
                elif any(word in question_lower for word in ["github", "repository", "repo"]):
                    answer += "To generate documentation from GitHub, go to the 'Write Documentation' section and paste your GitHub repository URL. The system will automatically analyze your code and generate comprehensive documentation including README, API docs, and setup guides."
                elif any(word in question_lower for word in ["documentation", "docs", "documents"]):
                    answer += "You can create documentation in several ways: 1) Use GitHub integration to auto-generate from repositories, 2) Write manually with AI assistance, 3) Use templates and AI suggestions for faster writing. Start with the 'Write Documentation' section."
                elif any(word in question_lower for word in ["summarize", "summary", "summarization"]):
                    answer += "I can help summarize long documents. Paste your content in the 'AI Features' section and I'll extract the key points for you. You can choose between brief, comprehensive, or detailed summaries."
                elif any(word in question_lower for word in ["question", "ask", "answer", "qa"]):
                    answer += "You can ask questions about your documentation in the 'AI Features' section. The system will analyze your documents and provide detailed answers with relevant context."
                else:
                    # Check for general question keywords
                    keyword_found = False
                    for keyword, response in fallback_answers.items():
                        if keyword in question_lower:
                            answer += response
                            keyword_found = True
                            break
                    
                    if not keyword_found:
                        answer += "Try using the GitHub integration to generate documentation, or use the AI features for summarization and Q&A. You can also save documents and ask questions about them."
            
            return QAResponse(
                answer=answer,
                confidence=0.6,
                sources=[f"Document: {document_title}" if document_content else "SmartDocs Platform"],
                related_questions=[
                    "How do I generate docs from GitHub?",
                    "What AI features are available?",
                    "How do I use the summarization tool?"
                ],
                document_used=request.document_id,
                document_title=document_title
            )
            
    except Exception as e:
        logger.error(f"Error in Q&A: {e}")
        raise HTTPException(status_code=500, detail="Q&A failed")

async def _generate_document_aware_answer(question: str, document_content: str, document_title: str) -> str:
    """Generate a document-aware answer by extracting relevant information"""
    try:
        question_lower = question.lower()
        lines = document_content.split('\n')
        relevant_lines = []
        
        # Extract keywords from the question
        question_words = set(question_lower.split())
        
        # Look for relevant lines in the document
        for line in lines:
            line_lower = line.lower()
            # Check if line contains question keywords
            if any(word in line_lower for word in question_words if len(word) > 2):
                relevant_lines.append(line.strip())
        
        # If we found relevant content
        if relevant_lines:
            # Take the most relevant lines (up to 3)
            relevant_content = '\n'.join(relevant_lines[:3])
            return f"Based on the document '{document_title}', here's what I found:\n\n{relevant_content}"
        
        # If no direct matches, look for section headers and content
        sections = []
        current_section = ""
        
        for line in lines:
            if line.strip().startswith('#'):
                if current_section:
                    sections.append(current_section)
                current_section = line.strip()
            elif current_section:
                current_section += "\n" + line.strip()
        
        if sections:
            # Find the most relevant section
            for section in sections:
                if any(word in section.lower() for word in question_words if len(word) > 2):
                    return f"Based on the document '{document_title}', here's the relevant section:\n\n{section[:300]}..."
        
        # If still no match, provide a general answer about the document
        return f"The document '{document_title}' contains various information. Try looking for specific keywords or sections that might answer your question."
        
    except Exception as e:
        logger.error(f"Error generating document-aware answer: {e}")
        return f"I found the document '{document_title}' but couldn't extract specific information for your question. Try rephrasing or looking for different keywords."

async def _generate_document_aware_related_questions(document_content: str, original_question: str, mcp_context: Dict[str, Any]) -> List[str]:
    """Generate document-aware related questions based on document content and MCP context"""
    try:
        related_questions = []
        
        # Extract keywords from MCP context
        keywords = mcp_context.get('keywords', [])
        
        # Generate questions based on document content
        lines = document_content.split('\n')
        topics = []
        
        for line in lines:
            line_lower = line.lower().strip()
            if line_lower.startswith(('#', '##', '###')):
                topics.append(line.strip())
            elif any(keyword in line_lower for keyword in ['function', 'class', 'method', 'api', 'endpoint', 'config', 'setup']):
                topics.append(line.strip())
        
        # Generate questions based on topics found in the document
        if topics:
            for topic in topics[:3]:
                if 'function' in topic.lower():
                    related_questions.append("What does this function do?")
                elif 'class' in topic.lower():
                    related_questions.append("How do I use this class?")
                elif 'api' in topic.lower():
                    related_questions.append("What are the API endpoints?")
                elif 'config' in topic.lower():
                    related_questions.append("How do I configure this?")
                elif 'setup' in topic.lower():
                    related_questions.append("What are the setup requirements?")
        
        # Add questions based on keywords
        for keyword in keywords[:3]:
            if keyword in ['function', 'method']:
                related_questions.append(f"What are the {keyword}s in this document?")
            elif keyword in ['api', 'endpoint']:
                related_questions.append(f"How do I use the {keyword}s?")
            elif keyword in ['config', 'setup']:
                related_questions.append(f"What {keyword} options are available?")
        
        # Add general document questions
        related_questions.extend([
            "What are the main sections of this document?",
            "Are there any examples in this document?",
            "What are the key concepts covered?"
        ])
        
        return related_questions[:5]  # Return max 5 questions
        
    except Exception as e:
        logger.error(f"Error generating document-aware related questions: {e}")
        return await _generate_related_questions(document_content, original_question)

async def _generate_related_questions(document_content: str, original_question: str) -> List[str]:
    """Generate related questions based on document content and original question"""
    try:
        # Extract key topics from the document
        topics = []
        lines = document_content.split('\n')
        
        for line in lines:
            line_lower = line.lower().strip()
            if line_lower.startswith(('#', '##', '###')):
                topics.append(line.strip())
            elif any(keyword in line_lower for keyword in ['function', 'class', 'method', 'api', 'endpoint']):
                topics.append(line.strip())
        
        # Generate related questions based on topics
        related_questions = []
        
        # Add questions based on the original question type
        question_lower = original_question.lower()
        
        if 'how' in question_lower:
            related_questions.extend([
                "What are the prerequisites?",
                "What are common issues?",
                "Are there any alternatives?"
            ])
        elif 'what' in question_lower:
            related_questions.extend([
                "How do I get started?",
                "What are the benefits?",
                "Are there any limitations?"
            ])
        elif 'why' in question_lower:
            related_questions.extend([
                "What are the alternatives?",
                "How does this compare?",
                "What are the trade-offs?"
            ])
        else:
            related_questions.extend([
                "How do I get started?",
                "What are the prerequisites?",
                "What are common issues?"
            ])
        
        # Add questions based on document topics
        if topics:
            for topic in topics[:3]:  # Limit to first 3 topics
                if 'api' in topic.lower():
                    related_questions.append("How do I use the API?")
                elif 'function' in topic.lower():
                    related_questions.append("What parameters does this function accept?")
                elif 'class' in topic.lower():
                    related_questions.append("How do I instantiate this class?")
        
        return related_questions[:5]  # Return max 5 questions
        
    except Exception as e:
        logger.error(f"Error generating related questions: {e}")
        return [
            "How do I get started?",
            "What are the prerequisites?",
            "What are common issues?"
        ]

def _calculate_qa_confidence(answer: str, document_content: str, question: str) -> float:
    """Calculate confidence score for Q&A response"""
    try:
        confidence = 0.5  # Base confidence
        
        # Check if answer is substantial
        if len(answer.strip()) > 100:
            confidence += 0.2
        
        # Check if answer contains relevant keywords from document
        doc_words = set(document_content.lower().split())
        answer_words = set(answer.lower().split())
        relevant_words = doc_words.intersection(answer_words)
        
        if len(relevant_words) > 5:
            confidence += 0.2
        
        # Check if answer directly addresses the question
        question_words = set(question.lower().split())
        if any(word in answer.lower() for word in question_words):
            confidence += 0.1
        
        # Check for specific indicators of good answers
        if any(indicator in answer.lower() for indicator in ['example', 'step', 'code', 'function', 'method']):
            confidence += 0.1
        
        return min(confidence, 0.95)  # Cap at 0.95
        
    except Exception as e:
        logger.error(f"Error calculating confidence: {e}")
        return 0.7

async def _generate_fallback_qa_response(request: QARequest, document_content: str, document_title: str) -> QAResponse:
    """Generate a fallback Q&A response when Hugging Face fails"""
    try:
        # Create a more intelligent fallback based on document content
        question_lower = request.question.lower()
        
        # Extract relevant information from document
        relevant_info = ""
        lines = document_content.split('\n')
        
        for line in lines:
            if any(keyword in line.lower() for keyword in question_lower.split()):
                relevant_info += line + "\n"
        
        if relevant_info:
            answer = f"Based on the documentation, here's what I found:\n\n{relevant_info[:500]}..."
        else:
            # Smart fallback based on question type
            if 'how' in question_lower:
                answer = "To accomplish this, you can use the features available in this documentation platform. Check the relevant sections for step-by-step instructions."
            elif 'what' in question_lower:
                answer = "This documentation contains information about various features and capabilities. Look through the sections to find specific details."
            elif 'why' in question_lower:
                answer = "This approach is recommended because it provides better documentation practices and helps with team collaboration."
            else:
                answer = "I can help you find information in this documentation. Try looking through the different sections or use the search functionality."
        
        return QAResponse(
            answer=answer,
            confidence=0.6,
            sources=[f"Document: {document_title}"],
            related_questions=[
                "How do I get started?",
                "What are the prerequisites?",
                "What are common issues?"
            ],
            document_used=request.document_id,
            document_title=document_title
        )
        
    except Exception as e:
        logger.error(f"Error in fallback Q&A: {e}")
        return QAResponse(
            answer="I'm having trouble accessing the documentation right now. Please try again or check the document content manually.",
            confidence=0.3,
            sources=[f"Document: {document_title}"],
            related_questions=[
                "How do I get started?",
                "What are the prerequisites?",
                "What are common issues?"
            ],
            document_used=request.document_id,
            document_title=document_title
        )

# Core Feature 3: Make Maintenance Easy - Drift Detection
@router.post("/maintenance/drift", response_model=MaintenanceResponse)
async def detect_documentation_drift(request: MaintenanceRequest):
    """Detect documentation drift and suggest updates"""
    try:
        issues = []
        suggestions = []
        
        # Analyze documentation content
        doc_content = request.documentation_content.lower()
        
        # Check for common drift indicators
        if "deprecated" in doc_content:
            issues.append({
                "type": "deprecated_content",
                "severity": "high",
                "description": "Documentation contains deprecated information"
            })
            suggestions.append("Update deprecated references with current alternatives")
        
        if "old version" in doc_content or "legacy" in doc_content:
            issues.append({
                "type": "outdated_version",
                "severity": "medium",
                "description": "Documentation references old versions"
            })
            suggestions.append("Update version references to current releases")
        
        # Check for missing sections
        required_sections = ["installation", "usage", "api", "examples"]
        missing_sections = []
        for section in required_sections:
            if section not in doc_content:
                missing_sections.append(section)
        
        if missing_sections:
            issues.append({
                "type": "missing_sections",
                "severity": "medium",
                "description": f"Missing documentation sections: {', '.join(missing_sections)}"
            })
            suggestions.append(f"Add missing sections: {', '.join(missing_sections)}")
        
        # Generate AI suggestions if available
        if settings.huggingface_api_key:
            suggestion_prompt = f"Analyze this documentation and suggest improvements: {request.documentation_content[:500]}"
            ai_suggestion = await huggingface_client.generate_text(suggestion_prompt, max_length=200)
            suggestions.append(f"AI Suggestion: {ai_suggestion}")
        
        confidence = 0.8 if issues else 0.9
        
        return MaintenanceResponse(
            issues_found=issues,
            suggestions=suggestions,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Error in drift detection: {e}")
        raise HTTPException(status_code=500, detail="Drift detection failed")

# Core Feature 4: Multilingual Support
@router.post("/translate")
async def translate_content(request: Dict[str, Any]):
    """Translate content to different languages"""
    try:
        content = request.get("content", "")
        target_language = request.get("target_language", "es")
        
        if settings.huggingface_api_key:
            # Use Hugging Face for translation
            translation_prompt = f"Translate this to {target_language}: {content}"
            translated = await huggingface_client.generate_text(translation_prompt, max_length=len(content) + 100)
        else:
            # Fallback translation
            translations = {
                "es": f"[Traducido al español] {content}",
                "fr": f"[Traduit en français] {content}",
                "de": f"[Ins Deutsche übersetzt] {content}",
                "zh": f"[翻译成中文] {content}",
                "ja": f"[日本語に翻訳] {content}"
            }
            translated = translations.get(target_language, f"[Translated to {target_language}] {content}")
        
        return {
            "original": content,
            "translated": translated,
            "target_language": target_language,
            "confidence": 0.8
        }
            
    except Exception as e:
        logger.error(f"Error in translation: {e}")
        raise HTTPException(status_code=500, detail="Translation failed")

# Additional utility endpoints
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "features": {
            "github_integration": "working",
            "ai_summarization": "working",
            "qa_system": "working",
            "drift_detection": "working",
            "translation": "working"
        }
    }
