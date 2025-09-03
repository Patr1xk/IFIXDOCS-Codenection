from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
from datetime import datetime
import logging
from core.mcp_client import mcp_client

logger = logging.getLogger(__name__)

router = APIRouter()

class Document(BaseModel):
    doc_id: str
    title: str
    content: str
    content_type: str  # markdown, html, rst, etc.
    language: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    author: str
    version: str
    status: str  # draft, published, archived

class CreateDocumentRequest(BaseModel):
    title: str
    content: str
    content_type: str = "markdown"
    language: str = "en"
    tags: List[str] = []
    author: str = "anonymous"
    version: str = "1.0.0"

class UpdateDocumentRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    version: Optional[str] = None
    status: Optional[str] = None

class DocumentSearchRequest(BaseModel):
    query: str
    language: Optional[str] = None
    tags: Optional[List[str]] = None
    content_type: Optional[str] = None
    limit: int = 20

class DocumentSearchResponse(BaseModel):
    results: List[Document]
    total: int
    query: str
    search_time: float

class DocumentTemplate(BaseModel):
    template_id: str
    name: str
    description: str
    content: str
    variables: List[str]
    category: str

class DocumentManager:
    """Manage documentation content and metadata"""
    
    def __init__(self):
        self.documents = {}
        self.templates = self._load_default_templates()
        self.doc_counter = 0
    
    def _load_default_templates(self) -> Dict[str, DocumentTemplate]:
        """Load default document templates"""
        return {
            "api-doc": DocumentTemplate(
                template_id="api-doc",
                name="API Documentation",
                description="Standard template for API documentation",
                content="""# {title}

## Overview
{overview}

## Authentication
{authentication}

## Endpoints

### {endpoint_name}
**Method:** {method}  
**Path:** {path}

**Description:** {description}

**Parameters:**
{parameters}

**Response:**
```json
{response_example}
```

## Error Codes
{error_codes}
""",
                variables=["title", "overview", "authentication", "endpoint_name", "method", "path", "description", "parameters", "response_example", "error_codes"],
                category="api"
            ),
            "readme": DocumentTemplate(
                template_id="readme",
                name="README Template",
                description="Standard README template for projects",
                content="""# {project_name}

{description}

## Features
{features}

## Installation
{installation}

## Usage
{usage}

## API Reference
{api_reference}

## Contributing
{contributing}

## License
{license}
""",
                variables=["project_name", "description", "features", "installation", "usage", "api_reference", "contributing", "license"],
                category="project"
            ),
            "tutorial": DocumentTemplate(
                template_id="tutorial",
                name="Tutorial Template",
                description="Step-by-step tutorial template",
                content="""# {tutorial_title}

## Prerequisites
{prerequisites}

## Overview
{overview}

## Step 1: {step1_title}
{step1_content}

## Step 2: {step2_title}
{step2_content}

## Step 3: {step3_title}
{step3_content}

## Summary
{summary}

## Next Steps
{next_steps}
""",
                variables=["tutorial_title", "prerequisites", "overview", "step1_title", "step1_content", "step2_title", "step2_content", "step3_title", "step3_content", "summary", "next_steps"],
                category="tutorial"
            )
        }
    
    def create_document(self, request: CreateDocumentRequest) -> Document:
        """Create a new document"""
        self.doc_counter += 1
        doc_id = f"doc_{self.doc_counter}"
        
        now = datetime.now()
        document = Document(
            doc_id=doc_id,
            title=request.title,
            content=request.content,
            content_type=request.content_type,
            language=request.language,
            tags=request.tags,
            created_at=now,
            updated_at=now,
            author=request.author,
            version=request.version,
            status="draft"
        )
        
        self.documents[doc_id] = document
        return document
    
    def get_document(self, doc_id: str) -> Optional[Document]:
        """Get a document by ID"""
        return self.documents.get(doc_id)
    
    def update_document(self, doc_id: str, request: UpdateDocumentRequest) -> Optional[Document]:
        """Update an existing document"""
        if doc_id not in self.documents:
            return None
        
        document = self.documents[doc_id]
        
        if request.title is not None:
            document.title = request.title
        if request.content is not None:
            document.content = request.content
        if request.tags is not None:
            document.tags = request.tags
        if request.version is not None:
            document.version = request.version
        if request.status is not None:
            document.status = request.status
        
        document.updated_at = datetime.now()
        return document
    
    def delete_document(self, doc_id: str) -> bool:
        """Delete a document"""
        if doc_id in self.documents:
            del self.documents[doc_id]
            return True
        return False
    
    def search_documents(self, query: str, language: Optional[str] = None, tags: Optional[List[str]] = None, content_type: Optional[str] = None, limit: int = 20) -> List[Document]:
        """Search documents based on criteria"""
        results = []
        
        for doc in self.documents.values():
            # Check language filter
            if language and doc.language != language:
                continue
            
            # Check content type filter
            if content_type and doc.content_type != content_type:
                continue
            
            # Check tags filter
            if tags and not any(tag in doc.tags for tag in tags):
                continue
            
            # Check query match
            query_lower = query.lower()
            if (query_lower in doc.title.lower() or 
                query_lower in doc.content.lower() or 
                any(query_lower in tag.lower() for tag in doc.tags)):
                results.append(doc)
        
        # Sort by relevance (simple implementation)
        results.sort(key=lambda x: x.updated_at, reverse=True)
        
        return results[:limit]
    
    def get_all_documents(self, language: Optional[str] = None, status: Optional[str] = None) -> List[Document]:
        """Get all documents with optional filters"""
        results = []
        
        for doc in self.documents.values():
            if language and doc.language != language:
                continue
            if status and doc.status != status:
                continue
            results.append(doc)
        
        return sorted(results, key=lambda x: x.updated_at, reverse=True)
    
    def get_templates(self, category: Optional[str] = None) -> List[DocumentTemplate]:
        """Get document templates"""
        if category:
            return [t for t in self.templates.values() if t.category == category]
        return list(self.templates.values())
    
    def get_template(self, template_id: str) -> Optional[DocumentTemplate]:
        """Get a specific template"""
        return self.templates.get(template_id)

