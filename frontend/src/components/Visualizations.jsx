import React, { useState, useEffect } from 'react';
import { BarChart3, GitBranch, Network, Activity, Download, Eye, FileText } from 'lucide-react';

const Visualizations = () => {
  // Error boundary state
  const [hasError, setHasError] = useState(false);
  
  // Error boundary handler
  const handleError = (error) => {
    console.error('Visualization error:', error);
    setHasError(true);
  };
  
  // Reset error state
  const resetError = () => {
    setHasError(false);
  };
  // Shared document selection state
  const [selectedDocument, setSelectedDocument] = useState({
    id: '',
    title: '',
    content: ''
  });
  
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [results, setResults] = useState({
    flow: null,
    api: null,
    changelog: null
  });
  const [loading, setLoading] = useState({
    flow: false,
    api: false,
    changelog: false
  });


  useEffect(() => {
    fetchAvailableDocuments();
    
    // Enhanced Mermaid initialization
    if (window.mermaid) {
      try {
        window.mermaid.initialize({ 
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          graph: {
            useMaxWidth: true,
            htmlLabels: true
          },
          sequence: {
            useMaxWidth: true,
            htmlLabels: true
          }
        });
        console.log('Mermaid initialized successfully');
      } catch (error) {
        console.error('Mermaid initialization failed:', error);
      }
    } else {
      console.log('Mermaid not available on window object');
    }
  }, []);

  // Enhanced Mermaid rendering
  useEffect(() => {
    if (window.mermaid && results) {

      
      // Force Mermaid to reinitialize
      try {
        window.mermaid.initialize({ 
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          },
          graph: {
            useMaxWidth: true,
            htmlLabels: true
          },
          sequence: {
            useMaxWidth: true,
            htmlLabels: true
          }
        });
      } catch (error) {
        console.error('Mermaid reinitialization failed:', error);
      }
      
      // Wait for DOM to be ready
      setTimeout(() => {
        const mermaidElements = document.querySelectorAll('.mermaid');
        
        mermaidElements.forEach((element, index) => {
          if (element && element.textContent && element.textContent.trim()) {
            try {
              const diagramId = `mermaid-${Date.now()}-${index}`;
              const mermaidCode = element.textContent.trim();
              
              // Check if the content is actually Mermaid code (should start with graph, flowchart, etc.)
              if (!mermaidCode.startsWith('graph') && !mermaidCode.startsWith('flowchart') && 
                  !mermaidCode.startsWith('sequenceDiagram') && !mermaidCode.startsWith('classDiagram') &&
                  !mermaidCode.startsWith('stateDiagram') && !mermaidCode.startsWith('gantt') &&
                  !mermaidCode.startsWith('pie') && !mermaidCode.startsWith('journey') &&
                  !mermaidCode.startsWith('gitgraph') && !mermaidCode.startsWith('C4Context') &&
                  !mermaidCode.startsWith('mindmap') && !mermaidCode.startsWith('timeline') &&
                  !mermaidCode.startsWith('zenuml') && !mermaidCode.startsWith('sankey') &&
                  !mermaidCode.startsWith('erDiagram') && !mermaidCode.startsWith('userJourney')) {
                console.warn('Content is not valid Mermaid code:', mermaidCode.substring(0, 100));
                return;
              }
              
              // Clear the element first
              element.innerHTML = '';
              
              // Use mermaid.render with proper error handling
              window.mermaid.render(diagramId, mermaidCode)
                .then(({ svg }) => {
                  if (element && element.parentNode) {
                    element.innerHTML = svg;
                    // Add some styling to make the diagram look better
                    element.style.textAlign = 'center';
                    element.style.margin = '10px 0';
                  }
                })
                .catch((error) => {
                  console.error('Mermaid rendering failed:', error);
                  console.warn('Failed mermaid code:', mermaidCode);
                  // Show error message and raw code
                  if (element && element.parentNode) {
                    element.innerHTML = `
                      <div class="text-center p-4">
                        <div class="text-red-600 text-sm mb-2">⚠️ Diagram rendering failed: ${error.message}</div>
                        <pre class="text-xs text-gray-600 bg-gray-100 p-3 rounded border text-left overflow-x-auto">${mermaidCode}</pre>
                      </div>
                    `;
                  }
                });
            } catch (error) {
              console.warn('Mermaid error:', error);
              // Fallback to raw code
              if (element && element.parentNode) {
                element.innerHTML = `
                  <div class="text-center p-4">
                    <div class="text-red-600 text-sm mb-2">⚠️ Diagram error</div>
                    <pre class="text-xs text-gray-600 bg-gray-100 p-3 rounded border text-left overflow-x-auto">${element.textContent}</pre>
                  </div>
                `;
              }
            }
          }
        });
      }, 500); // Longer delay for better DOM readiness
    } else {
      console.log('Mermaid not available or no results:', { mermaid: !!window.mermaid, results });
    }
  }, [results]);

  const fetchAvailableDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/docs/');
      if (response.ok) {
        const documents = await response.json();
        setAvailableDocuments(documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDocumentSelect = (docId) => {
    const selectedDoc = availableDocuments.find(doc => doc.doc_id === docId);
    setSelectedDocument({
      id: docId,
      title: selectedDoc ? selectedDoc.title : '',
      content: selectedDoc ? selectedDoc.content : ''
    });
  };

  const handleFlowDiagram = async () => {
    if (!selectedDocument.id) {
      alert('Please select a document first');
      return;
    }
    
    // Check if already loading
    if (loading.flow) return;
    
    // Clear previous results to avoid conflicts
    setResults(prev => ({ ...prev, flow: null }));
    setLoading(prev => ({ ...prev, flow: true }));
    try {
      const response = await fetch('http://localhost:8000/api/visualizations/flow-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedDocument.content,
          language: 'python',
          diagram_type: 'flowchart',
          document_id: selectedDocument.id,
          document_title: selectedDocument.title
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setResults(prev => ({ ...prev, flow: result }));
      } else {
        console.error('Flow diagram generation failed');
      }
    } catch (error) {
      console.error('Error generating flow diagram:', error);
    } finally {
      setLoading(prev => ({ ...prev, flow: false }));
    }
  };

  const handleApiCallGraph = async () => {
    if (!selectedDocument.id) {
      alert('Please select a document first');
      return;
    }
    
    // Check if already loading
    if (loading.api) return;
    
    // Clear previous results to avoid conflicts
    setResults(prev => ({ ...prev, api: null }));
    setLoading(prev => ({ ...prev, api: true }));
    try {
      const response = await fetch('http://localhost:8000/api/visualizations/api-call-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: selectedDocument.content,
          language: 'python',
          document_id: selectedDocument.id,
          document_title: selectedDocument.title
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setResults(prev => ({ ...prev, api: result }));
      } else {
        console.error('API call graph generation failed');
      }
    } catch (error) {
      console.error('Error generating API call graph:', error);
    } finally {
      setLoading(prev => ({ ...prev, api: false }));
    }
  };

  const handleChangelog = async () => {
    if (!selectedDocument.id) {
      alert('Please select a document first');
      return;
    }
    
    // Check if already loading
    if (loading.changelog) return;
    
    // Clear previous results to avoid conflicts
    setResults(prev => ({ ...prev, changelog: null }));
    setLoading(prev => ({ ...prev, changelog: true }));
    try {
      const response = await fetch('http://localhost:8000/api/visualizations/changelog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: selectedDocument.content,
          changelog_type: 'semantic',
          document_id: selectedDocument.id,
          document_title: selectedDocument.title
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setResults(prev => ({ ...prev, changelog: result }));
      } else {
        console.error('Changelog generation failed');
      }
    } catch (error) {
      console.error('Error generating changelog:', error);
    } finally {
      setLoading(prev => ({ ...prev, changelog: false }));
    }
  };

  const handleGenerateAll = async () => {
    if (!selectedDocument.id) {
      alert('Please select a document first');
      return;
    }
    
    // Set all loading states to true
    setLoading({ flow: true, api: true, changelog: true });
    
    try {
      // Generate all visualizations concurrently
      const [flowResponse, apiResponse, changelogResponse] = await Promise.all([
        fetch('http://localhost:8000/api/visualizations/flow-diagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: selectedDocument.content,
            language: 'python',
            diagram_type: 'flowchart',
            document_id: selectedDocument.id,
            document_title: selectedDocument.title
          })
        }),
        fetch('http://localhost:8000/api/visualizations/api-call-graph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: selectedDocument.content,
            language: 'python',
            document_id: selectedDocument.id,
            document_title: selectedDocument.title
          })
        }),
        fetch('http://localhost:8000/api/visualizations/changelog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: selectedDocument.content,
            changelog_type: 'semantic',
            document_id: selectedDocument.id,
            document_title: selectedDocument.title
          })
        })
      ]);
      
      // Process all responses
      const [flowResult, apiResult, changelogResult] = await Promise.all([
        flowResponse.ok ? flowResponse.json() : null,
        apiResponse.ok ? apiResponse.json() : null,
        changelogResponse.ok ? changelogResponse.json() : null
      ]);
      
      // Update results
      setResults({
        flow: flowResult,
        api: apiResult,
        changelog: changelogResult
      });
      
    } catch (error) {
      console.error('Error generating all visualizations:', error);
    } finally {
      // Set all loading states to false
      setLoading({ flow: false, api: false, changelog: false });
    }
  };

  const downloadMermaid = (mermaidCode, filename) => {
    const blob = new Blob([mermaidCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Error boundary wrapper
  if (hasError) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
          <p className="text-red-600 mb-4">There was an error rendering the visualizations.</p>
          <button
            onClick={resetError}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-full" onError={handleError}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-primary-900">Visualizations</h1>
        </div>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Generate comprehensive visual diagrams from your documentation. Select a document once and create multiple visualizations.
        </p>
      </div>

      {/* Shared Document Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="w-5 h-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-primary-900">Select Document</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Choose Document
            </label>
            <select
              value={selectedDocument.id}
              onChange={(e) => handleDocumentSelect(e.target.value)}
              className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">-- Select a document to visualize --</option>
              {availableDocuments.map((doc) => (
                <option key={doc.doc_id} value={doc.doc_id}>
                  {doc.title} ({doc.content_type})
                </option>
              ))}
            </select>
          </div>
          
          {selectedDocument.id && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h3 className="font-medium text-primary-900 mb-2">Selected Document</h3>
              <p className="text-primary-700">{selectedDocument.title}</p>
              <p className="text-sm text-primary-600 mt-1">
                Content length: {selectedDocument.content.length} characters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Generate All Button */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-primary-900">Generate All Visualizations</h3>
        </div>
        <p className="text-secondary-600 mb-4">
          Generate all three visualizations simultaneously for comprehensive analysis.
        </p>
        <button
          onClick={handleGenerateAll}
          disabled={!selectedDocument.id || loading.flow || loading.api || loading.changelog}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.flow || loading.api || loading.changelog ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating All...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Generate All Visualizations
            </div>
          )}
        </button>
      </div>

      {/* Visualization Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Flow Diagram */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <GitBranch className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-primary-900">Flow Diagram</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Generate visual flow diagrams showing code structure and control flow.
          </p>
          <button
            onClick={handleFlowDiagram}
            disabled={!selectedDocument.id || loading.flow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.flow ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <GitBranch className="w-5 h-5 mr-2" />
                Generate Flow Diagram
              </div>
            )}
          </button>
        </div>

        {/* API Call Graph */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Network className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-primary-900">API Call Graph</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Visualize API endpoints, function calls, and service interactions.
          </p>
          <button
            onClick={handleApiCallGraph}
            disabled={!selectedDocument.id || loading.api}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.api ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Network className="w-5 h-5 mr-2" />
                Generate API Graph
              </div>
            )}
          </button>
        </div>

        {/* Changelog */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-primary-900">Changelog</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Create visual changelogs showing version history and feature evolution.
          </p>
          <button
            onClick={handleChangelog}
            disabled={!selectedDocument.id || loading.changelog}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.changelog ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Activity className="w-5 h-5 mr-2" />
                Generate Changelog
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Results Display */}
      {(results.flow || results.api || results.changelog) && (
        <div className="space-y-6">
          {/* Flow Diagram Result */}
          {results.flow && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <GitBranch className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-primary-900">Flow Diagram</h3>
                </div>
                <button
                  onClick={() => downloadMermaid(results.flow.mermaid_code, 'flow-diagram.mmd')}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                   <h4 className="font-medium text-primary-900 mb-2">Visual Diagram</h4>
                   <div className="bg-gray-50 rounded-lg p-4 border min-h-[200px]">
                     <div className="mermaid" data-diagram-type="flow">
                       {results.flow.mermaid_code}
                     </div>
                   </div>
                 </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-2">Analysis</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{results.flow.nodes}</div>
                        <div className="text-xs text-blue-600">Nodes</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{results.flow.edges}</div>
                        <div className="text-xs text-blue-600">Connections</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Complexity: {results.flow.complexity}</div>
                      {results.flow.analysis.functions && (
                        <div className="text-xs text-gray-600">
                          Functions: {results.flow.analysis.functions.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Call Graph Result */}
          {results.api && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Network className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-primary-900">API Call Graph</h3>
                </div>
                <button
                  onClick={() => downloadMermaid(results.api.mermaid_code, 'api-graph.mmd')}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                   <h4 className="font-medium text-primary-900 mb-2">API Visualization</h4>
                   <div className="bg-gray-50 rounded-lg p-4 border min-h-[200px]">
                     <div className="mermaid" data-diagram-type="api">
                       {results.api.mermaid_code}
                     </div>
                   </div>
                 </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-2">API Analysis</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{results.api.api_endpoints?.length || 0}</div>
                        <div className="text-xs text-green-600">Endpoints</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{results.api.external_services?.length || 0}</div>
                        <div className="text-xs text-green-600">Services</div>
                      </div>
                    </div>
                    
                    {results.api.api_endpoints && results.api.api_endpoints.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">API Endpoints</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {results.api.api_endpoints.slice(0, 3).map((endpoint, index) => (
                            <div key={index}>• {endpoint}</div>
                          ))}
                          {results.api.api_endpoints.length > 3 && (
                            <div>... and {results.api.api_endpoints.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Changelog Result */}
          {results.changelog && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-primary-900">Changelog</h3>
                </div>
                <button
                  onClick={() => downloadMermaid(results.changelog.mermaid_code, 'changelog.mmd')}
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div>
                   <h4 className="font-medium text-primary-900 mb-2">Version Timeline</h4>
                   <div className="bg-gray-50 rounded-lg p-4 border min-h-[200px]">
                     <div className="mermaid" data-diagram-type="changelog">
                       {results.changelog.mermaid_code}
                     </div>
                   </div>
                 </div>
                
                <div>
                  <h4 className="font-medium text-primary-900 mb-2">Change Summary</h4>
                  <div className="space-y-3">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{results.changelog.total_changes}</div>
                      <div className="text-xs text-purple-600">Total Changes</div>
                    </div>
                    
                    {results.changelog.version_history && results.changelog.version_history.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Recent Versions</div>
                        <div className="text-xs text-gray-600 space-y-1">
                          {results.changelog.version_history.slice(0, 3).map((version, index) => (
                            <div key={index}>• {version.version} - {results.changelog.total_changes} changes</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Visualizations;
