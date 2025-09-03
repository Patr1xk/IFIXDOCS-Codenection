import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Upload, Download, Edit, Trash2, Eye, Tag, Calendar, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    contentType: 'markdown',
    language: 'en',
    tags: '',
    author: 'anonymous',
    version: '1.0.0'
  });

  const [uploadForm, setUploadForm] = useState({
    title: '',
    language: 'en',
    tags: '',
    author: 'anonymous'
  });

  const [searchForm, setSearchForm] = useState({
    query: '',
    language: '',
    tags: '',
    contentType: ''
  });

  // Load data on component mount
  useEffect(() => {
    fetchDocuments();
    fetchTemplates();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/docs/');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/docs/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tags = createForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('http://localhost:8000/api/docs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createForm,
          tags
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const newDoc = await response.json();
      setDocuments([newDoc, ...documents]);
      setShowCreateForm(false);
      setCreateForm({
        title: '',
        content: '',
        contentType: 'markdown',
        language: 'en',
        tags: '',
        author: 'anonymous',
        version: '1.0.0'
      });
      setSuccess('Document created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('language', uploadForm.language);
      formData.append('tags', uploadForm.tags);
      formData.append('author', uploadForm.author);

      const response = await fetch('http://localhost:8000/api/docs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const result = await response.json();
      setDocuments([result.document, ...documents]);
      setShowUploadForm(false);
      setUploadForm({
        title: '',
        language: 'en',
        tags: '',
        author: 'anonymous'
      });
      setSuccess('Document uploaded successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/docs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchForm),
      });

      if (!response.ok) {
        throw new Error('Failed to search documents');
      }

      const data = await response.json();
      setDocuments(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/docs/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(documents.filter(doc => doc.doc_id !== docId));
      setSuccess('Document deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Document
          </button>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchForm.query}
              onChange={(e) => setSearchForm({...searchForm, query: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={searchForm.language}
              onChange={(e) => setSearchForm({...searchForm, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <select
              value={searchForm.contentType}
              onChange={(e) => setSearchForm({...searchForm, contentType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="rst">RST</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.doc_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                          <div className="text-sm text-gray-500">v{doc.version}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.content_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.language}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'published' ? 'bg-green-100 text-green-800' :
                        doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.doc_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Document Templates</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.template_id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-500">{template.category}</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <strong>Variables:</strong> {template.variables.join(', ')}
              </div>
            </div>
            
            <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Document</h3>
        
        <form onSubmit={handleCreateDocument} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={createForm.contentType}
                onChange={(e) => setCreateForm({...createForm, contentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
                <option value="rst">RST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={createForm.language}
                onChange={(e) => setCreateForm({...createForm, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
              <input
                type="text"
                value={createForm.version}
                onChange={(e) => setCreateForm({...createForm, version: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={createForm.tags}
              onChange={(e) => setCreateForm({...createForm, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="api, documentation, tutorial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={createForm.content}
              onChange={(e) => setCreateForm({...createForm, content: e.target.value})}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your document content..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderUploadForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
        
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document File</label>
            <input
              type="file"
              onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
              accept=".md,.html,.htm,.rst,.txt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={uploadForm.language}
                onChange={(e) => setUploadForm({...uploadForm, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={uploadForm.author}
                onChange={(e) => setUploadForm({...uploadForm, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="api, documentation, tutorial"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderDocumentViewer = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.title}</h3>
          <button
            onClick={() => setSelectedDocument(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 font-medium">{selectedDocument.content_type}</span>
            </div>
            <div>
              <span className="text-gray-500">Language:</span>
              <span className="ml-2 font-medium">{selectedDocument.language}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 font-medium">{selectedDocument.status}</span>
            </div>
            <div>
              <span className="text-gray-500">Version:</span>
              <span className="ml-2 font-medium">{selectedDocument.version}</span>
            </div>
          </div>
          
          {selectedDocument.tags && selectedDocument.tags.length > 0 && (
            <div>
              <span className="text-gray-500 text-sm">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedDocument.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Content</h4>
            <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-900">{selectedDocument.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documentation Management</h1>
            <p className="text-gray-600">Create, manage, and organize your documentation with powerful tools and templates</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'documents' && renderDocumentsTab()}
      {activeTab === 'templates' && renderTemplatesTab()}

      {/* Modals */}
      {showCreateForm && renderCreateForm()}
      {showUploadForm && renderUploadForm()}
      {selectedDocument && renderDocumentViewer()}
    </div>
  );
};

export default Documentation;
