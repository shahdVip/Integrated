import React from 'react';
import { Activity, UserCircle, Globe, BrainCircuit, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

interface WelcomeProps {
  lang: Language;
  toggleLang: () => void;
  onStart: () => void;
  onLogin: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ lang, toggleLang, onStart, onLogin }) => {
  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden bg-white">
      {/* Top Navbar with Centered Logo - Improved spacing to prevent interference */}
      <nav className="w-full pt-12 pb-6 px-10 flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200 hover:scale-110 transition-transform duration-300">
            <BrainCircuit size={40} />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight text-center max-w-[200px] leading-tight opacity-80">{t.title}</span>
        </div>
        
        {/* Language Toggle - Absolute to stay out of the way */}
        <button 
          onClick={toggleLang}
          className={`absolute top-10 ${lang === Language.EN ? 'right-10' : 'left-10'} flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-100 bg-white shadow-sm hover:bg-slate-50 transition-all text-slate-700 font-bold z-50`}
        >
          <Globe size={18} />
          {lang === Language.EN ? 'العربية' : 'English'}
        </button>
      </nav>

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 z-10 text-center flex flex-col items-center max-w-4xl mt-8">
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter">
              {lang === Language.EN ? (
                <>The Integrated <br /><span className="text-blue-600">Missing Sense</span></>
              ) : (
                <><span className="text-blue-600">الحاسة المدمجة</span> <br />المفقودة</>
              )}
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              {t.subtitle}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <button
              onClick={onStart}
              className="px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1.5 transition-all active:scale-95"
            >
              {t.getStarted}
            </button>
            <button
              onClick={onLogin}
              className="px-12 py-6 bg-white text-slate-800 border-2 border-slate-200 rounded-3xl font-black text-2xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
            >
              <UserCircle size={28} />
              {t.memberLogin}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-12 pt-16 border-t border-slate-100">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Activity size={28} />
              </div>
              <div className="text-start">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">{t.systemStatus}</p>
                <p className="text-base font-black text-slate-800">{t.readyForUse}</p>
              </div>
            </div>
            
            <div className="h-12 w-px bg-slate-100 hidden sm:block"></div>

            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck size={28} />
              </div>
              <div className="text-start">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">Security</p>
                <p className="text-base font-black text-slate-800">{t.patientSecure}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;