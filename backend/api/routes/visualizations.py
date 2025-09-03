from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import re
import logging
import json
from datetime import datetime
import ast

logger = logging.getLogger(__name__)

router = APIRouter()

class FlowDiagramRequest(BaseModel):
    code: str
    language: str = "python"
    diagram_type: str = "flowchart"
    document_id: Optional[str] = None  # ID of saved document to use as source
    document_title: Optional[str] = None  # Title of document for reference

class FlowDiagramResponse(BaseModel):
    diagram: str
    mermaid_code: str
    nodes: int
    edges: int
    complexity: str
    document_used: Optional[str] = None
    document_title: Optional[str] = None
    analysis: Dict[str, Any] = {}

class APICallGraphRequest(BaseModel):
    code: str
    language: str = "python"
    document_id: Optional[str] = None
    document_title: Optional[str] = None

class APICallGraphResponse(BaseModel):
    diagram: str
    mermaid_code: str
    nodes: int
    edges: int
    api_endpoints: List[str]
    external_services: List[str]
    internal_functions: List[str]
    document_used: Optional[str] = None
    document_title: Optional[str] = None

class ChangelogRequest(BaseModel):
    content: str
    changelog_type: str = "semantic"  # semantic, chronological, feature-based
    document_id: Optional[str] = None
    document_title: Optional[str] = None

class ChangelogResponse(BaseModel):
    changelog: str
    mermaid_code: str
    version_history: List[Dict[str, Any]]
    total_changes: int
    document_used: Optional[str] = None
    document_title: Optional[str] = None

