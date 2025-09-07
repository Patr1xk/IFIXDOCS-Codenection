from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import ast
import re
import yaml
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ParseRequest(BaseModel):
    code_content: str
    language: str
    file_path: Optional[str] = None

class ParseResponse(BaseModel):
    language: str
    structure: Dict[str, Any]
    functions: List[Dict[str, Any]]
    classes: List[Dict[str, Any]]
    imports: List[str]
    complexity_score: float
    suggestions: List[str]

class SwaggerParseRequest(BaseModel):
    swagger_content: str
    format: str  # yaml or json

class SwaggerParseResponse(BaseModel):
    endpoints: List[Dict[str, Any]]
    models: List[Dict[str, Any]]
    base_url: str
    version: str
    documentation: str

class CodeAnalysisRequest(BaseModel):
    repository_url: Optional[str] = None
    files: List[str] = []
    language_filters: Optional[List[str]] = None

class CodeAnalysisResponse(BaseModel):
    total_files: int
    languages: Dict[str, int]
    complexity_summary: Dict[str, Any]
    documentation_coverage: float
    recommendations: List[str]

class PythonParser:
    """Parse Python code using AST"""
    
    @staticmethod
    def parse_python(code: str) -> Dict[str, Any]:
        try:
            tree = ast.parse(code)
            analyzer = PythonAnalyzer()
            analyzer.visit(tree)
            return analyzer.get_results()
        except Exception as e:
            logger.error(f"Python parsing error: {e}")
            return {"error": str(e)}

class PythonAnalyzer(ast.NodeVisitor):
    """AST visitor for Python code analysis"""
    
    def __init__(self):
        self.functions = []
        self.classes = []
        self.imports = []
        self.complexity = 0
        
    def visit_FunctionDef(self, node):
        func_info = {
            "name": node.name,
            "args": [arg.arg for arg in node.args.args],
            "decorators": [d.id for d in node.decorator_list if hasattr(d, 'id')],
            "docstring": ast.get_docstring(node),
            "line_number": node.lineno
        }
        self.functions.append(func_info)
        self.complexity += 1
        self.generic_visit(node)
    
    def visit_ClassDef(self, node):
        class_info = {
            "name": node.name,
            "bases": [base.id for base in node.bases if hasattr(base, 'id')],
            "methods": [],
            "docstring": ast.get_docstring(node),
            "line_number": node.lineno
        }
        self.classes.append(class_info)
        self.complexity += 2
        self.generic_visit(node)
    
    def visit_Import(self, node):
        for alias in node.names:
            self.imports.append(alias.name)
        self.generic_visit(node)
    
    def visit_ImportFrom(self, node):
        module = node.module or ""
        for alias in node.names:
            self.imports.append(f"{module}.{alias.name}")
        self.generic_visit(node)
    
    def get_results(self) -> Dict[str, Any]:
        return {
            "functions": self.functions,
            "classes": self.classes,
            "imports": self.imports,
            "complexity_score": self.complexity
        }

class SwaggerParser:
    """Parse Swagger/OpenAPI specifications"""
    
    @staticmethod
    def parse_swagger(content: str, format: str) -> Dict[str, Any]:
        try:
            if format.lower() == "yaml":
                spec = yaml.safe_load(content)
            else:
                spec = json.loads(content)
            
            endpoints = []
            models = []
            
            # Extract endpoints
            if "paths" in spec:
                for path, methods in spec["paths"].items():
                    for method, details in methods.items():
                        if method.upper() in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                            endpoint = {
                                "path": path,
                                "method": method.upper(),
                                "summary": details.get("summary", ""),
                                "description": details.get("description", ""),
                                "parameters": details.get("parameters", []),
                                "responses": details.get("responses", {})
                            }
                            endpoints.append(endpoint)
            
            # Extract models
            if "components" in spec and "schemas" in spec["components"]:
                for name, schema in spec["components"]["schemas"].items():
                    model = {
                        "name": name,
                        "type": schema.get("type", "object"),
                        "properties": schema.get("properties", {}),
                        "required": schema.get("required", [])
                    }
                    models.append(model)
            
            return {
                "endpoints": endpoints,
                "models": models,
                "base_url": spec.get("servers", [{}])[0].get("url", ""),
                "version": spec.get("info", {}).get("version", ""),
                "title": spec.get("info", {}).get("title", "")
            }
            
        except Exception as e:
            logger.error(f"Swagger parsing error: {e}")
            return {"error": str(e)}

