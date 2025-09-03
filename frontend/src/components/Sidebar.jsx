import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Settings, 
  Users, 
  Globe, 
  Home,
  BookOpen,
  AlertTriangle,
  BarChart3,
  HelpCircle,
  Brain,
  Code,
  Languages
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-primary-600' },
    { id: 'write', label: 'Write Docs', icon: FileText, color: 'text-success-600' },
    { id: 'read', label: 'Read & Search', icon: Search, color: 'text-secondary-600' },
    { id: 'ai-features', label: 'AI Features', icon: Brain, color: 'text-blue-600' },
    { id: 'code-parsing', label: 'Code Parsing', icon: Code, color: 'text-purple-600' },
    { id: 'maintain', label: 'Maintenance', icon: AlertTriangle, color: 'text-warning-600' },
    { id: 'multilingual', label: 'Multilingual', icon: Languages, color: 'text-indigo-600' },
    { id: 'documentation', label: 'Documentation', icon: FileText, color: 'text-gray-600' },
    { id: 'visualizations', label: 'Visualizations', icon: BarChart3, color: 'text-yellow-600' },
    { id: 'onboarding', label: 'Onboarding', icon: HelpCircle, color: 'text-primary-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-secondary-600' },
    { id: 'team', label: 'Team', icon: Users, color: 'text-success-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-secondary-600' },
  ];

  return (
    <div className={`bg-white border-r border-secondary-200 h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-secondary-900">SmartDocs</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <div className={`w-4 h-4 border-l-2 border-b-2 border-secondary-400 transform transition-transform ${
              isCollapsed ? 'rotate-45' : '-rotate-45'
            }`} />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`sidebar-item mb-1 ${
                activeSection === item.id ? 'active' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${item.color} mr-3`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar; 