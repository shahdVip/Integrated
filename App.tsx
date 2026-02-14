import React, { useState } from 'react';
import Welcome from './views/Welcome';
import Login from './views/Login';
import Screening from './views/Screening';
import Dashboard from './views/Dashboard';
import { AppStep, Language } from './types';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.WELCOME);
  const [lang, setLang] = useState<Language>(Language.EN);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const navigateTo = (step: AppStep) => {
    setCurrentStep(step);
  };

  const handleLogin = (username: string) => {
    setUser({ username });
    navigateTo(AppStep.SCREENING);
  };

  const toggleLang = () => {
    setLang(prev => prev === Language.EN ? Language.AR : Language.EN);
  };

  const renderStep = () => {
    const props = { lang, navigateTo, toggleLang };
    
    switch (currentStep) {
      case AppStep.WELCOME:
        return (
          <Welcome 
            {...props} 
            onStart={() => {
              setUser({ username: lang === Language.EN ? 'Guest' : 'ضيف' });
              navigateTo(AppStep.SCREENING);
            }} 
            onLogin={() => navigateTo(AppStep.LOGIN)} 
          />
        );
      case AppStep.LOGIN:
        return <Login {...props} onLogin={handleLogin} onBack={() => navigateTo(AppStep.WELCOME)} />;
      case AppStep.SCREENING:
        return <Screening {...props} onComplete={() => navigateTo(AppStep.DASHBOARD)} />;
      case AppStep.DASHBOARD:
        return <Dashboard {...props} user={user} onLogout={() => navigateTo(AppStep.WELCOME)} />;
      default:
        return (
          <Welcome 
            {...props} 
            onStart={() => navigateTo(AppStep.SCREENING)} 
            onLogin={() => navigateTo(AppStep.LOGIN)} 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${lang === Language.AR ? 'font-arabic' : ''}`} dir={lang === Language.AR ? 'rtl' : 'ltr'}>
      <main className="flex-grow">
        {renderStep()}
      </main>
      <footer className="py-4 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
        &copy; 2025 {lang === Language.AR ? 'الحاسة المدمجة المفقودة - أنظمة استشعار طبية' : 'The Integrated Missing Sense - Medical Grade Sensor Systems'}
      </footer>
    </div>
  );
};

export default App;