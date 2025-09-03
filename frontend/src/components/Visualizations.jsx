import React, { useState, useEffect } from 'react';
import { BarChart3, GitBranch, Network, Activity, Download, Eye } from 'lucide-react';

const Visualizations = () => {
  const [flowForm, setFlowForm] = useState({
    code: '',
    language: 'python',
    diagramType: 'flowchart',
    documentId: ''
  });
  
  const [apiForm, setApiForm] = useState({
    code: '',
    language: 'python',
    documentId: ''
  });
  
  const [changelogForm, setChangelogForm] = useState({
    content: '',
    changelogType: 'semantic',
    documentId: ''
  });
  
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [flowResult, setFlowResult] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [changelogResult, setChangelogResult] = useState(null);
  const [loading, setLoading] = useState({
    flow: false,
    api: false,
    changelog: false
  });

  useEffect(() => {
    fetchAvailableDocuments();
  }, []);

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

  const handleFlowDiagram = async () => {
    setLoading(prev => ({ ...prev, flow: true }));
    try {
      const selectedDoc = availableDocuments.find(doc => doc.id === flowForm.documentId);
      const response = await fetch('http://localhost:8000/api/visualizations/flow-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: flowForm.code,
          language: flowForm.language,
          diagram_type: flowForm.diagramType,
          document_id: flowForm.documentId || null,
          document_title: selectedDoc?.title || null
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setFlowResult(result);
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
    setLoading(prev => ({ ...prev, api: true }));
    try {
      const selectedDoc = availableDocuments.find(doc => doc.id === apiForm.documentId);
      const response = await fetch('http://localhost:8000/api/visualizations/api-call-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: apiForm.code,
          language: apiForm.language,
          document_id: apiForm.documentId || null,
          document_title: selectedDoc?.title || null
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setApiResult(result);
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
    setLoading(prev => ({ ...prev, changelog: true }));
    try {
      const selectedDoc = availableDocuments.find(doc => doc.id === changelogForm.documentId);
      const response = await fetch('http://localhost:8000/api/visualizations/changelog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: changelogForm.content,
          changelog_type: changelogForm.changelogType,
          document_id: changelogForm.documentId || null,
          document_title: selectedDoc?.title || null
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setChangelogResult(result);
      } else {
        console.error('Changelog generation failed');
      }
    } catch (error) {
      console.error('Error generating changelog:', error);
    } finally {
      setLoading(prev => ({ ...prev, changelog: false }));
    }
  };

  const downloadMermaid = (mermaidCode, filename) => {
    const blob = new Blob([mermaidCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visualizations</h1>
        <p className="text-gray-600">Generate comprehensive visualizations from your code and documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flow Diagrams */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <GitBranch className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Flow Diagrams</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Document (Optional)</label>
              <select
                value={flowForm.documentId}
                onChange={(e) => setFlowForm(prev => ({ ...prev, documentId: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a document...</option>
                {availableDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={flowForm.language}
                onChange={(e) => setFlowForm(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="generic">Generic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagram Type</label>
              <select
                value={flowForm.diagramType}
                onChange={(e) => setFlowForm(prev => ({ ...prev, diagramType: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="flowchart">Flowchart</option>
                <option value="sequence">Sequence Diagram</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code (if no document selected)</label>
              <textarea
                value={flowForm.code}
                onChange={(e) => setFlowForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Paste your code here..."
                required={!flowForm.documentId}
                disabled={!!flowForm.documentId}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
              />
              {flowForm.documentId && (
                <p className="text-sm text-gray-500 mt-1">Code will be automatically loaded from the selected document</p>
              )}
            </div>

            <button
              onClick={handleFlowDiagram}
              disabled={loading.flow || (!flowForm.code && !flowForm.documentId)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.flow ? 'Generating...' : 'Generate Flow Diagram'}
            </button>
          </div>

          {flowResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Flow Diagram Result</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadMermaid(flowResult.mermaid_code, 'flow-diagram')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nodes:</span> {flowResult.nodes}
                </div>
                <div>
                  <span className="font-medium">Edges:</span> {flowResult.edges}
                </div>
                <div>
                  <span className="font-medium">Complexity:</span> {flowResult.complexity}
                </div>
                {flowResult.document_used && (
                  <div>
                    <span className="font-medium">Document:</span> {flowResult.document_title}
                  </div>
                )}
              </div>

              {flowResult.analysis && Object.keys(flowResult.analysis).length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-900 mb-2">Analysis:</h4>
                  <div className="text-xs space-y-1">
                    {Object.entries(flowResult.analysis).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {Array.isArray(value) ? value.length : value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4" dangerouslySetInnerHTML={{ __html: flowResult.diagram }} />
            </div>
          )}
        </div>

        {/* API Call Graphs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Network className="w-6 h-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">API Call Graphs</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Document (Optional)</label>
              <select
                value={apiForm.documentId}
                onChange={(e) => setApiForm(prev => ({ ...prev, documentId: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a document...</option>
                {availableDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={apiForm.language}
                onChange={(e) => setApiForm(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="generic">Generic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code (if no document selected)</label>
              <textarea
                value={apiForm.code}
                onChange={(e) => setApiForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Paste your API code here..."
                required={!apiForm.documentId}
                disabled={!!apiForm.documentId}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 resize-none"
              />
              {apiForm.documentId && (
                <p className="text-sm text-gray-500 mt-1">Code will be automatically loaded from the selected document</p>
              )}
            </div>

            <button
              onClick={handleApiCallGraph}
              disabled={loading.api || (!apiForm.code && !apiForm.documentId)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.api ? 'Generating...' : 'Generate API Call Graph'}
            </button>
          </div>

          {apiResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">API Call Graph Result</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadMermaid(apiResult.mermaid_code, 'api-call-graph')}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium">Nodes:</span> {apiResult.nodes}
                </div>
                <div>
                  <span className="font-medium">Edges:</span> {apiResult.edges}
                </div>
                <div>
                  <span className="font-medium">API Endpoints:</span> {apiResult.api_endpoints.length}
                </div>
                <div>
                  <span className="font-medium">External Services:</span> {apiResult.external_services.length}
                </div>
              </div>

              {apiResult.api_endpoints.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">API Endpoints:</h4>
                  <div className="text-xs space-y-1">
                    {apiResult.api_endpoints.slice(0, 5).map((endpoint, index) => (
                      <div key={index} className="bg-blue-100 px-2 py-1 rounded">{endpoint}</div>
                    ))}
                    {apiResult.api_endpoints.length > 5 && (
                      <div className="text-gray-500">...and {apiResult.api_endpoints.length - 5} more</div>
                    )}
                  </div>
                </div>
              )}

              {apiResult.external_services.length > 0 && (
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">External Services:</h4>
                  <div className="text-xs space-y-1">
                    {apiResult.external_services.slice(0, 3).map((service, index) => (
                      <div key={index} className="bg-green-100 px-2 py-1 rounded">{service}</div>
                    ))}
                    {apiResult.external_services.length > 3 && (
                      <div className="text-gray-500">...and {apiResult.external_services.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4" dangerouslySetInnerHTML={{ __html: apiResult.diagram }} />
            </div>
          )}
        </div>

        {/* Changelogs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Changelogs</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Document (Optional)</label>
              <select
                value={changelogForm.documentId}
                onChange={(e) => setChangelogForm(prev => ({ ...prev, documentId: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a document...</option>
                {availableDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Changelog Type</label>
              <select
                value={changelogForm.changelogType}
                onChange={(e) => setChangelogForm(prev => ({ ...prev, changelogType: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="semantic">Semantic (Version-based)</option>
                <option value="chronological">Chronological (Date-based)</option>
                <option value="feature">Feature-based</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (if no document selected)</label>
              <textarea
                value={changelogForm.content}
                onChange={(e) => setChangelogForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your changelog content here..."
                required={!changelogForm.documentId}
                disabled={!!changelogForm.documentId}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
              />
              {changelogForm.documentId && (
                <p className="text-sm text-gray-500 mt-1">Content will be automatically loaded from the selected document</p>
              )}
            </div>

            <button
              onClick={handleChangelog}
              disabled={loading.changelog || (!changelogForm.content && !changelogForm.documentId)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.changelog ? 'Generating...' : 'Generate Changelog'}
            </button>
          </div>

          {changelogResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Changelog Result</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadMermaid(changelogResult.mermaid_code, 'changelog')}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium">Versions:</span> {changelogResult.version_history.length}
                </div>
                <div>
                  <span className="font-medium">Total Changes:</span> {changelogResult.total_changes}
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: changelogResult.changelog.replace(/\n/g, '<br>') }} />
              </div>

              <div className="mt-4" dangerouslySetInnerHTML={{ __html: changelogResult.diagram }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualizations;
