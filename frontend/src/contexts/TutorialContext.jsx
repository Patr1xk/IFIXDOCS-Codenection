import { createContext, useContext, useState, useEffect } from 'react';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('iFAST_tutorial_completed');
    if (!hasVisited) {
      setIsFirstVisit(true);
      // Show tutorial automatically after a short delay
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  const completeTutorial = () => {
    setHasCompletedTutorial(true);
    setShowTutorial(false);
    localStorage.setItem('iFAST_tutorial_completed', 'true');
  };

  const resetTutorial = () => {
    setHasCompletedTutorial(false);
    localStorage.removeItem('iFAST_tutorial_completed');
  };

  const value = {
    showTutorial,
    hasCompletedTutorial,
    isFirstVisit,
    startTutorial,
    closeTutorial,
    completeTutorial,
    resetTutorial
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}; 