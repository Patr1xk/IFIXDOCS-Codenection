import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';

const TutorialOverlay = ({ isVisible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const overlayRef = useRef(null);

  const tutorialSteps = [
    {
      id: 'sidebar',
      title: 'Navigation Sidebar',
      description: 'This is your main navigation hub. Use it to switch between different sections of the platform.',
      target: '.sidebar-item',
      position: 'right',
      content: (
        <div>
          <p className="mb-3">The sidebar contains all the main sections:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>Dashboard:</strong> Overview and quick actions</li>
            <li>• <strong>Write Docs:</strong> Create and edit documentation</li>
            <li>• <strong>Read & Search:</strong> Find and browse documents</li>
            <li>• <strong>Maintenance:</strong> Keep docs up-to-date</li>
            <li>• <strong>Onboarding:</strong> Tutorials and help (you're here!)</li>
          </ul>
        </div>
      )
    },
    {
      id: 'header',
      title: 'Top Header',
      description: 'Access search, language settings, and user preferences from here.',
      target: 'header',
      position: 'bottom',
      content: (
        <div>
          <p className="mb-3">The header provides quick access to:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>Search:</strong> Find documents across the platform</li>
            <li>• <strong>Language:</strong> Switch between different languages</li>
            <li>• <strong>User Menu:</strong> Access your profile and settings</li>
            <li>• <strong>Tutorial:</strong> Start the guided tour anytime</li>
          </ul>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Your central hub for quick insights and actions.',
      target: '.dashboard-stats',
      position: 'bottom',
      content: (
        <div>
          <p className="mb-3">The dashboard shows you:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>Recent Documents:</strong> Quickly access your latest work</li>
            <li>• <strong>Quick Actions:</strong> Common tasks at your fingertips</li>
            <li>• <strong>Statistics:</strong> Overview of your documentation health</li>
          </ul>
        </div>
      )
    },
    {
      id: 'write-docs',
      title: 'Document Creation',
      description: 'Multiple ways to create documentation - from GitHub imports to manual writing.',
      target: '.write-docs-tabs',
      position: 'top',
      content: (
        <div>
          <p className="mb-3">Create documents using:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>GitHub Import:</strong> Auto-generate docs from your code</li>
            <li>• <strong>File Upload:</strong> Import existing documents</li>
            <li>• <strong>Templates:</strong> Use pre-built document structures</li>
            <li>• <strong>Manual Writing:</strong> Start from scratch with our editor</li>
          </ul>
        </div>
      )
    },
    {
      id: 'search',
      title: 'Smart Search',
      description: 'Find exactly what you need with AI-powered search and filtering.',
      target: '.search-container',
      position: 'bottom',
      content: (
        <div>
          <p className="mb-3">Search features include:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>Full-text Search:</strong> Search across all document content</li>
            <li>• <strong>AI Summarization:</strong> Get quick document summaries</li>
            <li>• <strong>Q&A Assistant:</strong> Ask questions about your docs</li>
            <li>• <strong>Advanced Filters:</strong> Narrow down results by category, date, etc.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'maintenance',
      title: 'Document Maintenance',
      description: 'Keep your documentation healthy and up-to-date automatically.',
      target: '.maintenance-tabs',
      position: 'top',
      content: (
        <div>
          <p className="mb-3">Maintenance tools help you:</p>
          <ul className="text-sm space-y-1 text-left">
            <li>• <strong>Detect Stale Docs:</strong> Find outdated information</li>
            <li>• <strong>Get Notifications:</strong> Stay informed about changes</li>
            <li>• <strong>Auto-updates:</strong> Suggest improvements automatically</li>
            <li>• <strong>Health Monitoring:</strong> Track documentation quality</li>
          </ul>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isVisible && !showWelcome) {
      highlightCurrentStep();
    }
  }, [currentStep, isVisible, showWelcome]);

  const highlightCurrentStep = () => {
    const currentStepData = tutorialSteps[currentStep];
    if (currentStepData && currentStepData.target) {
      // Remove previous highlights
      document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
      });
      
      // Add highlight to current target
      const targetSelectors = currentStepData.target.split(', ');
      let targetElement = null;
      
      for (const selector of targetSelectors) {
        targetElement = document.querySelector(selector);
        if (targetElement) break;
      }
      
      if (targetElement) {
        targetElement.classList.add('tutorial-highlight');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    onComplete();
    onClose();
  };

  const skipTutorial = () => {
    onClose();
  };

  const startTutorial = () => {
    setShowWelcome(false);
    setCurrentStep(0);
  };

  if (!isVisible) return null;

  if (showWelcome) {
    return (
      <div className="tutorial-overlay flex items-center justify-center">
        <div className="tutorial-tooltip p-8 max-w-md mx-4 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to iFAST Docs! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Would you like a step-by-step tour of the platform? This will help you get familiar with all the features and make the most of your documentation tools.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={startTutorial}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Yes, show me around!
            </button>
            <button
              onClick={skipTutorial}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="tutorial-overlay" ref={overlayRef}>
      {/* Tutorial Tooltip */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="tutorial-tooltip relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{currentStepData.title}</h3>
                <p className="text-sm text-gray-500">Step {currentStep + 1} of {tutorialSteps.length}</p>
              </div>
            </div>
            
            <div className="text-gray-700 mb-6">
              {currentStepData.content}
            </div>

            {/* Progress bar */}
            <div className="tutorial-progress mb-6">
              <div 
                className="tutorial-progress-bar"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`tutorial-step-indicator ${
                      index === currentStep ? 'active' : 'inactive'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <span>Complete</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay; 