class VisualizationGenerator:
    """Generate comprehensive visualizations from code with MCP integration"""
    
    def generate_flow_diagram(self, code: str, language: str, diagram_type: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> FlowDiagramResponse:
        """Generate comprehensive flow diagram from code"""
        try:
            # Get document content if document_id is provided
            if document_id:
                try:
                    # Import here to avoid circular imports
                    from api.routes.docs import doc_manager
                    document = doc_manager.get_document(document_id)
                    if document:
                        # Use document content instead of provided code
                        code = document.content
                        document_title = document.title
                        logger.info(f"Using document '{document_title}' for flow diagram")
                    else:
                        logger.warning(f"Document with ID {document_id} not found")
                except Exception as e:
                    logger.error(f"Error fetching document: {e}")
            
            if language == "python":
                result = self._generate_python_flow(code, diagram_type)
            elif language == "javascript":
                result = self._generate_javascript_flow(code, diagram_type)
            else:
                result = self._generate_generic_flow(code, diagram_type)
            
            # Add document information to response
            result.document_used = document_id
            result.document_title = document_title
            return result
        except Exception as e:
            logger.error(f"Error generating flow diagram: {e}")
            fallback = self._generate_fallback_flow()
            fallback.document_used = document_id
            fallback.document_title = document_title
            return fallback
    
    def _generate_python_flow(self, code: str, diagram_type: str) -> FlowDiagramResponse:
        """Generate comprehensive Python flow diagram"""
        try:
            # Extract function definitions with parameters
            function_pattern = r'def\s+(\w+)\s*\(([^)]*)\)'
            functions = re.findall(function_pattern, code)
            
            # Extract class definitions with inheritance
            class_pattern = r'class\s+(\w+)(?:\s*\(([^)]*)\))?'
            classes = re.findall(class_pattern, code)
            
            # Extract control flow keywords with context
            control_pattern = r'\b(if|elif|else|for|while|try|except|finally|with|async|await)\b'
            controls = re.findall(control_pattern, code)
            
            # Extract imports
            import_pattern = r'(?:from\s+(\w+)\s+import|import\s+(\w+))'
            imports = re.findall(import_pattern, code)
            
            # Extract variable assignments
            var_pattern = r'(\w+)\s*='
            variables = re.findall(var_pattern, code)
            
            nodes = []
            edges = []
            analysis = {
                "functions": [],
                "classes": [],
                "control_structures": [],
                "imports": [],
                "variables": []
            }
            
            # Add functions with parameters
            for func_name, params in functions:
                param_list = [p.strip() for p in params.split(',') if p.strip()]
                node_label = f"{func_name}({', '.join(param_list[:3])}{'...' if len(param_list) > 3 else ''})"
                nodes.append(f'"{node_label}"')
                analysis["functions"].append({"name": func_name, "params": param_list})
            
            # Add classes with inheritance
            for class_name, inheritance in classes:
                if inheritance:
                    node_label = f"{class_name}({inheritance})"
                else:
                    node_label = class_name
                nodes.append(f'"{node_label}"')
                analysis["classes"].append({"name": class_name, "inheritance": inheritance})
            
            # Add control structures
            for control in controls:
                nodes.append(f'"{control}"')
                analysis["control_structures"].append(control)
            
            # Add imports
            for imp in imports:
                module = imp[0] if imp[0] else imp[1]
                if module:
                    nodes.append(f'"{module}"')
                    analysis["imports"].append(module)
            
            # Add key variables
            for var in variables[:10]:  # Limit to first 10 variables
                if var not in ['self', 'cls']:
                    nodes.append(f'"{var}"')
                    analysis["variables"].append(var)
            
            # Create edges between related elements
            for i, func in enumerate(functions):
                func_name = func[0]
                # Connect functions to their imports
                for imp in imports:
                    module = imp[0] if imp[0] else imp[1]
                    if module and module in code:
                        edges.append(f'"{func_name}" --> "{module}"')
            
            if diagram_type == "flowchart":
                mermaid_code = f"""
graph TD
    {chr(10).join(nodes)}
    {chr(10).join(edges)}
"""
            else:
                mermaid_code = f"""
sequenceDiagram
    participant User
    participant System
    {chr(10).join([f'User->>System: {node}' for node in nodes[:5]])}
"""
            
            return FlowDiagramResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=len(edges),
                complexity="High" if len(nodes) > 10 else "Medium" if len(nodes) > 5 else "Simple",
                analysis=analysis
            )
        except Exception as e:
            logger.error(f"Error in Python flow generation: {e}")
            return self._generate_fallback_flow()
    
    def _generate_javascript_flow(self, code: str, diagram_type: str) -> FlowDiagramResponse:
        """Generate comprehensive JavaScript flow diagram"""
        try:
            # Extract function definitions
            function_pattern = r'function\s+(\w+)|(\w+)\s*[:=]\s*function|(\w+)\s*[:=]\s*\([^)]*\)\s*=>'
            functions = re.findall(function_pattern, code)
            
            # Extract class definitions
            class_pattern = r'class\s+(\w+)'
            classes = re.findall(class_pattern, code)
            
            # Extract async functions
            async_pattern = r'async\s+function\s+(\w+)'
            async_funcs = re.findall(async_pattern, code)
            
            # Extract arrow functions
            arrow_pattern = r'(\w+)\s*[:=]\s*\([^)]*\)\s*=>'
            arrows = re.findall(arrow_pattern, code)
            
            # Extract imports/exports
            import_pattern = r'(?:import|export)\s+(?:.*?from\s+)?[\'"]([^\'"]+)[\'"]'
            imports = re.findall(import_pattern, code)
            
            nodes = []
            edges = []
            analysis = {
                "functions": [],
                "classes": [],
                "async_functions": [],
                "arrow_functions": [],
                "imports": []
            }
            
            # Add functions
            for func in functions:
                func_name = next(name for name in func if name)
                nodes.append(f'"{func_name}"')
                analysis["functions"].append(func_name)
            
            # Add classes
            for cls in classes:
                nodes.append(f'"{cls}"')
                analysis["classes"].append(cls)
            
            # Add async functions
            for async_func in async_funcs:
                nodes.append(f'"{async_func} (async)"')
                analysis["async_functions"].append(async_func)
            
            # Add arrow functions
            for arrow in arrows:
                nodes.append(f'"{arrow} (arrow)"')
                analysis["arrow_functions"].append(arrow)
            
            # Add imports
            for imp in imports:
                nodes.append(f'"{imp}"')
                analysis["imports"].append(imp)
            
            # Look for function calls and create edges
            call_pattern = r'(\w+)\s*\('
            calls = re.findall(call_pattern, code)
            
            for call in calls:
                if call in [func[0] for func in functions if func[0]]:
                    edges.append(f'"{call}" --> "{call}"')
            
            mermaid_code = f"""
graph TD
    {chr(10).join(nodes)}
    {chr(10).join(edges)}
"""
            
            return FlowDiagramResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=len(edges),
                complexity="High" if len(nodes) > 10 else "Medium" if len(nodes) > 5 else "Simple",
                analysis=analysis
            )
        except Exception as e:
            logger.error(f"Error in JavaScript flow generation: {e}")
            return self._generate_fallback_flow()
    
    def _generate_generic_flow(self, code: str, diagram_type: str) -> FlowDiagramResponse:
        """Generate comprehensive generic flow diagram"""
        try:
            lines = code.split('\n')
            nodes = []
            analysis = {
                "keywords": [],
                "structures": []
            }
            
            for i, line in enumerate(lines):
                line_lower = line.lower().strip()
                if any(keyword in line_lower for keyword in ['function', 'def', 'class', 'if', 'for', 'while', 'try', 'catch', 'switch', 'case']):
                    node_label = f"{line.strip()[:30]}..."
                    nodes.append(f'"{node_label}"')
                    analysis["keywords"].append(line.strip())
                
                # Look for structural patterns
                if line_lower.startswith(('if', 'for', 'while', 'try', 'switch')):
                    analysis["structures"].append(line.strip())
            
            mermaid_code = f"""
graph TD
    {chr(10).join(nodes)}
"""
            
            return FlowDiagramResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=0,
                complexity="Medium" if len(nodes) > 5 else "Simple",
                analysis=analysis
            )
        except Exception as e:
            logger.error(f"Error in generic flow generation: {e}")
            return self._generate_fallback_flow()
    
    def generate_api_call_graph(self, code: str, language: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> APICallGraphResponse:
        """Generate API call graph from code"""
        try:
            # Get document content if document_id is provided
            if document_id:
                try:
                    from api.routes.docs import doc_manager
                    document = doc_manager.get_document(document_id)
                    if document:
                        code = document.content
                        document_title = document.title
                except Exception as e:
                    logger.error(f"Error fetching document: {e}")
            
            if language == "python":
                return self._generate_python_api_graph(code)
            elif language == "javascript":
                return self._generate_javascript_api_graph(code)
            else:
                return self._generate_generic_api_graph(code)
        except Exception as e:
            logger.error(f"Error generating API call graph: {e}")
            return self._generate_fallback_api_graph()
    
    def _generate_python_api_graph(self, code: str) -> APICallGraphResponse:
        """Generate Python API call graph"""
        try:
            # Extract API endpoints (FastAPI, Flask, Django patterns)
            endpoint_patterns = [
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'@(?:app|router)\.route\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'path\s*\(\s*[\'"]([^\'"]+)[\'"]',
            ]
            
            api_endpoints = []
            for pattern in endpoint_patterns:
                matches = re.findall(pattern, code)
                api_endpoints.extend(matches)
            
            # Extract external service calls
            external_patterns = [
                r'requests\.(?:get|post|put|delete)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'httpx\.(?:get|post|put|delete)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'urllib\.request\.urlopen\s*\(\s*[\'"]([^\'"]+)[\'"]',
            ]
            
            external_services = []
            for pattern in external_patterns:
                matches = re.findall(pattern, code)
                external_services.extend(matches)
            
            # Extract internal function calls
            function_pattern = r'def\s+(\w+)'
            internal_functions = re.findall(function_pattern, code)
            
            # Extract database calls
            db_patterns = [
                r'\.(?:query|filter|get|all|first|count)\s*\(',
                r'\.(?:save|update|delete|insert)\s*\(',
            ]
            
            db_calls = []
            for pattern in db_patterns:
                matches = re.findall(pattern, code)
                db_calls.extend(matches)
            
            nodes = []
            edges = []
            
            # Add API endpoints
            for endpoint in api_endpoints:
                nodes.append(f'"{endpoint}"')
            
            # Add external services
            for service in external_services:
                nodes.append(f'"{service}"')
            
            # Add internal functions
            for func in internal_functions[:10]:  # Limit to first 10
                nodes.append(f'"{func}"')
            
            # Create edges
            for endpoint in api_endpoints:
                for func in internal_functions:
                    if func in code:
                        edges.append(f'"{endpoint}" --> "{func}"')
            
            mermaid_code = f"""
graph TD
    subgraph "API Endpoints"
        {chr(10).join([f'"{ep}"' for ep in api_endpoints])}
    end
    subgraph "External Services"
        {chr(10).join([f'"{es}"' for es in external_services])}
    end
    subgraph "Internal Functions"
        {chr(10).join([f'"{func}"' for func in internal_functions[:10]])}
    end
    {chr(10).join(edges)}
"""
            
            return APICallGraphResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=len(edges),
                api_endpoints=api_endpoints,
                external_services=external_services,
                internal_functions=internal_functions,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in Python API graph generation: {e}")
            return self._generate_fallback_api_graph()
    
    def _generate_javascript_api_graph(self, code: str) -> APICallGraphResponse:
        """Generate JavaScript API call graph"""
        try:
            # Extract API endpoints (Express, Axios patterns)
            endpoint_patterns = [
                r'\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'router\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
            ]
            
            api_endpoints = []
            for pattern in endpoint_patterns:
                matches = re.findall(pattern, code)
                api_endpoints.extend(matches)
            
            # Extract external service calls
            external_patterns = [
                r'fetch\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'axios\.(?:get|post|put|delete)\s*\(\s*[\'"]([^\'"]+)[\'"]',
            ]
            
            external_services = []
            for pattern in external_patterns:
                matches = re.findall(pattern, code)
                external_services.extend(matches)
            
            # Extract function definitions
            function_pattern = r'function\s+(\w+)|(\w+)\s*[:=]\s*function|(\w+)\s*[:=]\s*\([^)]*\)\s*=>'
            functions = re.findall(function_pattern, code)
            internal_functions = [next(name for name in func if name) for func in functions]
            
            nodes = []
            edges = []
            
            # Add nodes
            for endpoint in api_endpoints:
                nodes.append(f'"{endpoint}"')
            for service in external_services:
                nodes.append(f'"{service}"')
            for func in internal_functions[:10]:
                nodes.append(f'"{func}"')
            
            # Create edges
            for endpoint in api_endpoints:
                for func in internal_functions:
                    if func in code:
                        edges.append(f'"{endpoint}" --> "{func}"')
            
            mermaid_code = f"""
graph TD
    subgraph "API Endpoints"
        {chr(10).join([f'"{ep}"' for ep in api_endpoints])}
    end
    subgraph "External Services"
        {chr(10).join([f'"{es}"' for es in external_services])}
    end
    subgraph "Internal Functions"
        {chr(10).join([f'"{func}"' for func in internal_functions[:10]])}
    end
    {chr(10).join(edges)}
"""
            
            return APICallGraphResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=len(edges),
                api_endpoints=api_endpoints,
                external_services=external_services,
                internal_functions=internal_functions,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in JavaScript API graph generation: {e}")
            return self._generate_fallback_api_graph()
    
    def _generate_generic_api_graph(self, code: str) -> APICallGraphResponse:
        """Generate generic API call graph"""
        try:
            # Look for common API patterns
            api_patterns = [
                r'[\'"]([^\'"]*api[^\'"]*)[\'"]',
                r'[\'"]([^\'"]*endpoint[^\'"]*)[\'"]',
                r'[\'"]([^\'"]*url[^\'"]*)[\'"]',
            ]
            
            api_endpoints = []
            for pattern in api_patterns:
                matches = re.findall(pattern, code)
                api_endpoints.extend(matches)
            
            # Look for function definitions
            function_pattern = r'(?:function|def)\s+(\w+)'
            internal_functions = re.findall(function_pattern, code)
            
            nodes = []
            for endpoint in api_endpoints:
                nodes.append(f'"{endpoint}"')
            for func in internal_functions[:10]:
                nodes.append(f'"{func}"')
            
            mermaid_code = f"""
graph TD
    subgraph "API Endpoints"
        {chr(10).join([f'"{ep}"' for ep in api_endpoints])}
    end
    subgraph "Functions"
        {chr(10).join([f'"{func}"' for func in internal_functions[:10]])}
    end
"""
            
            return APICallGraphResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=0,
                api_endpoints=api_endpoints,
                external_services=[],
                internal_functions=internal_functions,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in generic API graph generation: {e}")
            return self._generate_fallback_api_graph()
    
    def _generate_fallback_api_graph(self) -> APICallGraphResponse:
        """Generate fallback API call graph"""
        mermaid_code = """
graph TD
    subgraph "API Endpoints"
        A["/api/endpoint"]
    end
    subgraph "External Services"
        B["External API"]
    end
    subgraph "Internal Functions"
        C["process_request"]
    end
    A --> C
    C --> B
"""
        
        return APICallGraphResponse(
            diagram=self._render_mermaid(mermaid_code),
            mermaid_code=mermaid_code.strip(),
            nodes=3,
            edges=2,
            api_endpoints=["/api/endpoint"],
            external_services=["External API"],
            internal_functions=["process_request"],
            document_used=None,
            document_title=None
        )
    
    def generate_changelog(self, content: str, changelog_type: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> ChangelogResponse:
        """Generate changelog from content"""
        try:
            # Get document content if document_id is provided
            if document_id:
                try:
                    from api.routes.docs import doc_manager
                    document = doc_manager.get_document(document_id)
                    if document:
                        content = document.content
                        document_title = document.title
                except Exception as e:
                    logger.error(f"Error fetching document: {e}")
            
            if changelog_type == "semantic":
                return self._generate_semantic_changelog(content)
            elif changelog_type == "chronological":
                return self._generate_chronological_changelog(content)
            else:
                return self._generate_feature_changelog(content)
        except Exception as e:
            logger.error(f"Error generating changelog: {e}")
            return self._generate_fallback_changelog()
    
    def _generate_semantic_changelog(self, content: str) -> ChangelogResponse:
        """Generate semantic changelog"""
        try:
            # Extract version patterns
            version_pattern = r'v?(\d+\.\d+\.\d+)'
            versions = re.findall(version_pattern, content)
            
            # Extract change types
            change_patterns = {
                "Added": r'(?:add|new|feature|implement).*?[.!]',
                "Changed": r'(?:change|update|modify|improve).*?[.!]',
                "Fixed": r'(?:fix|bug|issue|resolve).*?[.!]',
                "Removed": r'(?:remove|delete|deprecate).*?[.!]',
            }
            
            changes = {}
            for change_type, pattern in change_patterns.items():
                matches = re.findall(pattern, content, re.IGNORECASE)
                changes[change_type] = matches[:5]  # Limit to 5 per type
            
            version_history = []
            for i, version in enumerate(versions[:5]):  # Limit to 5 versions
                version_history.append({
                    "version": f"v{version}",
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "changes": changes
                })
            
            total_changes = sum(len(changes_list) for changes_list in changes.values())
            
            mermaid_code = f"""
graph TD
    subgraph "Version History"
        {chr(10).join([f'"{v["version"]}"' for v in version_history])}
    end
    subgraph "Change Types"
        {chr(10).join([f'"{change_type}"' for change_type in changes.keys()])}
    end
"""
            
            changelog_text = f"""
# Changelog

## Version History
{chr(10).join([f'### {v["version"]} - {v["date"]}' for v in version_history])}

## Changes by Type
{chr(10).join([f'### {change_type}{chr(10).join([f"- {change}" for change in changes_list])}' for change_type, changes_list in changes.items() if changes_list])}
"""
            
            return ChangelogResponse(
                changelog=changelog_text,
                mermaid_code=mermaid_code.strip(),
                version_history=version_history,
                total_changes=total_changes,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in semantic changelog generation: {e}")
            return self._generate_fallback_changelog()
    
    def _generate_chronological_changelog(self, content: str) -> ChangelogResponse:
        """Generate chronological changelog"""
        try:
            # Extract date patterns
            date_pattern = r'(\d{4}-\d{2}-\d{2})'
            dates = re.findall(date_pattern, content)
            
            # Extract changes by date
            changes_by_date = {}
            lines = content.split('\n')
            
            for line in lines:
                for date in dates:
                    if date in line:
                        if date not in changes_by_date:
                            changes_by_date[date] = []
                        changes_by_date[date].append(line.strip())
            
            version_history = []
            for date in sorted(dates[:5], reverse=True):  # Last 5 dates
                version_history.append({
                    "version": f"v1.{len(version_history)+1}.0",
                    "date": date,
                    "changes": changes_by_date.get(date, [])
                })
            
            total_changes = sum(len(changes) for changes in changes_by_date.values())
            
            mermaid_code = f"""
graph TD
    subgraph "Timeline"
        {chr(10).join([f'"{v["date"]}"' for v in version_history])}
    end
"""
            
            changelog_text = f"""
# Chronological Changelog

## Timeline
{chr(10).join([f'### {v["date"]} - {v["version"]}{chr(10).join([f"- {change}" for change in v["changes"][:3]])}' for v in version_history])}
"""
            
            return ChangelogResponse(
                changelog=changelog_text,
                mermaid_code=mermaid_code.strip(),
                version_history=version_history,
                total_changes=total_changes,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in chronological changelog generation: {e}")
            return self._generate_fallback_changelog()
    
    def _generate_feature_changelog(self, content: str) -> ChangelogResponse:
        """Generate feature-based changelog"""
        try:
            # Extract feature patterns
            feature_patterns = {
                "UI/UX": r'(?:ui|ux|interface|design|layout).*?[.!]',
                "Performance": r'(?:performance|speed|optimize|fast).*?[.!]',
                "Security": r'(?:security|auth|encrypt|secure).*?[.!]',
                "Bug Fixes": r'(?:bug|fix|issue|error).*?[.!]',
                "New Features": r'(?:feature|new|add|implement).*?[.!]',
            }
            
            features = {}
            for feature_type, pattern in feature_patterns.items():
                matches = re.findall(pattern, content, re.IGNORECASE)
                features[feature_type] = matches[:5]
            
            version_history = [{
                "version": "v1.0.0",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "changes": features
            }]
            
            total_changes = sum(len(feature_list) for feature_list in features.values())
            
            mermaid_code = f"""
graph TD
    subgraph "Feature Categories"
        {chr(10).join([f'"{feature_type}"' for feature_type in features.keys()])}
    end
"""
            
            changelog_text = f"""
# Feature-Based Changelog

## Feature Categories
{chr(10).join([f'### {feature_type}{chr(10).join([f"- {feature}" for feature in feature_list])}' for feature_type, feature_list in features.items() if feature_list])}
"""
            
            return ChangelogResponse(
                changelog=changelog_text,
                mermaid_code=mermaid_code.strip(),
                version_history=version_history,
                total_changes=total_changes,
                document_used=document_id,
                document_title=document_title
            )
        except Exception as e:
            logger.error(f"Error in feature changelog generation: {e}")
            return self._generate_fallback_changelog()
    
    def _generate_fallback_changelog(self) -> ChangelogResponse:
        """Generate fallback changelog"""
        mermaid_code = """
graph TD
    A["v1.0.0"] --> B["v1.1.0"]
    B --> C["v1.2.0"]
    subgraph "Changes"
        D["Added"]
        E["Fixed"]
        F["Changed"]
    end
"""
        
        return ChangelogResponse(
            changelog="# Changelog\n\n## v1.0.0\n- Initial release\n\n## v1.1.0\n- Bug fixes\n\n## v1.2.0\n- New features",
            mermaid_code=mermaid_code.strip(),
            version_history=[
                {"version": "v1.0.0", "date": "2024-01-01", "changes": ["Initial release"]},
                {"version": "v1.1.0", "date": "2024-01-15", "changes": ["Bug fixes"]},
                {"version": "v1.2.0", "date": "2024-02-01", "changes": ["New features"]}
            ],
            total_changes=3,
            document_used=None,
            document_title=None
        )
    
    def _generate_fallback_flow(self) -> FlowDiagramResponse:
        """Generate fallback flow diagram"""
        mermaid_code = """
graph TD
    A[Start] --> B[Process]
    B --> C[End]
"""
        
        return FlowDiagramResponse(
            diagram=self._render_mermaid(mermaid_code),
            mermaid_code=mermaid_code.strip(),
            nodes=3,
            edges=2,
            complexity="Simple",
            analysis={}
        )
    
    def _render_mermaid(self, mermaid_code: str) -> str:
        """Render Mermaid code to HTML with Mermaid.js"""
        return f"""
<div class="mermaid">
{mermaid_code}
</div>
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
mermaid.initialize({{ startOnLoad: true }});
</script>
"""

# Global instance
visualization_generator = VisualizationGenerator()

@router.post("/flow-diagram", response_model=FlowDiagramResponse)
async def generate_flow_diagram(request: FlowDiagramRequest):
    """Generate comprehensive flow diagram from code with document integration"""
    try:
        result = visualization_generator.generate_flow_diagram(
            request.code,
            request.language,
            request.diagram_type,
            request.document_id,
            request.document_title
        )
        return result
    except Exception as e:
        logger.error(f"Error generating flow diagram: {e}")
        raise HTTPException(status_code=500, detail="Flow diagram generation failed")

@router.post("/api-call-graph", response_model=APICallGraphResponse)
async def generate_api_call_graph(request: APICallGraphRequest):
    """Generate API call graph from code with document integration"""
    try:
        result = visualization_generator.generate_api_call_graph(
            request.code,
            request.language,
            request.document_id,
            request.document_title
        )
        return result
    except Exception as e:
        logger.error(f"Error generating API call graph: {e}")
        raise HTTPException(status_code=500, detail="API call graph generation failed")

@router.post("/changelog", response_model=ChangelogResponse)
async def generate_changelog(request: ChangelogRequest):
    """Generate changelog from content with document integration"""
    try:
        result = visualization_generator.generate_changelog(
            request.content,
            request.changelog_type,
            request.document_id,
            request.document_title
        )
        return result
    except Exception as e:
        logger.error(f"Error generating changelog: {e}")
        raise HTTPException(status_code=500, detail="Changelog generation failed")
