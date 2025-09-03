import { useState } from 'react';
import { HelpCircle, X, BookOpen, MessageCircle, Video, FileText } from 'lucide-react';
import { useTutorial } from '../contexts/TutorialContext';

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { startTutorial } = useTutorial();

  const helpOptions = [
    {
      icon: BookOpen,
      title: 'Start Tutorial',
      description: 'Take a guided tour of the platform',
      action: () => {
        startTutorial();
        setIsOpen(false);
      },
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get help from our support team',
      action: () => {
        // Implement live chat
        console.log('Opening live chat...');
        setIsOpen(false);
      },
      color: 'bg-success-100 text-success-600'
    },
    {
      icon: Video,
      title: 'Video Guides',
      description: 'Watch tutorial videos',
      action: () => {
        // Implement video guides
        console.log('Opening video guides...');
        setIsOpen(false);
      },
      color: 'bg-warning-100 text-warning-600'
    },
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse help articles',
      action: () => {
        // Implement help center
        console.log('Opening help center...');
        setIsOpen(false);
      },
      color: 'bg-secondary-100 text-secondary-600'
    }
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 z-40 flex items-center justify-center hover:scale-110"
        title="Get Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Help Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">How can we help?</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Help Options */}
            <div className="space-y-3">
              {helpOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={index}
                    onClick={option.action}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{option.title}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Need more help? Contact us at support@ifastdocs.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingHelpButton; 