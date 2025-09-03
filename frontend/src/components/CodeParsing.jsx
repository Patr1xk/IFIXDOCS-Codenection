import React, { useState } from 'react';
import { Code, FileText, Upload, FileCode, BarChart3, AlertTriangle, CheckCircle, Loader2, Github, Download } from 'lucide-react';

const CodeParsing = () => {
  const [activeTab, setActiveTab] = useState('code');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  // Form states
  const [codeForm, setCodeForm] = useState({
    code: '',
    language: 'python',
    analysisType: 'structure'
  });

  const [swaggerForm, setSwaggerForm] = useState({
    swaggerContent: '',
    format: 'json'
  });

  const [uploadForm, setUploadForm] = useState({
    file: null,
    description: '',
    tags: ''
  });

  // Load supported languages on component mount
  React.useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/parsing/languages');
      if (response.ok) {
        const data = await response.json();
        setSupportedLanguages(data.languages || ['python', 'javascript', 'typescript', 'java', 'go', 'rust']);
      }
    } catch (err) {
      console.error('Failed to fetch supported languages:', err);
      // Fallback to default languages
      setSupportedLanguages(['python', 'javascript', 'typescript', 'java', 'go', 'rust']);
    }
  };

  const handleCodeAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/parsing/parse-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(codeForm),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze code');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwaggerParse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/parsing/parse-swagger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swaggerForm),
      });

      if (!response.ok) {
        throw new Error('Failed to parse Swagger/OpenAPI');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('description', uploadForm.description);
      formData.append('tags', uploadForm.tags);

      const response = await fetch('http://localhost:8000/api/parsing/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadForm({ ...uploadForm, file });
  };

  const tabs = [
    { id: 'code', label: 'Code Analysis', icon: Code },
    { id: 'swagger', label: 'Swagger/OpenAPI', icon: FileCode },
    { id: 'upload', label: 'File Upload', icon: Upload }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">Code Parsing & Analysis</h1>
        </div>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Automatically parse and analyze code to generate comprehensive documentation and insights
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 shadow-sm border border-secondary-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'code' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Code Structure Analysis</h2>
              <p className="text-secondary-600">Analyze your code to understand structure, dependencies, and generate documentation</p>
            </div>

            <form onSubmit={handleCodeAnalysis} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Code Content
                </label>
                <textarea
                  value={codeForm.code}
                  onChange={(e) => setCodeForm({...codeForm, code: e.target.value})}
                  placeholder="Paste your code here for analysis..."
                  className="w-full h-48 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Programming Language
                  </label>
                  <select
                    value={codeForm.language}
                    onChange={(e) => setCodeForm({...codeForm, language: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Analysis Type
                  </label>
                  <select
                    value={codeForm.analysisType}
                    onChange={(e) => setCodeForm({...codeForm, analysisType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="structure">Code Structure</option>
                    <option value="dependencies">Dependencies</option>
                    <option value="complexity">Complexity Analysis</option>
                    <option value="documentation">Documentation Generation</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Analyzing Code...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Code className="w-5 h-5 mr-2" />
                    Analyze Code
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">Analysis Complete</h3>
                </div>
                
                {result.structure && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">Code Structure:</h4>
                    <div className="bg-white p-4 rounded-lg border border-success-200">
                      <pre className="text-sm text-secondary-800 whitespace-pre-wrap">{JSON.stringify(result.structure, null, 2)}</pre>
                    </div>
                  </div>
                )}
                
                {result.functions && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">Functions Found:</h4>
                    <div className="space-y-2">
                      {result.functions.map((func, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-success-200">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-secondary-800">{func.name}</span>
                            <span className="text-sm text-secondary-600">Line {func.line}</span>
                          </div>
                          {func.docstring && (
                            <p className="text-sm text-secondary-700 mt-1">{func.docstring}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.complexity && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">Complexity Metrics:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-success-200 text-center">
                        <div className="text-2xl font-bold text-success-600">{result.complexity.cyclomatic}</div>
                        <div className="text-sm text-secondary-600">Cyclomatic Complexity</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-success-200 text-center">
                        <div className="text-2xl font-bold text-success-600">{result.complexity.lines}</div>
                        <div className="text-sm text-secondary-600">Lines of Code</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'swagger' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Swagger/OpenAPI Parser</h2>
              <p className="text-secondary-600">Parse OpenAPI specifications to generate comprehensive API documentation</p>
            </div>

            <form onSubmit={handleSwaggerParse} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Swagger/OpenAPI Content
                </label>
                <textarea
                  value={swaggerForm.swaggerContent}
                  onChange={(e) => setSwaggerForm({...swaggerForm, swaggerContent: e.target.value})}
                  placeholder="Paste your Swagger/OpenAPI specification (JSON or YAML)..."
                  className="w-full h-48 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Format
                </label>
                <select
                  value={swaggerForm.format}
                  onChange={(e) => setSwaggerForm({...swaggerForm, format: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="auto">Auto-detect</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Parsing Specification...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FileCode className="w-5 h-5 mr-2" />
                    Parse Specification
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">Specification Parsed</h3>
                </div>
                
                {result.info && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">API Information:</h4>
                    <div className="bg-white p-4 rounded-lg border border-success-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-secondary-700">Title:</span>
                          <p className="text-secondary-800">{result.info.title}</p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary-700">Version:</span>
                          <p className="text-secondary-800">{result.info.version}</p>
                        </div>
                        <div>
                          <span className="font-medium text-secondary-700">Description:</span>
                          <p className="text-secondary-800">{result.info.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {result.endpoints && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">API Endpoints ({result.endpoints.length}):</h4>
                    <div className="space-y-2">
                      {result.endpoints.map((endpoint, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-success-200">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-secondary-800">{endpoint.method} {endpoint.path}</span>
                            <span className="text-sm text-secondary-600">{endpoint.summary}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {result.models && (
                  <div className="mb-4">
                    <h4 className="font-medium text-success-900 mb-2">Data Models ({result.models.length}):</h4>
                    <div className="space-y-2">
                      {result.models.map((model, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border border-success-200">
                          <div className="font-medium text-secondary-800 mb-1">{model.name}</div>
                          <div className="text-sm text-secondary-600">{model.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">File Upload & Analysis</h2>
              <p className="text-secondary-600">Upload code files for automatic parsing and documentation generation</p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select File
                </label>
                <div className="border-2 border-dashed border-secondary-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".py,.js,.ts,.java,.go,.rs,.cpp,.c,.h,.md,.txt"
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-secondary-600 mb-2">
                      <span className="font-medium text-primary-600 hover:text-primary-700">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-sm text-secondary-500">
                      Supported: Python, JavaScript, TypeScript, Java, Go, Rust, C++, C, Markdown, Text
                    </div>
                  </label>
                  {uploadForm.file && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary-900">{uploadForm.file.name}</span>
                        <span className="text-xs text-primary-600">{(uploadForm.file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Describe what this file contains or what you want to analyze..."
                  className="w-full h-20 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="api, backend, authentication, etc."
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
                <p className="text-sm text-secondary-500 mt-1">Separate tags with commas</p>
              </div>

              <button
                type="submit"
                disabled={loading || !uploadForm.file}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Uploading & Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload & Analyze
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">File Analysis Complete</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-success-200">
                    <h4 className="font-medium text-success-900 mb-2">File Information:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-secondary-700">Filename:</span>
                        <p className="text-secondary-800">{result.filename}</p>
                      </div>
                      <div>
                        <span className="font-medium text-secondary-700">Language:</span>
                        <p className="text-secondary-800">{result.language}</p>
                      </div>
                      <div>
                        <span className="font-medium text-secondary-700">Size:</span>
                        <p className="text-secondary-800">{result.size} bytes</p>
                      </div>
                      <div>
                        <span className="font-medium text-secondary-700">Lines:</span>
                        <p className="text-secondary-800">{result.lines}</p>
                      </div>
                    </div>
                  </div>
                  
                  {result.analysis && (
                    <div className="bg-white p-4 rounded-lg border border-success-200">
                      <h4 className="font-medium text-success-900 mb-2">Analysis Results:</h4>
                      <pre className="text-sm text-secondary-800 whitespace-pre-wrap">{JSON.stringify(result.analysis, null, 2)}</pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download Report
                  </button>
                  <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Generate Documentation
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeParsing;
