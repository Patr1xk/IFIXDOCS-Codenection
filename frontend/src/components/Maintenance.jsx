import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  FileText,
  Bell,
  Settings,
  Download,
  Eye,
  Edit3,
  Trash2,
  X
} from 'lucide-react';

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('stale');
  const [staleDocs, setStaleDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [toast, setToast] = useState(null);

  // Custom toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000); // Auto dismiss after 3 seconds
  };

  const dismissToast = () => setToast(null);

  // Demo function to simulate real-time changes
  const runDemo = async () => {
    setIsDemoRunning(true);
    try {
      const response = await fetch('http://localhost:8000/api/maintenance/demo/simulate-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update the UI with simulated changes
        setStaleDocs([
          {
            id: 1,
            title: 'Flask App Documentation',
            lastUpdated: '2024-01-15',
            daysStale: 45,
            severity: 'high',
            category: 'API Documentation',
            suggestedUpdates: [
              'New `before_request` decorator added',
              'Error handling mechanism updated',
              'Route registration logic modified'
            ],
            reason: 'App.py was modified but docs weren\'t updated'
          },
          {
            id: 2,
            title: 'Blueprint System Documentation',
            lastUpdated: 'Never',
            daysStale: 999,
            severity: 'medium',
            category: 'Technical Specs',
            suggestedUpdates: [
              'New blueprint registration method',
              'Enhanced URL prefix handling'
            ],
            reason: 'New blueprint features lack documentation'
          }
        ]);
        
        setNotifications([
          {
            id: 1,
            type: 'warning',
            title: 'Code changes detected',
            message: 'Flask app.py was modified - documentation needs update',
            time: 'Just now',
            priority: 'high',
            action: 'review'
          },
          {
            id: 2,
            type: 'info',
            title: 'New component added',
            message: 'Blueprint system has new features requiring documentation',
            time: 'Just now',
            priority: 'medium',
            action: 'create'
          }
        ]);
        
        showToast('Demo completed! Check the tabs to see detected drift and notifications.');
      }
    } catch (error) {
      console.error('Demo error:', error);
      showToast('Demo failed. Please try again.', 'error');
    } finally {
      setIsDemoRunning(false);
    }
  };

  // Function to mark document as reviewed and remove from stale list
  const markAsReviewed = (docId) => {
    setStaleDocs(prev => prev.filter(doc => doc.id !== docId));
    
    // Show success notification
    const newNotification = {
      id: Date.now(),
      type: 'success',
      title: 'Document reviewed',
      message: 'Document has been marked as reviewed and removed from stale list',
      time: 'Just now',
      priority: 'low',
      action: 'view'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show success alert
    showToast('Document marked as reviewed! ✅');
  };

  // Function to refresh all documents (clear stale list)
  const refreshAllDocuments = () => {
    setStaleDocs([]);
    
    // Show success notification
    const newNotification = {
      id: Date.now(),
      type: 'success',
      title: 'All documents refreshed',
      message: 'All stale documents have been marked as reviewed and updated',
      time: 'Just now',
      priority: 'low',
      action: 'view'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show success alert
    showToast('All documents refreshed! 🎉');
  };

  // Function to simulate dependent component changes
  const simulateDependencyChanges = () => {
    const dependencyNotifications = [
      {
        id: Date.now() + 1,
        type: 'warning',
        title: 'Database Schema Changed',
        message: 'User table structure modified - affects Authentication API documentation',
        time: 'Just now',
        priority: 'high',
        action: 'review',
        affectedComponents: ['Auth API', 'User Management', 'Login Flow']
      },
      {
        id: Date.now() + 2,
        type: 'info',
        title: 'Payment Service Updated',
        message: 'Stripe integration updated to v3.0 - payment flow docs need review',
        time: 'Just now',
        priority: 'medium',
        action: 'update',
        affectedComponents: ['Payment API', 'Checkout Process', 'Billing Docs']
      },
      {
        id: Date.now() + 3,
        type: 'warning',
        title: 'API Endpoint Deprecated',
        message: '/api/v1/users endpoint deprecated - update client documentation',
        time: 'Just now',
        priority: 'high',
        action: 'review',
        affectedComponents: ['Client SDK', 'API Reference', 'Integration Guide']
      }
    ];

    setNotifications(prev => [...dependencyNotifications, ...prev]);
    showToast('Dependency changes detected! Check notifications for affected components.');
  };

  const mockStaleDocs = [
    {
      id: 1,
      title: 'API Authentication Guide',
      lastUpdated: '2024-01-15',
      daysStale: 45,
      severity: 'high',
      category: 'API Documentation',
      suggestedUpdates: [
        'OAuth 2.0 flow has been updated to v2.1',
        'New security headers are required',
        'Rate limiting policies have changed'
      ]
    },
    {
      id: 2,
      title: 'Database Schema Documentation',
      lastUpdated: '2024-02-01',
      daysStale: 28,
      severity: 'medium',
      category: 'Technical Specs',
      suggestedUpdates: [
        'New user table fields added',
        'Indexing strategy updated',
        'Backup procedures modified'
      ]
    },
    {
      id: 3,
      title: 'Deployment Guide',
      lastUpdated: '2024-01-20',
      daysStale: 40,
      severity: 'high',
      category: 'Operations',
      suggestedUpdates: [
        'Docker configuration changed',
        'Environment variables updated',
        'Health check endpoints modified'
      ]
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Document needs review',
      message: 'API Authentication Guide has been flagged as potentially outdated',
      time: '2 hours ago',
      priority: 'high',
      action: 'review'
    },
    {
      id: 2,
      type: 'info',
      title: 'New version available',
      message: 'Database schema has been updated to v2.1',
      time: '1 day ago',
      priority: 'medium',
      action: 'update'
    },
    {
      id: 3,
      type: 'success',
      title: 'Auto-sync completed',
      message: '5 documents have been automatically updated from source code',
      time: '3 days ago',
      priority: 'low',
      action: 'view'
    }
  ];

  const tabs = [
    { id: 'stale', label: 'Stale Documents', icon: AlertTriangle, count: staleDocs.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.length },
    { id: 'auto-updates', label: 'Auto Updates', icon: RefreshCw },
    { id: 'health', label: 'Document Health', icon: CheckCircle }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error-100 text-error-700 border-error-200';
      case 'medium': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low': return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      default: return 'bg-secondary-100 text-secondary-700 border-secondary-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-100 text-error-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-success-100 text-success-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="section-header">Document Maintenance</h1>
            <p className="section-subtitle">
              Keep your documentation healthy and up-to-date with automated monitoring and smart suggestions.
            </p>
          </div>
                     <div className="flex space-x-3">
             <button
               onClick={runDemo}
               disabled={isDemoRunning}
               className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
             >
               {isDemoRunning ? (
                 <>
                   <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                   Running Demo...
                 </>
               ) : (
                 <>
                   <Eye className="w-4 h-4 mr-2" />
                   Demo: Simulate Changes
                 </>
               )}
             </button>
             <button
               onClick={simulateDependencyChanges}
               className="bg-warning-600 text-white px-6 py-3 rounded-lg hover:bg-warning-700 flex items-center"
             >
               <AlertTriangle className="w-4 h-4 mr-2" />
               Simulate Dependencies
             </button>
           </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-8 h-8 text-error-600" />
          </div>
          <p className="text-2xl font-bold text-error-600">{staleDocs.length > 0 ? staleDocs.length : (mockStaleDocs.length > 0 ? mockStaleDocs.length : 0)}</p>
          <p className="text-sm text-secondary-600">Stale Documents</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-8 h-8 text-warning-600" />
          </div>
          <p className="text-2xl font-bold text-warning-600">28</p>
          <p className="text-sm text-secondary-600">Avg. Days Stale</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <p className="text-2xl font-bold text-success-600">98%</p>
          <p className="text-sm text-secondary-600">Health Score</p>
        </div>
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-primary-600">5</p>
          <p className="text-sm text-secondary-600">Auto Updates</p>
        </div>
      </div>

      {/* Maintenance Tabs */}
      <div className="card">
        <div className="border-b border-secondary-200 mb-6 maintenance-tabs">
          <nav className="flex space-x-8">
                         {[
               { id: 'stale', label: 'Stale Documents', icon: Clock },
               { id: 'notifications', label: 'Notifications', icon: Bell },
               { id: 'dependencies', label: 'Dependencies', icon: RefreshCw },
               { id: 'health', label: 'Health Score', icon: CheckCircle }
             ].map((tab) => {
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

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {/* Stale Documents */}
          {activeTab === 'stale' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-secondary-900">
                  Stale Documents ({(staleDocs.length > 0 ? staleDocs : mockStaleDocs).length})
                </h3>
                <div className="flex space-x-3">
                  <button className="btn-outline flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                  <button 
                    className="btn-primary flex items-center space-x-2"
                    onClick={refreshAllDocuments}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh All</span>
                  </button>
                </div>
              </div>
              
              {(staleDocs.length > 0 ? staleDocs : mockStaleDocs).length > 0 ? (
                (staleDocs.length > 0 ? staleDocs : mockStaleDocs).map((doc) => (
                <div key={doc.id} className="card border-l-4 border-l-error-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-semibold text-secondary-900">{doc.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(doc.severity)}`}>
                          {doc.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                          {doc.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-secondary-600 mb-2">
                            <strong>Last Updated:</strong> {doc.lastUpdated} ({doc.daysStale} days ago)
                          </p>
                          <p className="text-sm text-secondary-600">
                            <strong>Severity:</strong> {doc.severity === 'high' ? 'Critical - Immediate attention required' : 
                                                      doc.severity === 'medium' ? 'Moderate - Update within a week' : 
                                                      'Low - Update when convenient'}
                          </p>
                          {doc.reason && (
                            <p className="text-sm text-secondary-600 mt-2">
                              <strong>Reason:</strong> {doc.reason}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-secondary-700 mb-2">Suggested Updates:</p>
                          <ul className="space-y-1">
                            {doc.suggestedUpdates.map((update, index) => (
                              <li key={index} className="text-sm text-secondary-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{update}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="btn-outline p-2" title="View Document">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="btn-primary p-2" title="Update Document">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="btn-outline p-2 text-success-600 hover:bg-success-50" 
                        title="Mark as Reviewed"
                        onClick={() => markAsReviewed(doc.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">All Documents Up to Date!</h3>
                  <p className="text-secondary-600">No stale documents found. Your documentation is healthy and current.</p>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-secondary-900">
                  Notifications ({(notifications.length > 0 ? notifications : mockNotifications).length})
                </h3>
                <div className="flex space-x-3">
                  <button className="btn-outline flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Notification Settings</span>
                  </button>
                  <button className="btn-outline flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark All Read</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {(notifications.length > 0 ? notifications : mockNotifications).map((notification) => (
                  <div key={notification.id} className="card hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'warning' ? 'bg-warning-100' :
                        notification.type === 'info' ? 'bg-primary-100' :
                        'bg-success-100'
                      }`}>
                        {notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-warning-600" /> :
                         notification.type === 'info' ? <FileText className="w-5 h-5 text-primary-600" /> :
                         <CheckCircle className="w-5 h-5 text-success-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-secondary-900">{notification.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-secondary-500">{notification.time}</span>
                        </div>
                                                 <p className="text-secondary-600 mb-3">{notification.message}</p>
                         
                         {notification.affectedComponents && (
                           <div className="mb-3">
                             <p className="text-sm font-medium text-secondary-700 mb-2">Affected Components:</p>
                             <div className="flex flex-wrap gap-2">
                               {notification.affectedComponents.map((component, index) => (
                                 <span 
                                   key={index}
                                   className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                                 >
                                   {component}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         <div className="flex space-x-3">
                          {notification.action === 'review' && (
                            <button className="btn-primary text-sm px-3 py-1">Review Document</button>
                          )}
                          {notification.action === 'update' && (
                            <button className="btn-primary text-sm px-3 py-1">Update Now</button>
                          )}
                          {notification.action === 'view' && (
                            <button className="btn-outline text-sm px-3 py-1">View Changes</button>
                          )}
                          <button className="btn-outline text-sm px-3 py-1">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                     )}

           {/* Dependencies */}
           {activeTab === 'dependencies' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-semibold text-secondary-900">
                   Component Dependencies
                 </h3>
                 <div className="flex space-x-3">
                   <button 
                     onClick={simulateDependencyChanges}
                     className="btn-warning flex items-center space-x-2"
                   >
                     <AlertTriangle className="w-4 h-4" />
                     <span>Test Dependencies</span>
                   </button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="card">
                   <h4 className="text-lg font-semibold text-secondary-900 mb-4">Database Schema</h4>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                       <div>
                         <p className="font-medium text-secondary-900">User Table</p>
                         <p className="text-sm text-secondary-600">Modified 2 hours ago</p>
                       </div>
                       <span className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded-full">Changed</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                       <div>
                         <p className="font-medium text-secondary-900">Payment Table</p>
                         <p className="text-sm text-secondary-600">Modified 1 day ago</p>
                       </div>
                       <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">Stable</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="card">
                   <h4 className="text-lg font-semibold text-secondary-900 mb-4">API Services</h4>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                       <div>
                         <p className="font-medium text-secondary-900">Auth API</p>
                         <p className="text-sm text-secondary-600">Depends on User Table</p>
                       </div>
                       <span className="px-2 py-1 bg-error-100 text-error-700 text-xs rounded-full">Affected</span>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                       <div>
                         <p className="font-medium text-secondary-900">Payment API</p>
                         <p className="text-sm text-secondary-600">Depends on Payment Table</p>
                       </div>
                       <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">Stable</span>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="card">
                 <h4 className="text-lg font-semibold text-secondary-900 mb-4">Dependency Graph</h4>
                 <div className="bg-secondary-50 p-6 rounded-lg">
                   <div className="text-center text-secondary-600">
                     <RefreshCw className="w-12 h-12 mx-auto mb-4 text-secondary-400" />
                     <p className="text-lg font-medium mb-2">Real-time Dependency Tracking</p>
                     <p className="text-sm">IFastDocs monitors component relationships and automatically notifies when changes affect documentation</p>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Auto Updates */}
          {activeTab === 'auto-updates' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Automatic Update Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-secondary-900">Auto-sync from Source Code</h4>
                      <p className="text-sm text-secondary-600">Automatically update documentation when source code changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-secondary-900">Smart Update Suggestions</h4>
                      <p className="text-sm text-secondary-600">AI-powered suggestions for document updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-secondary-900">Change Notifications</h4>
                      <p className="text-sm text-secondary-600">Get notified when dependent components change</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Health */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Overall Health Score: 98%</h3>
                <div className="w-full bg-secondary-200 rounded-full h-3 mb-4">
                  <div className="bg-success-600 h-3 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-success-600">1,224</p>
                    <p className="text-sm text-secondary-600">Up to Date</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-warning-600">23</p>
                    <p className="text-sm text-secondary-600">Needs Review</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-8 h-8 text-error-600" />
                    </div>
                    <p className="text-2xl font-bold text-error-600">0</p>
                    <p className="text-sm text-secondary-600">Outdated</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

             {/* Toast Notification */}
       {toast && (
         <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 border-l-4 transform transition-all duration-500 ease-in-out scale-100 ${
           toast.type === 'success' 
             ? 'bg-green-50 text-green-800 border-green-500' 
             : 'bg-red-50 text-red-800 border-red-500'
         }`}>
           <div className="flex items-center space-x-3">
             {toast.type === 'success' ? (
               <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                 <CheckCircle className="w-4 h-4 text-green-600" />
               </div>
             ) : (
               <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                 <AlertTriangle className="w-4 h-4 text-red-600" />
               </div>
             )}
             <span className="font-medium">{toast.message}</span>
             <button 
               onClick={dismissToast} 
               className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
             >
               <X className="h-4 w-4" />
             </button>
           </div>
         </div>
       )}
    </div>
  );
};

export default Maintenance; 