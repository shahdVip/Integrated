import React, { useState } from 'react';
import { ArrowLeft, User, Lock, ChevronRight, Info, X } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface LoginProps {
  lang: Language;
  onLogin: (username: string) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ lang, onLogin, onBack }) => {
  const t = translations[lang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  const toggleRecovery = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsRecoveryOpen(!isRecoveryOpen);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative">
      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft size={18} className={`${lang === Language.AR ? 'rotate-180' : ''} group-hover:-translate-x-1 transition-transform`} />
          <span>{t.backToWelcome}</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="p-8 text-center bg-white">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{t.patientLogin}</h2>
            <p className="text-slate-500 mt-2">{t.portalAccess}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 mx-1">{t.username}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${lang === Language.EN ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center pointer-events-none text-slate-400`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.enterID}
                  className={`w-full ${lang === Language.EN ? 'pl-11 pr-4' : 'pr-11 pl-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 mx-1">{t.password}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${lang === Language.EN ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center pointer-events-none text-slate-400`}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${lang === Language.EN ? 'pl-11 pr-4' : 'pr-11 pl-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              {t.signIn}
              <ChevronRight size={18} className={lang === Language.AR ? 'rotate-180' : ''} />
            </button>

            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={toggleRecovery}
                className="text-sm text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                {t.forgotCredentials}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          {t.securityNote}
        </p>
      </div>

      {/* Credentials Recovery Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={toggleRecovery}
          />
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl relative z-110 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Info size={30} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{t.recoveryTitle}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {t.recoveryMessage}
              </p>
              <button
                onClick={toggleRecovery}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <X size={18} />
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;