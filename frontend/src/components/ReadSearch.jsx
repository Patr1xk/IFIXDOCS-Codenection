import { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  BarChart3, 
  FileText, 
  BookOpen,
  TrendingUp,
  Filter,
  Download,
  Share2
} from 'lucide-react';

const ReadSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockSearchResults = [
    {
      id: 1,
      title: 'API Authentication Guide',
      excerpt: 'Complete guide to implementing OAuth 2.0 authentication in your applications...',
      category: 'API Documentation',
      lastUpdated: '2 days ago',
      relevance: 95,
      tags: ['authentication', 'oauth', 'security']
    },
    {
      id: 2,
      title: 'Database Schema v2.1',
      excerpt: 'Updated database schema with new user management tables and improved indexing...',
      category: 'Technical Specs',
      lastUpdated: '1 week ago',
      relevance: 87,
      tags: ['database', 'schema', 'sql']
    },
    {
      id: 3,
      title: 'Frontend Component Library',
      excerpt: 'Comprehensive guide to reusable React components with examples and best practices...',
      category: 'Frontend',
      lastUpdated: '3 days ago',
      relevance: 92,
      tags: ['react', 'components', 'ui']
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSearchResults(mockSearchResults);
    setIsSearching(false);
  };

  const tabs = [
    { id: 'search', label: 'Search & Browse', icon: Search },
    { id: 'summarize', label: 'AI Summarization', icon: MessageSquare },
    { id: 'qa', label: 'Q&A Assistant', icon: MessageSquare },
    { id: 'visualize', label: 'Visualizations', icon: BarChart3 }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-header">Read & Search Documentation</h1>
        <p className="section-subtitle">
          Find exactly what you need with AI-powered search, smart summarization, and intelligent Q&A assistance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask a question, search documentation, or describe what you're looking for..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="border-b border-secondary-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {/* Search Results */}
        {activeTab === 'search' && searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Search Results ({searchResults.length})
              </h3>
              <div className="flex items-center space-x-3">
                <button className="btn-outline flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="btn-outline flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            
            {searchResults.map((result) => (
              <div key={result.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-secondary-900">{result.title}</h4>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                        {result.category}
                      </span>
                      <span className="text-sm text-secondary-500">{result.lastUpdated}</span>
                    </div>
                    <p className="text-secondary-600 mb-3">{result.excerpt}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-success-600" />
                        <span className="text-sm text-secondary-600">
                          {result.relevance}% relevant
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {result.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button className="btn-outline p-2">
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button className="btn-outline p-2">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Summarization */}
        {activeTab === 'summarize' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">AI Document Summarization</h3>
            <p className="text-secondary-600 mb-6">
              Upload a document or paste text to get an AI-generated summary with key points and insights.
            </p>
            <div className="space-y-4">
              <textarea
                placeholder="Paste your document content here for summarization..."
                rows={8}
                className="input-field"
              />
              <button className="btn-primary flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Generate Summary</span>
              </button>
            </div>
          </div>
        )}

        {/* Q&A Assistant */}
        {activeTab === 'qa' && (
          <div className="card">
            <h3 className="text-xl font-semibold text-secondary-900 mb-4">AI Q&A Assistant</h3>
            <p className="text-secondary-600 mb-6">
              Ask questions about your documentation and get intelligent, contextual answers.
            </p>
            <div className="space-y-4">
              <textarea
                placeholder="Ask a question about your documentation..."
                rows={4}
                className="input-field"
              />
              <button className="btn-primary flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Ask Question</span>
              </button>
            </div>
          </div>
        )}

        {/* Visualizations */}
        {activeTab === 'visualize' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Documentation Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold text-primary-600">1,247</p>
                  <p className="text-sm text-secondary-600">Total Documents</p>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-success-600" />
                  </div>
                  <p className="text-2xl font-bold text-success-600">98%</p>
                  <p className="text-sm text-secondary-600">Up to Date</p>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-8 h-8 text-warning-600" />
                  </div>
                  <p className="text-2xl font-bold text-warning-600">23</p>
                  <p className="text-sm text-secondary-600">Needs Review</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Popular Topics</h3>
              <div className="space-y-3">
                {['API Documentation', 'Authentication', 'Database', 'Frontend', 'Deployment'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <span className="font-medium text-secondary-900">{topic}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${80 - index * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-secondary-600">{80 - index * 10}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadSearch; 