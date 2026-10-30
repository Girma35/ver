import { useState, useEffect } from 'react';
import { PageType, Language, VerificationState, UserWallet } from './types';
import { Navbar } from './components/Navbar';
import { VerificationPage } from './components/VerificationPage';
import { EarnMoneyPage } from './components/EarnMoneyPage';
import { ShieldCheck, RotateCcw } from 'lucide-react';

const STORAGE_KEY_VERIFICATION = 'workethio_verification_state_v3';
const STORAGE_KEY_WALLET = 'workethio_wallet_state_v3';
const STORAGE_KEY_PAGE = 'workethio_active_page_v3';
const STORAGE_KEY_LANG = 'workethio_language_v3';

const INITIAL_VERIFICATION_STATE: VerificationState = {
  isVerified: false,
  verifiedAt: null,
  applicantName: 'Abebe Bikila',
  phoneNumber: '+251 91 123 4567',
  city: 'Addis Ababa (Bole)',
  documentType: 'fayda',
  idNumber: 'FIN-0982-1402-9912',
  idFileName: null,
  idPreviewUrl: null,
  selfieFileName: null,
  selfiePreviewUrl: null,
  consentGiven: true,
};

const INITIAL_WALLET_STATE: UserWallet = {
  balanceEtb: 0,
  completedTasks: [],
  withdrawalMethod: 'telebirr',
  phoneNumberOrAccount: '0911234567',
};

export default function App() {
  // Page State - Strictly exactly two pages: 'tasks' (Page 1) and 'verification' (Page 2)
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_PAGE);
      if (saved === 'tasks' || saved === 'verification') return saved;
    } catch (e) {
      // Ignore
    }
    return 'tasks';
  });

  // Language State: 'en' | 'am' | 'om'
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'am' || saved === 'om') return saved;
    } catch (e) {
      // Ignore
    }
    return 'om'; // Default to Afaan Oromoo as preferred by user
  });

  // Verification State
  const [verificationState, setVerificationState] = useState<VerificationState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_VERIFICATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return INITIAL_VERIFICATION_STATE;
  });

  // Wallet State
  const [walletState, setWalletState] = useState<UserWallet>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_WALLET);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return INITIAL_WALLET_STATE;
  });

  // Sync to Session Storage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_PAGE, currentPage);
    } catch (e) {
      // Ignore
    }
  }, [currentPage]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_LANG, language);
    } catch (e) {
      // Ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_VERIFICATION, JSON.stringify(verificationState));
    } catch (e) {
      // Ignore
    }
  }, [verificationState]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(walletState));
    } catch (e) {
      // Ignore
    }
  }, [walletState]);

  // Handlers
  const handleUpdateVerificationState = (updates: Partial<VerificationState>) => {
    setVerificationState((prev) => ({ ...prev, ...updates }));
  };

  const handleCompleteVerification = () => {
    setVerificationState((prev) => ({
      ...prev,
      isVerified: true,
      verifiedAt: new Date().toLocaleString(),
    }));
  };

  const handleUpdateWallet = (updates: Partial<UserWallet>) => {
    setWalletState((prev) => ({ ...prev, ...updates }));
  };

  const handleResetSystem = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY_VERIFICATION);
      sessionStorage.removeItem(STORAGE_KEY_WALLET);
      sessionStorage.removeItem(STORAGE_KEY_PAGE);
    } catch (e) {
      // Ignore
    }
    setVerificationState(INITIAL_VERIFICATION_STATE);
    setWalletState(INITIAL_WALLET_STATE);
    setCurrentPage('tasks');
  };

  const isAm = language === 'am';
  const isOm = language === 'om';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-200">
      {/* Main Top Navigation (Strictly 2 Pages) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isVerified={verificationState.isVerified}
        language={language}
        onChangeLanguage={setLanguage}
        onResetDemo={handleResetSystem}
      />

      {/* Main Application Body - Exactly Two Pages */}
      <main className="flex-1">
        {currentPage === 'tasks' && (
          <EarnMoneyPage
            state={verificationState}
            wallet={walletState}
            onUpdateWallet={handleUpdateWallet}
            onNavigateToVerification={() => setCurrentPage('verification')}
            language={language}
          />
        )}

        {currentPage === 'verification' && (
          <VerificationPage
            state={verificationState}
            onUpdateState={handleUpdateVerificationState}
            onCompleteVerification={handleCompleteVerification}
            onNavigateToEarn={() => setCurrentPage('tasks')}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 mt-16 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">WorkEthio</span>
            <span>·</span>
            <span>
              {isOm
                ? 'Pilaatfoormii Hojii Dijitaalaa Itoophiyaa'
                : isAm
                ? 'የኢትዮጵያ ዲጂታል ስራ መድረክ'
                : 'Ethiopia Digital Labor Platform'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIDP Fayda Compliant</span>
            </span>

            <button
              onClick={handleResetSystem}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isOm ? 'Haaromsi' : isAm ? 'እንደገና ጀምር' : 'Reset System'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