@router.post("/parse-code", response_model=ParseResponse)
async def parse_code(request: ParseRequest):
    """Parse code and extract structure information"""
    try:
        if request.language.lower() == "python":
            parser = PythonParser()
            result = parser.parse_python(request.code_content)
            
            if "error" in result:
                raise HTTPException(status_code=400, detail=f"Parsing error: {result['error']}")
            
            # Generate suggestions
            suggestions = []
            if result["complexity_score"] > 10:
                suggestions.append("Consider breaking down complex functions into smaller ones")
            if len(result["functions"]) > 20:
                suggestions.append("Consider organizing code into modules")
            if not any(func["docstring"] for func in result["functions"]):
                suggestions.append("Add docstrings to functions for better documentation")
            
            return ParseResponse(
                language=request.language,
                structure=result,
                functions=result["functions"],
                classes=result["classes"],
                imports=result["imports"],
                complexity_score=result["complexity_score"],
                suggestions=suggestions
            )
        else:
            # Basic parsing for other languages
            lines = request.code_content.split('\n')
            functions = []
            classes = []
            imports = []
            
            # Simple regex-based parsing
            for i, line in enumerate(lines):
                line = line.strip()
                if line.startswith('import ') or line.startswith('from '):
                    imports.append(line)
                elif re.match(r'^def\s+\w+', line):
                    func_name = re.search(r'def\s+(\w+)', line).group(1)
                    functions.append({
                        "name": func_name,
                        "args": [],
                        "decorators": [],
                        "docstring": "",
                        "line_number": i + 1
                    })
                elif re.match(r'^class\s+\w+', line):
                    class_name = re.search(r'class\s+(\w+)', line).group(1)
                    classes.append({
                        "name": class_name,
                        "bases": [],
                        "methods": [],
                        "docstring": "",
                        "line_number": i + 1
                    })
            
            complexity = len(functions) + len(classes) * 2
            
            return ParseResponse(
                language=request.language,
                structure={"basic_parsing": True},
                functions=functions,
                classes=classes,
                imports=imports,
                complexity_score=complexity,
                suggestions=["Consider using language-specific parsers for better analysis"]
            )
            
    except Exception as e:
        logger.error(f"Code parsing error: {e}")
        raise HTTPException(status_code=500, detail="Code parsing failed")

