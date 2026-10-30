import React from 'react';
import { PageType, Language } from '../types';
import { ShieldCheck, ShieldAlert, RotateCcw, Briefcase } from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isVerified: boolean;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isVerified,
  language,
  onChangeLanguage,
  onResetDemo,
}) => {
  const isAm = language === 'am';
  const isOm = language === 'om';

  // Navigation labels - Strictly exactly the 2 required application pages
  const navTasksLabel = isOm
    ? '1. Hojiiwwan (Tasks)'
    : isAm
    ? '1. የስራ እድሎች (Tasks)'
    : '1. Earning Tasks';

  const navVerificationLabel = isOm
    ? '2. Mirkaneessa Eenyummaa (KYC)'
    : isAm
    ? '2. የማንነት ማረጋገጫ (KYC)'
    : '2. Identity Verification (KYC)';

  const brandSubtitle = isOm
    ? 'Hojii Dijitaalaa Itoophiyaa'
    : isAm
    ? 'የኢትዮጵያ ዲጂታል ስራ መድረክ'
    : 'Ethiopia Digital Labor Platform';

  const verifiedLabel = isOm
    ? 'Mirkanaa\'e'
    : isAm
    ? 'ተረጋግጧል'
    : 'KYC Verified';

  const unverifiedLabel = isOm
    ? 'Mirkaneessi Barbaachisa'
    : isAm
    ? 'ማረጋገጫ ያስፈልጋል'
    : 'KYC Required';

  const resetLabel = isOm
    ? 'Haaromsi'
    : isAm
    ? 'እንደገና ጀምር'
    : 'Reset';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Wordmark & Ethiopia Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm relative overflow-hidden group-hover:bg-slate-800 transition-colors">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              {/* Subtle Ethiopian flag stripe along bottom */}
              <div className="absolute bottom-0 inset-x-0 h-1 flex">
                <div className="flex-1 bg-emerald-500"></div>
                <div className="flex-1 bg-amber-400"></div>
                <div className="flex-1 bg-red-500"></div>
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                WorkEthio
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                {brandSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Strictly EXACTLY TWO Main Pages */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => onNavigate('tasks')}
            className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer ${
              currentPage === 'tasks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {navTasksLabel}
          </button>

          <button
            onClick={() => onNavigate('verification')}
            className={`px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'verification'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{navVerificationLabel}</span>
            {!isVerified && (
              <span className="w-2 h-2 rounded-full bg-amber-500" title="Verification required" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-600 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
            {isVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{verifiedLabel}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-700 font-medium">{unverifiedLabel}</span>
              </>
            )}
          </div>

          {/* Tri-Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onChangeLanguage('am')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'am'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማርኛ
            </button>
            <button
              onClick={() => onChangeLanguage('om')}
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                language === 'om'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Afaan Oromoo
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={onResetDemo}
            title={resetLabel}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{resetLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
