
import React, { useState } from 'react';
import { AlertTriangle, ClipboardList, CheckCircle2, ShieldAlert } from 'lucide-react';
import { translations } from '../translations';
import { Language, AppStep } from '../types';

interface ScreeningProps {
  lang: Language;
  onComplete: () => void;
  navigateTo: (step: AppStep) => void;
}

const Screening: React.FC<ScreeningProps> = ({ lang, onComplete, navigateTo }) => {
  const t = translations[lang];
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [hasCheckedTerms, setHasCheckedTerms] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const conditions = [
    { id: 'heart', label: t.heartDisease, dangerous: true },
    { id: 'respiratory', label: t.respiratory, dangerous: true },
    { id: 'allergies', label: t.allergies, dangerous: true },
    { id: 'neuro', label: t.neurological, dangerous: true },
    { id: 'none', label: t.none, dangerous: false },
  ];

  const handleToggle = (id: string) => {
    if (id === 'none') {
      setSelectedConditions(['none']);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(c => c !== 'none');
        if (prev.includes(id)) {
          return filtered.filter(c => c !== id);
        } else {
          return [...filtered, id];
        }
      });
    }
  };

  const handleNext = () => {
    const dangerousPicked = conditions
      .filter(c => selectedConditions.includes(c.id))
      .some(c => c.dangerous);

    if (dangerousPicked) {
      setIsBlocked(true);
      setTimeout(() => {
        navigateTo(AppStep.WELCOME);
      }, 5000); // Redirect after 5 seconds to let them read the error
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {isBlocked ? (
          <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={64} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">{t.safetyErrorTitle}</h2>
            <p className="text-xl text-slate-500 leading-relaxed max-w-md mx-auto">
              {t.safetyErrorMessage}
            </p>
            <div className="pt-8">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full animate-[shrink_5s_linear_forwards]" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Redirecting to home page...</p>
            </div>
            <style>{`
              @keyframes shrink {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <ClipboardList size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t.screeningTitle}</h2>
                <p className="text-slate-500">{t.safetyAssessment}</p>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-3">
                {conditions.map(cond => (
                  <button
                    key={cond.id}
                    onClick={() => handleToggle(cond.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      selectedConditions.includes(cond.id)
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <span className={`font-bold ${selectedConditions.includes(cond.id) ? 'text-blue-700' : 'text-slate-600'}`}>
                      {cond.label}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedConditions.includes(cond.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                    }`}>
                      {selectedConditions.includes(cond.id) && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-3 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-5 h-5 rounded border-blue-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={hasCheckedTerms}
                  onChange={(e) => setHasCheckedTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-blue-900 font-medium leading-tight cursor-pointer">
                  {t.certify}
                </label>
              </div>

              <button
                onClick={handleNext}
                disabled={!hasCheckedTerms || selectedConditions.length === 0}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {t.proceed}
                <CheckCircle2 size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Screening;