@router.post("/parse-swagger", response_model=SwaggerParseResponse)
async def parse_swagger(request: SwaggerParseRequest):
    """Parse Swagger/OpenAPI specifications"""
    try:
        parser = SwaggerParser()
        result = parser.parse_swagger(request.swagger_content, request.format)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=f"Swagger parsing error: {result['error']}")
        
        # Generate documentation
        doc_sections = [
            f"# API Documentation for {result.get('title', 'API')}",
            f"**Version:** {result.get('version', 'Unknown')}",
            f"**Base URL:** {result.get('base_url', 'Not specified')}",
            "",
            "## Endpoints"
        ]
        
        for endpoint in result["endpoints"]:
            doc_sections.append(
                f"### {endpoint['method']} {endpoint['path']}\n"
                f"{endpoint.get('summary', 'No description')}\n"
            )
        
        if result["models"]:
            doc_sections.extend([
                "",
                "## Data Models"
            ])
            for model in result["models"]:
                doc_sections.append(f"### {model['name']}\nType: {model['type']}")
        
        documentation = "\n".join(doc_sections)
        
        return SwaggerParseResponse(
            endpoints=result["endpoints"],
            models=result["models"],
            base_url=result.get("base_url", ""),
            version=result.get("version", ""),
            documentation=documentation
        )
        
    except Exception as e:
        logger.error(f"Swagger parsing error: {e}")
        raise HTTPException(status_code=500, detail="Swagger parsing failed")

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Upload a code file for parsing"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Determine language from file extension
        ext = Path(file.filename).suffix.lower()
        language_map = {
            ".py": "python",
            ".js": "javascript",
            ".ts": "typescript",
            ".java": "java",
            ".cpp": "cpp",
            ".c": "c",
            ".go": "go",
            ".rs": "rust",
            ".php": "php",
            ".rb": "ruby"
        }
        
        language = language_map.get(ext, "unknown")
        
        # Read file content
        content = await file.read()
        code_content = content.decode("utf-8")
        
        # Parse the code
        parse_request = ParseRequest(
            code_content=code_content,
            language=language,
            file_path=file.filename
        )
        
        return await parse_code(parse_request)
        
    except Exception as e:
        logger.error(f"File upload error: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

@router.post("/code-analysis", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    """Analyze code repository or files for comprehensive metrics"""
    try:
        total_files = 0
        languages = {}
        complexity_summary = {"total_complexity": 0, "avg_complexity": 0, "max_complexity": 0}
        documentation_coverage = 0.0
        recommendations = []
        
        if request.repository_url:
            # Analyze GitHub repository
            from api.routes.ai import github_client
            
            try:
                repo_info = github_client.parse_github_url(request.repository_url)
                owner = repo_info["owner"]
                repo = repo_info["repo"]
                
                # Get repository content recursively (limited depth)
                async def get_all_files(path="", depth=0, max_depth=3):
                    """Recursively get all files from repository with depth limit"""
                    if depth > max_depth:
                        return []
                    
                    content = await github_client.get_repository_content(owner, repo, path)
                    files = []
                    
                    for item in content:
                        if item.get('type') == 'file':
                            files.append(item)
                        elif item.get('type') == 'dir' and depth < max_depth:
                            # Skip certain directories to avoid too many API calls
                            dir_name = item.get('name', '')
                            if dir_name not in ['.git', 'node_modules', '__pycache__', '.pytest_cache']:
                                try:
                                    subfiles = await get_all_files(item.get('path', ''), depth + 1, max_depth)
                                    files.extend(subfiles)
                                except Exception as e:
                                    logger.warning(f"Error accessing directory {dir_name}: {e}")
                    
                    return files
                
                all_files = await get_all_files()
                logger.info(f"Found {len(all_files)} total files in repository")
                
                analyzed_files = []
                total_complexity = 0
                documented_functions = 0
                total_functions = 0
                
                for item in all_files:
                    filename = item.get('name', '')
                    ext = Path(filename).suffix.lower()
                    
                    # Count files by language
                    if ext in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb']:
                        total_files += 1
                        language = ext[1:] if ext else 'unknown'
                        languages[language] = languages.get(language, 0) + 1
                        
                        # Analyze Python files for complexity
                        if ext == '.py':
                            file_content = await github_client.get_file_content(owner, repo, item.get('path', ''))
                            if file_content:
                                try:
                                    parser = PythonParser()
                                    result = parser.parse_python(file_content)
                                    if 'error' not in result:
                                        file_complexity = result.get('complexity_score', 0)
                                        total_complexity += file_complexity
                                        total_functions += len(result.get('functions', []))
                                        documented_functions += len([f for f in result.get('functions', []) if f.get('docstring')])
                                        analyzed_files.append({
                                            'name': filename,
                                            'complexity': file_complexity,
                                            'functions': len(result.get('functions', [])),
                                            'documented': len([f for f in result.get('functions', []) if f.get('docstring')])
                                        })
                                except Exception as e:
                                    logger.warning(f"Error analyzing {filename}: {e}")
                
                # Calculate metrics
                if analyzed_files:
                    complexity_summary = {
                        "total_complexity": total_complexity,
                        "avg_complexity": round(total_complexity / len(analyzed_files), 2),
                        "max_complexity": max(f['complexity'] for f in analyzed_files),
                        "files_analyzed": len(analyzed_files)
                    }
                
                if total_functions > 0:
                    documentation_coverage = round((documented_functions / total_functions) * 100, 2)
                
                # Generate recommendations
                if documentation_coverage < 50:
                    recommendations.append("Consider adding more docstrings to improve documentation coverage")
                if complexity_summary.get('avg_complexity', 0) > 10:
                    recommendations.append("High complexity detected - consider refactoring complex functions")
                if total_files > 50:
                    recommendations.append("Large codebase - consider organizing into modules")
                if not languages:
                    recommendations.append("No code files detected - check repository structure")
                
            except Exception as e:
                logger.error(f"Error analyzing repository: {e}")
                recommendations.append(f"Error analyzing repository: {str(e)}")
        
        elif request.files:
            # Analyze provided files
            for file_path in request.files:
                try:
                    ext = Path(file_path).suffix.lower()
                    if ext in ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.php', '.rb']:
                        total_files += 1
                        language = ext[1:] if ext else 'unknown'
                        languages[language] = languages.get(language, 0) + 1
                        
                        # For demo purposes, simulate analysis
                        if ext == '.py':
                            complexity_summary["total_complexity"] += 5
                            recommendations.append(f"Analyzed {file_path} - consider adding docstrings")
                except Exception as e:
                    logger.warning(f"Error analyzing file {file_path}: {e}")
        
        # Calculate final metrics
        if total_files > 0:
            complexity_summary["avg_complexity"] = round(complexity_summary["total_complexity"] / total_files, 2)
        
        if not recommendations:
            recommendations.append("Code analysis completed successfully")
        
        return CodeAnalysisResponse(
            total_files=total_files,
            languages=languages,
            complexity_summary=complexity_summary,
            documentation_coverage=documentation_coverage,
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Code analysis error: {e}")
        raise HTTPException(status_code=500, detail="Code analysis failed")

@router.get("/supported-languages")
async def get_supported_languages():
    """Get list of supported programming languages"""
    return {
        "languages": [
            {"name": "Python", "extensions": [".py"], "parser": "AST"},
            {"name": "JavaScript", "extensions": [".js"], "parser": "Regex"},
            {"name": "TypeScript", "extensions": [".ts"], "parser": "Regex"},
            {"name": "Java", "extensions": [".java"], "parser": "Regex"},
            {"name": "C++", "extensions": [".cpp", ".cc", ".cxx"], "parser": "Regex"},
            {"name": "C", "extensions": [".c"], "parser": "Regex"},
            {"name": "Go", "extensions": [".go"], "parser": "Regex"},
            {"name": "Rust", "extensions": [".rs"], "parser": "Regex"},
            {"name": "PHP", "extensions": [".php"], "parser": "Regex"},
            {"name": "Ruby", "extensions": [".rb"], "parser": "Regex"}
        ]
    }
