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
        """Generate comprehensive Python flow diagram with visual styling"""
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
            
            # Extract API endpoints (for FastAPI/Flask)
            endpoint_pattern = r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*["\']([^"\']+)["\']'
            endpoints = re.findall(endpoint_pattern, code)
            
            nodes = []
            edges = []
            analysis = {
                "functions": [],
                "classes": [],
                "control_structures": [],
                "imports": [],
                "variables": [],
                "endpoints": []
            }
            
            # Create visual flowchart with proper styling
            if diagram_type == "flowchart":
                mermaid_code = """
graph TD
"""
                
                # Add functions with visual styling
                for func_name, params in functions:
                    param_list = [p.strip() for p in params.split(',') if p.strip()]
                    node_label = f"{func_name}({', '.join(param_list[:3])}{'...' if len(param_list) > 3 else ''})"
                    node_id = f"func_{func_name}"
                    nodes.append(f'{node_id}({node_label})')
                    analysis["functions"].append({"name": func_name, "params": param_list})
                
                # Add classes with visual styling
                for class_name, inheritance in classes:
                    if inheritance:
                        node_label = f"{class_name}({inheritance})"
                    else:
                        node_label = class_name
                    node_id = f"class_{class_name}"
                    nodes.append(f'{node_id}({node_label})')
                    analysis["classes"].append({"name": class_name, "inheritance": inheritance})
                
                # Add control structures with visual styling
                for i, control in enumerate(controls[:8]):  # Limit to 8 controls
                    node_id = f"control_{i}"
                    nodes.append(f'{node_id}({control})')
                    analysis["control_structures"].append(control)
                
                # Add imports with visual styling
                for i, imp in enumerate(imports[:5]):  # Limit to 5 imports
                    module = imp[0] if imp[0] else imp[1]
                    if module:
                        node_id = f"import_{i}"
                        nodes.append(f'{node_id}({module})')
                        analysis["imports"].append(module)
                
                # Add API endpoints with visual styling
                for i, endpoint in enumerate(endpoints[:6]):  # Limit to 6 endpoints
                    node_id = f"endpoint_{i}"
                    nodes.append(f'{node_id}({endpoint})')
                    analysis["endpoints"].append(endpoint)
                
                # Add key variables with visual styling
                for i, var in enumerate(variables[:5]):  # Limit to 5 variables
                    if var not in ['self', 'cls']:
                        node_id = f"var_{i}"
                        nodes.append(f'{node_id}({var})')
                        analysis["variables"].append(var)
                
                # Create logical flow connections
                # Connect functions to their imports
                for i, func in enumerate(functions[:3]):
                    func_name = func[0]
                    func_id = f"func_{func_name}"
                    for j, imp in enumerate(imports[:3]):
                        module = imp[0] if imp[0] else imp[1]
                        if module:
                            import_id = f"import_{j}"
                            edges.append(f'{func_id} --> {import_id}')
                
                # Connect classes to their methods
                for i, class_info in enumerate(classes[:2]):
                    class_name = class_info[0]
                    class_id = f"class_{class_name}"
                    for j, func in enumerate(functions[:2]):
                        func_name = func[0]
                        func_id = f"func_{func_name}"
                        edges.append(f'{class_id} --> {func_id}')
                
                # Connect control structures in logical flow
                for i in range(len(controls[:4]) - 1):
                    control_id = f"control_{i}"
                    next_control_id = f"control_{i+1}"
                    edges.append(f'{control_id} --> {next_control_id}')
                
                # Add all nodes and edges to mermaid code
                if nodes:
                    mermaid_code += "\n".join(nodes) + "\n"
                if edges:
                    mermaid_code += "\n".join(edges)
                
                # If no nodes found, create a generic flow structure
                if not nodes:
                    mermaid_code += """
    %% Generic Flow Structure
    start[Start]
    input[Input Data]
    process[Process Data]
    validate[Validate]
    output[Output Result]
    end[End]
    
    %% Flow
    start --> input
    input --> process
    process --> validate
    validate --> output
    output --> end
"""
                
            else:  # Sequence diagram
                mermaid_code = """
sequenceDiagram
    participant User as 👤 User
    participant API as 🔌 API
    participant DB as 💾 Database
    participant Service as ⚙️ Service
"""
                
                # Add function calls as sequence
                for i, func in enumerate(functions[:6]):
                    func_name = func[0]
                    mermaid_code += f"    User->>API: {func_name}()\n"
                    mermaid_code += f"    API->>Service: Process {func_name}\n"
                    mermaid_code += f"    Service->>DB: Query data\n"
                    mermaid_code += f"    DB-->>Service: Return data\n"
                    mermaid_code += f"    Service-->>API: Processed result\n"
                    mermaid_code += f"    API-->>User: Response\n"
            
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
                nodes.append(f'func_{func_name}({func_name})')
                analysis["functions"].append(func_name)
             
            # Add classes
            for cls in classes:
                nodes.append(f'class_{cls}({cls})')
                analysis["classes"].append(cls)
            
            # Add async functions
            for async_func in async_funcs:
                nodes.append(f'async_{async_func}({async_func} async)')
                analysis["async_functions"].append(async_func)
            
            # Add arrow functions
            for arrow in arrows:
                nodes.append(f'arrow_{arrow}({arrow} arrow)')
                analysis["arrow_functions"].append(arrow)
            
            # Add imports
            for imp in imports:
                nodes.append(f'import_{imp.replace("/", "_")}({imp})')
                analysis["imports"].append(imp)
            
            # Look for function calls and create edges
            call_pattern = r'(\w+)\s*\('
            calls = re.findall(call_pattern, code)
            
            for call in calls:
                if call in [func[0] for func in functions if func[0]]:
                    edges.append(f'func_{call} --> func_{call}')
            
            nodes_str = "\n".join(nodes)
            edges_str = "\n".join(edges)
            mermaid_code = f"""
graph TD
    {nodes_str}
    {edges_str}
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
                    nodes.append(f'node_{i}({node_label})')
                    analysis["keywords"].append(line.strip())
                
                # Look for structural patterns
                if line_lower.startswith(('if', 'for', 'while', 'try', 'switch')):
                    analysis["structures"].append(line.strip())
            
            nodes_str = "\n".join(nodes)
            mermaid_code = f"""
graph TD
    {nodes_str}
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
        """Generate Python API call graph with visual styling"""
        try:
            # Extract API endpoints (FastAPI, Flask, Django patterns)
            endpoint_patterns = [
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'@(?:app|router)\.route\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'path\s*\(\s*[\'"]([^\'"]+)[\'"]',
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)',
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]\s*,',
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)\s*async',
                r'@(?:app|router)\.(?:get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]\s*\)\s*def',
            ]
            
            api_endpoints = []
            for pattern in endpoint_patterns:
                matches = re.findall(pattern, code)
                api_endpoints.extend(matches)
            
            # Extract HTTP methods from endpoints
            method_pattern = r'@(?:app|router)\.(get|post|put|delete|patch)'
            methods = re.findall(method_pattern, code)
            
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
            
            # Create visual API graph with proper styling
            mermaid_code = """
graph TD
"""
            
            # Add API endpoints with visual styling
            for i, endpoint in enumerate(api_endpoints[:8]):  # Limit to 8 endpoints
                method = methods[i] if i < len(methods) else "GET"
                node_id = f"endpoint_{i}"
                node_label = f"{method.upper()} {endpoint}"
                mermaid_code += f'    {node_id}({node_label})\n'
            
            # If no API endpoints found, create a generic API structure
            if not api_endpoints:
                mermaid_code += """
    %% Generic API Structure
    client[Client Request]
    router[API Router]
    auth[Authentication]
    validation[Data Validation]
    business[Business Logic]
    database[Database]
    response[API Response]
    
    %% Connections
    client --> router
    router --> auth
    auth --> validation
    validation --> business
    business --> database
    database --> business
    business --> response
    response --> client
"""
            
            # Add external services with visual styling
            for i, service in enumerate(external_services[:5]):  # Limit to 5 services
                node_id = f"service_{i}"
                mermaid_code += f'    {node_id}({service})\n'
            
            # Add internal functions with visual styling
            for i, func in enumerate(internal_functions[:8]):  # Limit to 8 functions
                node_id = f"func_{i}"
                mermaid_code += f'    {node_id}({func}())\n'
            
            # Add database operations with visual styling
            for i, db_op in enumerate(db_calls[:5]):  # Limit to 5 DB ops
                node_id = f"db_{i}"
                mermaid_code += f'    {node_id}({db_op})\n'
            
            # Create logical API flow connections
            mermaid_code += "\n    %% Connections\n"
            
            # Connect endpoints to functions
            for i, endpoint in enumerate(api_endpoints[:3]):
                endpoint_id = f"endpoint_{i}"
                func_id = f"func_{i}"
                if i < len(internal_functions):
                    mermaid_code += f'    {endpoint_id} --> {func_id}\n'
            
            # Connect functions to services
            for i, func in enumerate(internal_functions[:3]):
                func_id = f"func_{i}"
                service_id = f"service_{i}"
                if i < len(external_services):
                    mermaid_code += f'    {func_id} --> {service_id}\n'
            
            # Connect functions to database
            for i, func in enumerate(internal_functions[:3]):
                func_id = f"func_{i}"
                db_id = f"db_{i}"
                if i < len(db_calls):
                    mermaid_code += f'    {func_id} --> {db_id}\n'
            
            # Calculate total nodes and edges
            total_nodes = len(api_endpoints[:8]) + len(external_services[:5]) + len(internal_functions[:8]) + len(db_calls[:5])
            total_edges = min(3, len(api_endpoints)) + min(3, len(internal_functions)) + min(3, len(internal_functions))
            
            return APICallGraphResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=total_nodes,
                edges=total_edges,
                api_endpoints=api_endpoints,
                external_services=external_services,
                internal_functions=internal_functions,
                document_used=None,
                document_title=None
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
            
            # Initialize nodes and edges lists
            nodes = []
            edges = []
            
            # Add nodes
            for endpoint in api_endpoints:
                nodes.append(f'endpoint_{endpoint.replace("/", "_")}({endpoint})')
            for service in external_services:
                nodes.append(f'service_{service.replace("/", "_")}({service})')
            for func in internal_functions[:10]:
                nodes.append(f'func_{func}({func})')
            
            # Create edges
            for endpoint in api_endpoints:
                for func in internal_functions:
                    if func in code:
                        edges.append(f'endpoint_{endpoint.replace("/", "_")} --> func_{func}')
            
            endpoints_str = "\n".join([f'    endpoint_{ep.replace("/", "_")}({ep})' for ep in api_endpoints])
            services_str = "\n".join([f'    service_{es.replace("/", "_")}({es})' for es in external_services])
            functions_str = "\n".join([f'    func_{func}({func})' for func in internal_functions[:10]])
            edges_str = "\n".join([f'    {edge}' for edge in edges])
            mermaid_code = f"""
graph TD
    subgraph "API Endpoints"
{endpoints_str}
    end
    subgraph "External Services"
{services_str}
    end
    subgraph "Internal Functions"
{functions_str}
    end
{edges_str}
"""
            
            return APICallGraphResponse(
                diagram=self._render_mermaid(mermaid_code),
                mermaid_code=mermaid_code.strip(),
                nodes=len(nodes),
                edges=len(edges),
                api_endpoints=api_endpoints,
                external_services=external_services,
                internal_functions=internal_functions,
                document_used=None,
                document_title=None
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
                nodes.append(f'endpoint_{endpoint.replace("/", "_")}({endpoint})')
            for func in internal_functions[:10]:
                nodes.append(f'func_{func}({func})')
            
            endpoints_str = "\n".join([f'    endpoint_{ep.replace("/", "_")}({ep})' for ep in api_endpoints])
            functions_str = "\n".join([f'    func_{func}({func})' for func in internal_functions[:10]])
            mermaid_code = f"""
graph TD
    subgraph "API Endpoints"
{endpoints_str}
    end
    subgraph "Functions"
{functions_str}
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
                document_used=None,
                document_title=None
            )
        except Exception as e:
            logger.error(f"Error in generic API graph generation: {e}")
            return self._generate_fallback_api_graph()
    
    def _generate_fallback_api_graph(self) -> APICallGraphResponse:
        """Generate fallback API call graph"""
        mermaid_code = """
graph TD
    subgraph "API Endpoints"
        A(/api/endpoint)
    end
    subgraph "External Services"
        B(External API)
    end
    subgraph "Internal Functions"
        C(process_request)
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
                return self._generate_semantic_changelog(content, document_id, document_title)
            elif changelog_type == "chronological":
                return self._generate_chronological_changelog(content, document_id, document_title)
            else:
                return self._generate_feature_changelog(content, document_id, document_title)
        except Exception as e:
            logger.error(f"Error generating changelog: {e}")
            return self._generate_fallback_changelog()
    
    def _generate_semantic_changelog(self, content: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> ChangelogResponse:
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
            
            # If no versions found, create a generic changelog
            if not versions:
                version_history = [
                    {
                        "version": "v1.0.0",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "changes": {
                            "Added": ["Initial release", "Core functionality"],
                            "Changed": ["Code structure", "Documentation"],
                            "Fixed": ["Bug fixes", "Performance improvements"]
                        }
                    },
                    {
                        "version": "v0.9.0",
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "changes": {
                            "Added": ["Beta features", "Testing framework"],
                            "Changed": ["API improvements", "Better error handling"]
                        }
                    }
                ]
                total_changes = 6
            
            # Create a simpler Mermaid diagram for changelog
            mermaid_code = """
graph TD
    A[v1.0.0] --> B[v1.1.0]
    B --> C[v1.2.0]
    D[Added] --> A
    E[Changed] --> B
    F[Fixed] --> C
"""
            
            version_history_str = "\n".join([f'### {v["version"]} - {v["date"]}' for v in version_history])
            changes_by_type_str = "\n".join([f'### {change_type}\n' + "\n".join([f"- {change}" for change in changes_list]) for change_type, changes_list in changes.items() if changes_list])
            changelog_text = f"""
# Changelog

## Version History
{version_history_str}

## Changes by Type
{changes_by_type_str}
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
    
    def _generate_chronological_changelog(self, content: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> ChangelogResponse:
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
            
            # Create a simpler timeline diagram
            mermaid_code = """
graph TD
    A[2024-01-01] --> B[2024-01-15]
    B --> C[2024-02-01]
    D[Changes] --> A
    E[Updates] --> B
    F[Features] --> C
"""
            
            timeline_str = "\n".join([f'### {v["date"]} - {v["version"]}\n' + "\n".join([f"- {change}" for change in v["changes"][:3]]) for v in version_history])
            changelog_text = f"""
# Chronological Changelog

## Timeline
{timeline_str}
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
    
    def _generate_feature_changelog(self, content: str, document_id: Optional[str] = None, document_title: Optional[str] = None) -> ChangelogResponse:
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
            
            # Create a simpler feature diagram
            mermaid_code = """
graph TD
    A[UI/UX] --> D[Features]
    B[Performance] --> D
    C[Security] --> D
    D --> E[Release]
"""
            
            feature_categories_text = "\n".join([f'### {feature_type}\n' + "\n".join([f"- {feature}" for feature in feature_list]) for feature_type, feature_list in features.items() if feature_list])
            changelog_text = f"""
# Feature-Based Changelog

## Feature Categories
{feature_categories_text}
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
    A(v1.0.0) --> B(v1.1.0)
    B --> C(v1.2.0)
    D(Added) --> A
    E(Fixed) --> B
    F(Changed) --> C
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
    A(Start) --> B(Process)
    B --> C(End)
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
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
        """Return clean Mermaid code for frontend rendering"""
        return mermaid_code.strip()

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
