import React, { useState, useEffect } from 'react';
import { Brain, FileText, MessageSquare, Zap, Loader2, CheckCircle, AlertCircle, Clock, Github } from 'lucide-react';

const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('summarize');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [summarizeForm, setSummarizeForm] = useState({
    content: '',
    maxLength: 300,
    summaryType: 'comprehensive',
    focus: 'general'
  });

  const [qaForm, setQaForm] = useState({
    question: '',
    context: '',
    documentId: ''
  });

  const [availableDocuments, setAvailableDocuments] = useState([]);

  const [generateForm, setGenerateForm] = useState({
    githubUrl: '',
    projectType: 'api',
    includeExamples: true,
    language: 'en'
  });

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert camelCase to snake_case for backend compatibility
      const backendData = {
        content: summarizeForm.content,
        max_length: summarizeForm.maxLength,
        summary_type: summarizeForm.summaryType
      };

      const response = await fetch('http://localhost:8000/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/ai/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qaForm),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/docs/');
      if (response.ok) {
        const documents = await response.json();
        setAvailableDocuments(documents);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    fetchAvailableDocuments();
  }, []);

  const handleGenerateDocs = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert camelCase to snake_case for backend compatibility
      const backendData = {
        github_url: generateForm.githubUrl,
        project_type: generateForm.projectType,
        include_examples: generateForm.includeExamples,
        language: generateForm.language
      };

      const response = await fetch('http://localhost:8000/api/ai/generate-from-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate documentation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'qa', label: 'Q&A Search', icon: MessageSquare },
    { id: 'generate', label: 'Generate Docs', icon: Zap }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">AI-Powered Documentation</h1>
        </div>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Leverage AI to simplify writing, speed up reading, and make documentation maintenance effortless
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
        {activeTab === 'summarize' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Smart Summarization</h2>
              <p className="text-secondary-600">Get concise summaries of long documentation with AI-powered insights</p>
            </div>

            <form onSubmit={handleSummarize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content to Summarize
                </label>
                <textarea
                  value={summarizeForm.content}
                  onChange={(e) => setSummarizeForm({...summarizeForm, content: e.target.value})}
                  placeholder="Paste your long documentation content here..."
                  className="w-full h-32 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Summary Type
                  </label>
                  <select
                    value={summarizeForm.summaryType}
                    onChange={(e) => setSummarizeForm({...summarizeForm, summaryType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="brief">Brief (50-150 words)</option>
                    <option value="comprehensive">Comprehensive (100-400 words)</option>
                    <option value="detailed">Detailed (200-600 words)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Maximum Length
                  </label>
                  <select
                    value={summarizeForm.maxLength}
                    onChange={(e) => setSummarizeForm({...summarizeForm, maxLength: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={150}>150 words</option>
                    <option value={300}>300 words</option>
                    <option value={400}>400 words</option>
                    <option value={500}>500 words</option>
                    <option value={600}>600 words</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Focus Area
                  </label>
                  <select
                    value={summarizeForm.focus}
                    onChange={(e) => setSummarizeForm({...summarizeForm, focus: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="general">General Overview</option>
                    <option value="technical">Technical Details</option>
                    <option value="user-guide">User Guide</option>
                    <option value="api">API Reference</option>
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
                    Summarizing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Summary
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                    <h3 className="text-lg font-semibold text-success-900">Summary Generated</h3>
                  </div>
                  <div className="text-sm text-success-700">
                    {result.summary_type && (
                      <span className="px-2 py-1 bg-success-100 rounded text-xs font-medium">
                        {result.summary_type.charAt(0).toUpperCase() + result.summary_type.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{result.word_count || 0}</div>
                    <div className="text-xs text-secondary-600">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{result.sentence_count || 0}</div>
                    <div className="text-xs text-secondary-600">Sentences</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{result.avg_sentence_length || 0}</div>
                    <div className="text-xs text-secondary-600">Avg. Length</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success-600">{Math.round(result.reduction_percentage || 0)}%</div>
                    <div className="text-xs text-secondary-600">Reduction</div>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-secondary-800 leading-relaxed">{result.summary}</p>
                </div>
                
                {result.key_points && (
                  <div className="mt-4">
                    <h4 className="font-medium text-success-900 mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside space-y-1 text-secondary-700">
                      {result.key_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Documentation Q&A</h2>
              <p className="text-secondary-600">Ask questions about your documentation and get instant AI-powered answers</p>
            </div>

            <form onSubmit={handleQA} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={qaForm.question}
                  onChange={(e) => setQaForm({...qaForm, question: e.target.value})}
                  placeholder="What would you like to know about the documentation?"
                  className="w-full h-24 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Document (Optional)
                </label>
                <select
                  value={qaForm.documentId}
                  onChange={(e) => setQaForm({...qaForm, documentId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">-- Choose a saved document --</option>
                  {availableDocuments.map((doc) => (
                    <option key={doc.doc_id} value={doc.doc_id}>
                      {doc.title} ({doc.content_type})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-secondary-500 mt-1">
                  Select a document to get context-aware answers. Leave empty for general questions.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={qaForm.context}
                  onChange={(e) => setQaForm({...qaForm, context: e.target.value})}
                  placeholder="Provide any additional context or specific details..."
                  className="w-full h-20 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Ask Question
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                    <h3 className="text-lg font-semibold text-primary-900">Answer Found</h3>
                  </div>
                  {result.document_used && (
                    <div className="text-sm text-primary-700">
                      📄 {result.document_title}
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-secondary-800 leading-relaxed">{result.answer}</p>
                </div>
                
                {/* Confidence and Document Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 p-3 bg-white rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600">{Math.round(result.confidence * 100)}%</div>
                    <div className="text-xs text-secondary-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600">{result.sources?.length || 0}</div>
                    <div className="text-xs text-secondary-600">Sources</div>
                  </div>
                </div>
                
                {result.sources && (
                  <div className="mt-4">
                    <h4 className="font-medium text-primary-900 mb-2">Sources:</h4>
                    <ul className="space-y-1 text-secondary-700">
                      {result.sources.map((source, index) => (
                        <li key={index} className="text-sm">
                          {typeof source === 'string' ? source : (
                            <>
                              <span className="font-medium">{source.title}</span>
                              {source.section && <span className="text-secondary-500"> - {source.section}</span>}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {result.related_questions && (
                  <div className="mt-4">
                    <h4 className="font-medium text-primary-900 mb-2">Related Questions:</h4>
                    <ul className="space-y-1 text-secondary-700">
                      {result.related_questions.map((question, index) => (
                        <li key={index} className="text-sm">
                          • {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Auto-Generate Documentation</h2>
              <p className="text-secondary-600">Generate comprehensive documentation from GitHub repositories using AI analysis</p>
            </div>

            <form onSubmit={handleGenerateDocs} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="url"
                    value={generateForm.githubUrl}
                    onChange={(e) => setGenerateForm({...generateForm, githubUrl: e.target.value})}
                    placeholder="https://github.com/username/repository"
                    className="w-full pl-10 pr-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    required
                  />
                </div>
                <p className="text-sm text-secondary-500 mt-1">
                  Paste a GitHub repository URL to generate starter documentation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={generateForm.projectType}
                    onChange={(e) => setGenerateForm({...generateForm, projectType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="api">API/Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="library">Library/Package</option>
                    <option value="cli">CLI Tool</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Language
                  </label>
                  <select
                    value={generateForm.language}
                    onChange={(e) => setGenerateForm({...generateForm, language: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ms">Bahasa Melayu</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeExamples"
                    checked={generateForm.includeExamples}
                    onChange={(e) => setGenerateForm({...generateForm, includeExamples: e.target.checked})}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="includeExamples" className="ml-2 text-sm text-secondary-700">
                    Include Examples
                  </label>
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
                    Generating Documentation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Generate Documentation
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">Documentation Generated</h3>
                </div>
                
                <div className="space-y-4">
                  {result.readme && (
                    <div>
                      <h4 className="font-medium text-success-900 mb-2">README.md</h4>
                      <div className="bg-white p-4 rounded-lg border border-success-200">
                        <pre className="text-sm text-secondary-800 whitespace-pre-wrap">{result.readme}</pre>
                      </div>
                    </div>
                  )}
                  
                  {result.api_docs && (
                    <div>
                      <h4 className="font-medium text-success-900 mb-2">API Documentation</h4>
                      <div className="bg-white p-4 rounded-lg border border-success-200">
                        <pre className="text-sm text-secondary-800 whitespace-pre-wrap">{result.api_docs}</pre>
                      </div>
                    </div>
                  )}
                  
                  {result.setup_guide && (
                    <div>
                      <h4 className="font-medium text-success-900 mb-2">Setup Guide</h4>
                      <div className="bg-white p-4 rounded-lg border border-success-200">
                        <pre className="text-sm text-secondary-800 whitespace-pre-wrap">{result.setup_guide}</pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Download All
                  </button>
                  <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Edit in Editor
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
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

export default AIFeatures;
