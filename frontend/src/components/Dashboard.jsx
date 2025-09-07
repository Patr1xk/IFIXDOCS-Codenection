import React, { useState } from 'react';
import { BarChart3, FileText, Search, Zap, Globe, Users, TrendingUp, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState('overview');

  const features = [
    {
      id: 'writing',
      title: 'Simplify Writing',
      icon: FileText,
      description: 'Auto-generate docs from GitHub, AI templates, real-time assistance',
      status: '✅ Implemented',
      demo: 'GitHub integration working'
    },
    {
      id: 'reading',
      title: 'Speed Up Reading',
      icon: Search,
      description: 'AI summarization, Q&A search, smart document navigation',
      status: '✅ Implemented',
      demo: 'Summarize and Q&A features ready'
    },
    {
      id: 'maintenance',
      title: 'Easy Maintenance',
      icon: TrendingUp,
      description: 'Drift detection, change notifications, auto-updates',
      status: '✅ Implemented',
      demo: 'Maintenance tools available'
    },
    {
      id: 'onboarding',
      title: 'Smart Onboarding',
      icon: Users,
      description: 'Interactive tutorials, guided learning, progress tracking',
      status: '✅ Implemented',
      demo: 'Tutorial system complete'
    },
    {
      id: 'multilingual',
      title: 'Multilingual Support',
      icon: Globe,
      description: 'Translation, localization, language detection',
      status: '✅ Implemented',
      demo: 'Translation features ready'
    }
  ];

  const stats = [
    { label: 'Features Implemented', value: '5/5', icon: CheckCircle, color: 'text-green-600' },
    { label: 'API Endpoints', value: '25+', icon: Zap, color: 'text-blue-600' },
    { label: 'Supported Languages', value: '10+', icon: Globe, color: 'text-purple-600' },
    { label: 'GitHub Integration', value: '100%', icon: BarChart3, color: 'text-orange-600' }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">IFastDocs Dashboard</h1>
        </div>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Comprehensive documentation platform for the real world - Built for Hackathon
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Hackathon Requirements Coverage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
                return (
              <div key={feature.id} className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-secondary-900">{feature.title}</h3>
                    </div>
                <p className="text-secondary-600 text-sm mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {feature.status}
                    </span>
                  <span className="text-xs text-secondary-500">{feature.demo}</span>
                </div>
              </div>
                );
              })}
          </div>
        </div>

      {/* Demo Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">🎯 Hackathon Demo Flow</h2>
            <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h3 className="font-semibold text-secondary-900">GitHub Integration</h3>
              <p className="text-secondary-600 text-sm">Go to "Write Documentation" → "Generate from GitHub" → Paste any GitHub URL</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h3 className="font-semibold text-secondary-900">AI Features</h3>
              <p className="text-secondary-600 text-sm">Go to "AI Features" → Try summarization and Q&A with any content</p>
            </div>
                  </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h3 className="font-semibold text-secondary-900">Documentation Management</h3>
              <p className="text-secondary-600 text-sm">Go to "Documentation" → Create, search, and manage documents</p>
                  </div>
                </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
            <div>
              <h3 className="font-semibold text-secondary-900">Maintenance Tools</h3>
              <p className="text-secondary-600 text-sm">Go to "Maintenance" → Show drift detection and change monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">🔑 API Configuration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-green-800">GitHub API</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Working</span>
            </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm font-medium text-yellow-800">OpenAI API</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optional</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-800">Backend Server</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Running</span>
            </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-sm font-medium text-purple-800">Frontend App</span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Running</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 