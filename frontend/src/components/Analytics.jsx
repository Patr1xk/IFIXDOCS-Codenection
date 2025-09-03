import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Search, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  Eye,
  BookOpen,
  User,
  Calendar,
  Link,
  Trash2,
  Edit3,
  Download,
  Share2,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('usage');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for analytics
  const usageData = {
    topDocs: [
      { name: 'API Authentication Guide', views: 1247, change: '+12%', trend: 'up' },
      { name: 'Getting Started Tutorial', views: 892, change: '+8%', trend: 'up' },
      { name: 'Database Schema v2.1', views: 756, change: '+15%', trend: 'up' },
      { name: 'Frontend Components', views: 634, change: '+5%', trend: 'up' },
      { name: 'Deployment Guide', views: 521, change: '-3%', trend: 'down' }
    ],
    leastViewedDocs: [
      { name: 'Legacy API v1.0', views: 23, change: '-45%', trend: 'down' },
      { name: 'Old Documentation', views: 18, change: '-67%', trend: 'down' },
      { name: 'Deprecated Features', views: 12, change: '-78%', trend: 'down' }
    ],
    searchMetrics: {
      successfulSearches: 3421,
      failedSearches: 234,
      searchSuccessRate: 93.6,
      avgSearchTime: '1.2s'
    }
  };

  const onboardingData = {
    completionRates: {
      'Day 1': 85,
      'Week 1': 72,
      'Month 1': 68,
      'Month 3': 61
    },
    bottlenecks: [
      { step: 'Initial Setup', completionRate: 95, avgTime: '15 min' },
      { step: 'First Document Creation', completionRate: 78, avgTime: '45 min' },
      { step: 'Team Collaboration', completionRate: 65, avgTime: '2 hours' },
      { step: 'Advanced Features', completionRate: 52, avgTime: '1 day' }
    ],
    newUserProgress: [
      { name: 'Alex Johnson', joinDate: '2024-01-15', setupComplete: true, docsCreated: 3, timeToComplete: '2 days' },
      { name: 'Sarah Chen', joinDate: '2024-01-20', setupComplete: true, docsCreated: 5, timeToComplete: '1 day' },
      { name: 'Mike Wilson', joinDate: '2024-01-25', setupComplete: false, docsCreated: 1, timeToComplete: 'In Progress' }
    ]
  };

  const contentHealthData = {
    outdatedPages: [
      { name: 'API v1.0 Documentation', lastUpdated: '2023-07-15', daysOutdated: 180, severity: 'high' },
      { name: 'Legacy Integration Guide', lastUpdated: '2023-08-20', daysOutdated: 150, severity: 'medium' },
      { name: 'Old Deployment Scripts', lastUpdated: '2023-09-10', daysOutdated: 120, severity: 'medium' }
    ],
    brokenLinks: [
      { page: 'Main Documentation', brokenLink: '/api/v1/endpoints', status: '404' },
      { page: 'Integration Guide', brokenLink: '/examples/legacy', status: '404' }
    ],
    unusedSections: [
      { name: 'Advanced Configuration', usage: '2%', lastAccessed: '2023-11-15' },
      { name: 'Legacy Examples', usage: '1%', lastAccessed: '2023-10-20' }
    ],
    redundantPages: [
      { name: 'API Guide v1.0', duplicateOf: 'API Guide v2.0', similarity: '87%' },
      { name: 'Old Tutorial', duplicateOf: 'Getting Started', similarity: '92%' }
    ]
  };

  const collaborationData = {
    topContributors: [
      { name: 'Sarah Chen', docsCreated: 24, docsUpdated: 67, totalContributions: 91, avatar: 'SC' },
      { name: 'Mike Rodriguez', docsCreated: 18, docsUpdated: 52, totalContributions: 70, avatar: 'MR' },
      { name: 'Lisa Wang', docsCreated: 15, docsUpdated: 45, totalContributions: 60, avatar: 'LW' },
      { name: 'David Kim', docsCreated: 12, docsUpdated: 38, totalContributions: 50, avatar: 'DK' }
    ],
    teamActivity: [
      { team: 'Engineering', docsCreated: 45, docsUpdated: 128, avgResponseTime: '2.4h' },
      { team: 'Product', docsCreated: 32, docsUpdated: 89, avgResponseTime: '4.1h' },
      { team: 'Design', docsCreated: 18, docsUpdated: 56, avgResponseTime: '3.2h' },
      { team: 'Marketing', docsCreated: 12, docsUpdated: 34, avgResponseTime: '5.8h' }
    ],
    projectUpdates: [
      { project: 'API Documentation', lastUpdate: '2 hours ago', contributors: 5, status: 'active' },
      { project: 'User Guides', lastUpdate: '1 day ago', contributors: 3, status: 'active' },
      { project: 'Technical Specs', lastUpdate: '3 days ago', contributors: 4, status: 'needs-review' }
    ]
  };

  const engagementData = {
    timeSpent: [
      { doc: 'API Authentication Guide', avgTime: '8.5 min', totalTime: '1,247 hours', sessions: 8792 },
      { doc: 'Getting Started Tutorial', avgTime: '12.3 min', totalTime: '892 hours', sessions: 4356 },
      { doc: 'Database Schema v2.1', avgTime: '6.2 min', totalTime: '756 hours', sessions: 7320 },
      { doc: 'Frontend Components', avgTime: '9.1 min', totalTime: '634 hours', sessions: 4176 },
      { doc: 'Deployment Guide', avgTime: '15.7 min', totalTime: '521 hours', sessions: 1992 }
    ],
    dropOffRates: [
      { doc: 'API Authentication Guide', dropOffRate: 23, dropOffPoint: 'Step 3: OAuth Setup' },
      { doc: 'Getting Started Tutorial', dropOffRate: 31, dropOffPoint: 'Advanced Configuration' },
      { doc: 'Database Schema v2.1', dropOffRate: 18, dropOffPoint: 'Performance Optimization' },
      { doc: 'Frontend Components', dropOffRate: 27, dropOffPoint: 'Custom Styling' },
      { doc: 'Deployment Guide', dropOffRate: 42, dropOffPoint: 'Production Deployment' }
    ],
    userJourney: [
      { step: 'Landing Page', users: 100, completion: 85 },
      { step: 'Documentation Search', users: 85, completion: 72 },
      { step: 'Document View', users: 72, completion: 68 },
      { step: 'Action Taken', users: 68, completion: 45 }
    ]
  };

  const tabs = [
    { id: 'usage', label: 'Usage Analytics', icon: TrendingUp },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'health', label: 'Content Health', icon: CheckCircle },
    { id: 'collaboration', label: 'Collaboration', icon: User },
    { id: 'engagement', label: 'Engagement', icon: Eye }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const renderUsageAnalytics = () => (
    <div className="space-y-8">
      {/* Search Success Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +2.5%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{usageData.searchMetrics.successfulSearches.toLocaleString()}</h3>
          <p className="text-gray-600">Successful Searches</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              -5.2%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{usageData.searchMetrics.failedSearches.toLocaleString()}</h3>
          <p className="text-gray-600">Failed Searches</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              +1.8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{usageData.searchMetrics.searchSuccessRate}%</h3>
          <p className="text-gray-600">Success Rate</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              -0.3s
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{usageData.searchMetrics.avgSearchTime}</h3>
          <p className="text-gray-600">Avg Search Time</p>
        </div>
      </div>

      {/* Top & Least Viewed Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Most Viewed Documents</h3>
          <div className="space-y-4">
            {usageData.topDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    doc.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {doc.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Least Viewed Documents</h3>
          <div className="space-y-4">
            {usageData.leastViewedDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.views.toLocaleString()} views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {doc.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOnboardingAnalytics = () => (
    <div className="space-y-8">
      {/* Completion Rates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Onboarding Completion Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(onboardingData.completionRates).map(([period, rate]) => (
            <div key={period} className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{rate}%</h4>
              <p className="text-sm text-gray-600">{period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottlenecks */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Flow Bottlenecks</h3>
        <div className="space-y-4">
          {onboardingData.bottlenecks.map((bottleneck, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{bottleneck.step}</h4>
                <p className="text-sm text-gray-600">Avg time: {bottleneck.avgTime}</p>
              </div>
              <div className="text-right">
                <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${bottleneck.completionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-gray-900">{bottleneck.completionRate}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New User Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent New User Progress</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Setup Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Docs Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time to Complete</th>
              </tr>
            </thead>
            <tbody>
              {onboardingData.newUserProgress.map((user, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                  <td className="py-3 px-4">
                    {user.setupComplete ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.docsCreated}</td>
                  <td className="py-3 px-4 text-gray-600">{user.timeToComplete}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContentHealth = () => (
    <div className="space-y-8">
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
          <p className="text-gray-600">Outdated Pages</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Link className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">2</h3>
          <p className="text-gray-600">Broken Links</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">2</h3>
          <p className="text-gray-600">Unused Sections</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">2</h3>
          <p className="text-gray-600">Redundant Pages</p>
        </div>
      </div>

      {/* Outdated Pages */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Outdated Pages (6+ months)</h3>
        <div className="space-y-4">
          {contentHealthData.outdatedPages.map((page, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
              page.severity === 'high' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div>
                <h4 className="font-medium text-gray-900">{page.name}</h4>
                <p className="text-sm text-gray-600">Last updated: {page.lastUpdated}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  page.severity === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {page.daysOutdated} days old
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Health Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Broken Links</h3>
          <div className="space-y-3">
            {contentHealthData.brokenLinks.map((link, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-gray-900">{link.page}</p>
                <p className="text-sm text-red-600">{link.brokenLink}</p>
                <p className="text-xs text-gray-500">Status: {link.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Unused Sections</h3>
          <div className="space-y-3">
            {contentHealthData.unusedSections.map((section, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-medium text-gray-900">{section.name}</p>
                <p className="text-sm text-yellow-600">Usage: {section.usage}</p>
                <p className="text-xs text-gray-500">Last accessed: {section.lastAccessed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCollaboration = () => (
    <div className="space-y-8">
      {/* Top Contributors */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Contributors</h3>
        <div className="space-y-4">
          {collaborationData.topContributors.map((contributor, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-lg font-bold text-primary-600">
                  {contributor.avatar}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{contributor.name}</h4>
                  <p className="text-sm text-gray-600">
                    {contributor.docsCreated} created, {contributor.docsUpdated} updated
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{contributor.totalContributions}</p>
                <p className="text-sm text-gray-600">Total contributions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Team Activity</h3>
        <div className="space-y-4">
          {collaborationData.teamActivity.map((team, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{team.team}</h4>
                <p className="text-sm text-gray-600">
                  {team.docsCreated} created, {team.docsUpdated} updated
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{team.avgResponseTime}</p>
                <p className="text-sm text-gray-600">Avg response time</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Updates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Project Updates</h3>
        <div className="space-y-4">
          {collaborationData.projectUpdates.map((project, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{project.project}</h4>
                <p className="text-sm text-gray-600">
                  {project.contributors} contributors • {project.lastUpdate}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status === 'active' ? 'Active' : 'Needs Review'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEngagement = () => (
    <div className="space-y-8">
      {/* Time Spent */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Document Engagement - Time Spent</h3>
        <div className="space-y-4">
          {engagementData.timeSpent.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">{doc.doc}</h4>
                  <p className="text-sm text-gray-600">{doc.sessions.toLocaleString()} sessions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{doc.avgTime}</p>
                <p className="text-sm text-gray-600">Avg time per session</p>
                <p className="text-xs text-gray-500">Total: {doc.totalTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drop-off Rates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Drop-off Analysis</h3>
        <div className="space-y-4">
          {engagementData.dropOffRates.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{doc.doc}</h4>
                <p className="text-sm text-gray-600">Drop-off point: {doc.dropOffPoint}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{doc.dropOffRate}%</p>
                <p className="text-sm text-gray-600">Drop-off rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Journey */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">User Journey Funnel</h3>
        <div className="space-y-4">
          {engagementData.userJourney.map((step, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <h4 className="font-medium text-gray-900">{step.step}</h4>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{step.users}</p>
                <p className="text-sm text-gray-600">Users: {step.completion}% completion</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600">
            Comprehensive insights into documentation usage, team performance, and content health
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'usage' && renderUsageAnalytics()}
          {activeTab === 'onboarding' && renderOnboardingAnalytics()}
          {activeTab === 'health' && renderContentHealth()}
          {activeTab === 'collaboration' && renderCollaboration()}
          {activeTab === 'engagement' && renderEngagement()}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 