# Global instance
doc_manager = DocumentManager()

@router.post("/", response_model=Document)
async def create_document(request: CreateDocumentRequest):
    """Create a new document"""
    try:
        document = doc_manager.create_document(request)
        return document
    except Exception as e:
        logger.error(f"Error creating document: {e}")
        raise HTTPException(status_code=500, detail="Failed to create document")

@router.get("/{doc_id}", response_model=Document)
async def get_document(doc_id: str):
    """Get a document by ID"""
    try:
        document = doc_manager.get_document(doc_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except Exception as e:
        logger.error(f"Error getting document {doc_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get document")

@router.put("/{doc_id}", response_model=Document)
async def update_document(doc_id: str, request: UpdateDocumentRequest):
    """Update an existing document"""
    try:
        document = doc_manager.update_document(doc_id, request)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document
    except Exception as e:
        logger.error(f"Error updating document {doc_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update document")

@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document"""
    try:
        success = doc_manager.delete_document(doc_id)
        if not success:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"status": "deleted", "doc_id": doc_id}
    except Exception as e:
        logger.error(f"Error deleting document {doc_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete document")

@router.post("/search", response_model=DocumentSearchResponse)
async def search_documents(request: DocumentSearchRequest):
    """Search documents"""
    try:
        import time
        start_time = time.time()
        
        results = doc_manager.search_documents(
            query=request.query,
            language=request.language,
            tags=request.tags,
            content_type=request.content_type,
            limit=request.limit
        )
        
        search_time = time.time() - start_time
        
        return DocumentSearchResponse(
            results=results,
            total=len(results),
            query=request.query,
            search_time=search_time
        )
    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@router.get("/", response_model=List[Document])
async def list_documents(language: Optional[str] = None, status: Optional[str] = None):
    """List all documents with optional filters"""
    try:
        documents = doc_manager.get_all_documents(language=language, status=status)
        return documents
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail="Failed to list documents")

@router.get("/templates", response_model=List[DocumentTemplate])
async def get_document_templates(category: Optional[str] = None):
    """Get document templates"""
    try:
        templates = doc_manager.get_templates(category=category)
        return templates
    except Exception as e:
        logger.error(f"Error getting templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get templates")

@router.get("/templates/{template_id}", response_model=DocumentTemplate)
async def get_document_template(template_id: str):
    """Get a specific document template"""
    try:
        template = doc_manager.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template
    except Exception as e:
        logger.error(f"Error getting template {template_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template")

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    language: str = Form("en"),
    tags: str = Form(""),
    author: str = Form("anonymous")
):
    """Upload a document file"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Read file content
        content = await file.read()
        content_str = content.decode("utf-8")
        
        # Determine content type from file extension
        ext = os.path.splitext(file.filename)[1].lower()
        content_type_map = {
            ".md": "markdown",
            ".html": "html",
            ".htm": "html",
            ".rst": "rst",
            ".txt": "text"
        }
        content_type = content_type_map.get(ext, "text")
        
        # Parse tags
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()] if tags else []
        
        # Create document
        request = CreateDocumentRequest(
            title=title,
            content=content_str,
            content_type=content_type,
            language=language,
            tags=tag_list,
            author=author
        )
        
        document = doc_manager.create_document(request)
        return {"status": "uploaded", "document": document.dict()}
        
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")

@router.get("/stats")
async def get_document_stats():
    """Get document statistics"""
    try:
        total_docs = len(doc_manager.documents)
        languages = {}
        content_types = {}
        statuses = {}
        
        for doc in doc_manager.documents.values():
            # Count by language
            if doc.language not in languages:
                languages[doc.language] = 0
            languages[doc.language] += 1
            
            # Count by content type
            if doc.content_type not in content_types:
                content_types[doc.content_type] = 0
            content_types[doc.content_type] += 1
            
            # Count by status
            if doc.status not in statuses:
                statuses[doc.status] = 0
            statuses[doc.status] += 1
        
        return {
            "total_documents": total_docs,
            "languages": languages,
            "content_types": content_types,
            "statuses": statuses,
            "templates_available": len(doc_manager.templates)
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

@router.get("/health")
async def docs_health_check():
    """Check documentation services health"""
    return {
        "status": "healthy",
        "total_documents": len(doc_manager.documents),
        "templates_available": len(doc_manager.templates),
        "features": ["create", "read", "update", "delete", "search", "templates", "upload"]
    }
