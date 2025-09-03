import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  User, 
  Settings,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { useTutorial } from '../contexts/TutorialContext';

const Header = ({ onSearch, currentLanguage, onLanguageChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { startTutorial } = useTutorial();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  ];

  const notifications = [
    { id: 1, message: 'Document "API Guide" needs review', time: '2 min ago', type: 'warning' },
    { id: 2, message: 'New team member joined', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'Documentation sync completed', time: '3 hours ago', type: 'success' },
  ];

  return (
    <header className="bg-white border-b border-secondary-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search documentation, APIs, or ask a question..."
              className="input-field pl-10 pr-4 w-full bg-secondary-50 border-secondary-200 focus:bg-white"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6">
          {/* Tutorial Button */}
          <button
            onClick={startTutorial}
            className="p-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
            title="Start Tutorial"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-secondary-600" />
            ) : (
              <Moon className="w-5 h-5 text-secondary-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200 relative">
              <Bell className="w-5 h-5 text-secondary-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              <Globe className="w-4 h-4 text-secondary-600" />
              <span className="text-lg">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
              <ChevronDown className="w-4 h-4 text-secondary-400" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language.code);
                      setShowLanguageDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-3 transition-colors duration-150"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm text-secondary-700">{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-secondary-900">John Doe</p>
                <p className="text-xs text-secondary-500">Senior Developer</p>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-secondary-200">
                  <p className="text-sm font-medium text-secondary-900">John Doe</p>
                  <p className="text-xs text-secondary-500">Senior Developer</p>
                </div>
                <button className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-3 transition-colors duration-150">
                  <User className="w-4 h-4 text-secondary-600" />
                  <span className="text-sm text-secondary-700">Profile</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-secondary-50 flex items-center space-x-3 transition-colors duration-150">
                  <Settings className="w-4 h-4 text-secondary-600" />
                  <span className="text-sm text-secondary-700">Settings</span>
                </button>
                <div className="border-t border-secondary-200 mt-2 pt-2">
                  <button className="w-full px-4 py-2 text-left hover:bg-secondary-50 text-sm text-error-600 transition-colors duration-150">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 