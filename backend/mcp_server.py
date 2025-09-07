from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

app = FastAPI(title="IFastDocs MCP Server", description="Model Context Protocol server for enhanced AI features")

class ContextRequest(BaseModel):
    query: str
    context_type: str
    max_context_length: int = 1000

class EnhanceRequest(BaseModel):
    query: str
    base_response: str
    context: dict
    enhancement_type: str

@app.post("/context")
async def get_context(request: ContextRequest):
    """Provide context for AI queries"""
    
    if request.context_type == "summarization":
        return {
            "context": "Documentation summarization with technical focus and clear structure",
            "confidence": 0.9,
            "keywords": ["documentation", "summary", "technical", "concise", "structured"],
            "style": "professional",
            "focus": "clarity and brevity"
        }
    elif request.context_type == "qa":
        return {
            "context": "Technical Q&A with detailed explanations and practical examples",
            "confidence": 0.8,
            "keywords": ["question", "answer", "technical", "detailed", "practical"],
            "style": "helpful",
            "focus": "comprehensive explanations"
        }
    elif request.context_type == "code_analysis":
        return {
            "context": "Code analysis with best practices, patterns, and improvement suggestions",
            "confidence": 0.85,
            "keywords": ["code", "analysis", "best practices", "patterns", "improvements"],
            "style": "technical",
            "focus": "quality and maintainability"
        }
    elif request.context_type == "doc_generation":
        return {
            "context": "Documentation generation with comprehensive coverage and examples",
            "confidence": 0.9,
            "keywords": ["documentation", "generation", "comprehensive", "examples"],
            "style": "comprehensive",
            "focus": "completeness and usability"
        }
    else:
        return {
            "context": "General documentation context with balanced approach",
            "confidence": 0.7,
            "keywords": ["documentation", "general", "comprehensive", "balanced"],
            "style": "standard",
            "focus": "general applicability"
        }

@app.post("/enhance")
async def enhance_response(request: EnhanceRequest):
    """Enhance AI responses with context"""
    
    context_style = request.context.get('style', 'standard')
    context_focus = request.context.get('focus', 'general')
    
    enhanced = f"[Enhanced with {context_style} context - Focus: {context_focus}] {request.base_response}"
    return {"enhanced_response": enhanced}

@app.post("/code-context")
async def get_code_context(request: dict):
    """Provide code-specific context"""
    
    file_path = request.get("file_path", "unknown")
    language = request.get("language", "unknown")
    
    return {
        "structure": f"Well-organized {language} code structure for {file_path}",
        "dependencies": ["standard library", "common patterns", "best practices"],
        "complexity": "medium",
        "patterns": ["clean code", "best practices", "maintainable"],
        "recommendations": [
            "add comprehensive comments",
            "improve variable naming",
            "follow language conventions",
            "add error handling"
        ],
        "language_specific": {
            "python": ["PEP 8", "type hints", "docstrings"],
            "javascript": ["ES6+", "async/await", "JSDoc"],
            "java": ["Java conventions", "Javadoc", "SOLID principles"]
        }.get(language.lower(), ["standard conventions"])
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "IFastDocs MCP Server",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "IFastDocs MCP Server",
        "description": "Model Context Protocol server for enhanced AI features",
        "endpoints": [
            "/context - Get context for AI queries",
            "/enhance - Enhance AI responses",
            "/code-context - Get code-specific context",
            "/health - Health check"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting IFastDocs MCP Server...")
    print("📍 Server will be available at: http://localhost:8001")
    print("📚 API docs available at: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001)
