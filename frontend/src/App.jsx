import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import WriteDocs from "./components/WriteDocs";
import ReadSearch from "./components/ReadSearch";
import Maintenance from "./components/Maintenance";
import Team from "./components/Team";
import Analytics from "./components/Analytics";
import AIFeatures from "./components/AIFeatures";
import CodeParsing from "./components/CodeParsing";
import Multilingual from "./components/Multilingual";
import Documentation from "./components/Documentation";
import Visualizations from "./components/Visualizations";
import Landing from "./pages/Landing";
import TutorialOverlay from "./components/TutorialOverlay";
import FloatingHelpButton from "./components/FloatingHelpButton";
import { TutorialProvider, useTutorial } from "./contexts/TutorialContext";

// Separate component for the app content to use the tutorial context
const AppContent = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { showTutorial, closeTutorial, completeTutorial, startTutorial, hasCompletedTutorial, resetTutorial } = useTutorial();
  const location = useLocation();

  // Auto-start tutorial when coming from landing page
  useEffect(() => {
    const fromLanding = sessionStorage.getItem('fromLanding');
    if (fromLanding === 'true' && !hasCompletedTutorial) {
      // Clear the flag
      sessionStorage.removeItem('fromLanding');
      // Start tutorial after a short delay to let the page load
      setTimeout(() => {
        startTutorial();
      }, 800);
    }
  }, [startTutorial, hasCompletedTutorial]);

  const handleSearch = (query) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    // Implement language change functionality
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'write':
        return <WriteDocs />;
      case 'read':
        return <ReadSearch />;
      case 'maintain':
        return <Maintenance />;
      case 'ai-features':
        return <AIFeatures />;
      case 'code-parsing':
        return <CodeParsing />;
      case 'multilingual':
        return <Multilingual />;
      case 'documentation':
        return <Documentation />;
      case 'visualizations':
        return <Visualizations />;
      case 'onboarding':
        return (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Welcome to SmartDocs! 🎉</h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-8">
              Let's get you started with a quick tour of the platform and show you how to make the most of our documentation tools.
            </p>
            {sessionStorage.getItem('fromLanding') === 'true' && !hasCompletedTutorial && (
              <div className="max-w-2xl mx-auto mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Tutorial starting automatically in a moment...</span>
                </div>
              </div>
            )}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2">Quick Start Guide</h3>
                <p className="text-primary-700 text-sm">Learn the basics of creating, searching, and maintaining documentation</p>
              </div>
              <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                <h3 className="font-semibold text-success-900 mb-2">Interactive Tutorial</h3>
                <p className="text-success-700 text-sm">Step-by-step walkthrough of key features</p>
                <button
                  onClick={startTutorial}
                  className="mt-3 bg-success-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-success-700 transition-colors"
                >
                  Start Tutorial
                </button>
              </div>
              <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                <h3 className="font-semibold text-warning-900 mb-2">Best Practices</h3>
                <p className="text-warning-700 text-sm">Tips and tricks for effective documentation</p>
              </div>
              
              {hasCompletedTutorial && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-semibold text-blue-900 mb-2">Tutorial Completed! ✅</h3>
                  <p className="text-blue-700 text-sm mb-3">You've completed the platform tour. Need a refresher?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={startTutorial}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Replay Tutorial
                    </button>
                    <button
                      onClick={resetTutorial}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Reset Progress
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'team':
        return <Team />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return (
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Settings</h1>
            <p className="text-lg text-secondary-600">Coming soon - Configure your workspace preferences</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          onSearch={handleSearch}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        <main className="flex-1 overflow-y-auto bg-secondary-50">
          {renderContent()}
        </main>
      </div>
      
      {/* Tutorial Overlay */}
      <TutorialOverlay
        isVisible={showTutorial}
        onClose={closeTutorial}
        onComplete={completeTutorial}
      />

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default function App() {
  return (
    <TutorialProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppContent />} />
        </Routes>
      </Router>
    </TutorialProvider>
  );
}
