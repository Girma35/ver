import { useState, useEffect, useRef } from 'react';
import { PageType, Language, VerificationState, UserWallet } from './types';
import { Navbar } from './components/Navbar';
import { VerificationPage } from './components/VerificationPage';
import { EarnMoneyPage } from './components/EarnMoneyPage';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import {
  clearVerificationDatabase,
  getVerificationFile,
  saveVerificationSubmission,
} from './lib/verificationDb';
import { isSupabaseConfigured } from './lib/supabase';
import { createKycSignedUrl, uploadKycFile } from './lib/documentStorage';
import {
  loadCloudState,
  resetCloudState,
  savePreferencesToCloud,
  saveVerificationToCloud,
  saveWalletToCloud,
  type CloudSyncStatus,
} from './lib/cloudStore';

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
  idFileId: null,
  idPreviewUrl: null,
  idFilePath: null,
  selfieFileName: null,
  selfieFileId: null,
  selfiePreviewUrl: null,
  selfieFilePath: null,
  consentGiven: true,
  submissionId: null,
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

  // Verification State (file previews are hydrated from IndexedDB, not sessionStorage)
  const [verificationState, setVerificationState] = useState<VerificationState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_VERIFICATION);
      if (saved) {
        const parsed = JSON.parse(saved) as VerificationState;
        return {
          ...INITIAL_VERIFICATION_STATE,
          ...parsed,
          idPreviewUrl: null,
          selfiePreviewUrl: null,
        };
      }
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

  // Cloud (Supabase) sync status for the single demo user
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>(
    isSupabaseConfigured ? 'connecting' : 'local'
  );
  // Keeps the save effects from writing defaults over stored cloud data before the first read.
  const cloudReadyRef = useRef<boolean>(!isSupabaseConfigured);
  // Last cloud failure, surfaced in the footer tooltip so setup issues are diagnosable.
  const [cloudError, setCloudError] = useState<string | null>(null);

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
      const { idPreviewUrl: _idPreview, selfiePreviewUrl: _selfiePreview, ...persistable } =
        verificationState;
      sessionStorage.setItem(STORAGE_KEY_VERIFICATION, JSON.stringify(persistable));
    } catch (e) {
      // Ignore
    }
  }, [verificationState]);

  useEffect(() => {
    let cancelled = false;
    const { idFileId, selfieFileId, idFilePath, selfieFilePath } = verificationState;

    if (!idFileId && !selfieFileId && !idFilePath && !selfieFilePath) return;

    const hydrateFiles = async () => {
      const updates: Partial<VerificationState> = {};

      const localId = idFileId ? await getVerificationFile(idFileId) : null;
      const localSelfie = selfieFileId ? await getVerificationFile(selfieFileId) : null;

      if (localId) {
        updates.idPreviewUrl = URL.createObjectURL(localId.blob);
        updates.idFileName = localId.name;
      }
      if (localSelfie) {
        updates.selfiePreviewUrl = URL.createObjectURL(localSelfie.blob);
        updates.selfieFileName = localSelfie.name;
      }

      // No local copy (e.g. another device): fall back to the stored object.
      if (!localId && idFilePath) {
        const signedUrl = await createKycSignedUrl(idFilePath);
        if (signedUrl) updates.idPreviewUrl = signedUrl;
      }
      if (!localSelfie && selfieFilePath) {
        const signedUrl = await createKycSignedUrl(selfieFilePath);
        if (signedUrl) updates.selfiePreviewUrl = signedUrl;
      }

      // A file saved before Storage was configured gets uploaded now.
      if (localId && !idFilePath) {
        const path = await uploadKycFile(localId.blob, 'id', localId.name).catch(() => null);
        if (path) updates.idFilePath = path;
      }
      if (localSelfie && !selfieFilePath) {
        const path = await uploadKycFile(localSelfie.blob, 'selfie', localSelfie.name).catch(
          () => null
        );
        if (path) updates.selfieFilePath = path;
      }

      if (!cancelled && Object.keys(updates).length > 0) {
        setVerificationState((prev) => ({ ...prev, ...updates }));
      }
    };

    void hydrateFiles();

    return () => {
      cancelled = true;
    };
    // Re-hydrate when the stored file ids or cloud paths change (session cache or cloud load).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    verificationState.idFileId,
    verificationState.selfieFileId,
    verificationState.idFilePath,
    verificationState.selfieFilePath,
  ]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify(walletState));
    } catch (e) {
      // Ignore
    }
  }, [walletState]);

  // Read the single-user cloud state once on mount (Supabase rows, when configured)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    const loadFromCloud = async () => {
      try {
        const cloud = await loadCloudState();
        if (cancelled) return;

        if (cloud?.wallet) setWalletState(cloud.wallet);
        if (cloud?.verification) {
          setVerificationState((prev) => ({
            ...prev,
            ...cloud.verification,
            idPreviewUrl: prev.idPreviewUrl,
            selfiePreviewUrl: prev.selfiePreviewUrl,
          }));
        }
        if (cloud?.preferences) {
          setLanguage(cloud.preferences.language);
          setCurrentPage(cloud.preferences.currentPage);
        }

        setCloudStatus('synced');
        setCloudError(null);
        // Only after a successful read may local state be written back; otherwise a
        // failed request would overwrite the stored row with empty defaults.
        cloudReadyRef.current = true;
      } catch (error) {
        console.warn('[WorkEthio] Cloud load failed, staying local:', error);
        if (!cancelled) {
          setCloudStatus('error');
          setCloudError(error instanceof Error ? error.message : String(error));
        }
      }
    };

    void loadFromCloud();

    return () => {
      cancelled = true;
    };
  }, []);

  // Mirror each state slice back to the cloud after it settles
  useEffect(() => {
    if (!cloudReadyRef.current || !isSupabaseConfigured) return;

    const timer = setTimeout(() => {
      saveWalletToCloud(walletState)
        .then(() => {
          setCloudStatus('synced');
          setCloudError(null);
        })
        .catch((error) => {
          console.warn('[WorkEthio] Wallet sync failed:', error);
          setCloudStatus('error');
          setCloudError(error instanceof Error ? error.message : String(error));
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [walletState]);

  useEffect(() => {
    if (!cloudReadyRef.current || !isSupabaseConfigured) return;

    const timer = setTimeout(() => {
      saveVerificationToCloud(verificationState)
        .then(() => {
          setCloudStatus('synced');
          setCloudError(null);
        })
        .catch((error) => {
          console.warn('[WorkEthio] Verification sync failed:', error);
          setCloudStatus('error');
          setCloudError(error instanceof Error ? error.message : String(error));
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [verificationState]);

  useEffect(() => {
    if (!cloudReadyRef.current || !isSupabaseConfigured) return;

    const timer = setTimeout(() => {
      savePreferencesToCloud(language, currentPage)
        .then(() => {
          setCloudStatus('synced');
          setCloudError(null);
        })
        .catch((error) => {
          console.warn('[WorkEthio] Preference sync failed:', error);
          setCloudStatus('error');
          setCloudError(error instanceof Error ? error.message : String(error));
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [language, currentPage]);

  const verificationRef = useRef(verificationState);
  verificationRef.current = verificationState;

  // Handlers
  const handleUpdateVerificationState = (updates: Partial<VerificationState>) => {
    setVerificationState((prev) => ({ ...prev, ...updates }));
  };

  const handleCompleteVerification = () => {
    const current = verificationRef.current;
    const verifiedAt = new Date().toLocaleString();
    const verifiedState: VerificationState = {
      ...current,
      isVerified: true,
      verifiedAt,
    };
    setVerificationState(verifiedState);

    // Persist immediately: the debounced effect below can be lost if the page is
    // reloaded right after the user finishes verification.
    if (isSupabaseConfigured) {
      void saveVerificationToCloud(verifiedState).catch((error) => {
        console.warn('[WorkEthio] Immediate verification save failed:', error);
      });
    }

    void saveVerificationSubmission({
      applicantName: current.applicantName,
      phoneNumber: current.phoneNumber,
      city: current.city,
      documentType: current.documentType,
      idNumber: current.idNumber,
      idFileId: current.idFileId,
      selfieFileId: current.selfieFileId,
      createdAt: new Date().toISOString(),
    })
      .then((saved) => {
        setVerificationState((prev) => ({
          ...prev,
          submissionId: saved.id ?? prev.submissionId,
        }));
      })
      .catch(() => undefined);
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
    if (verificationState.idPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(verificationState.idPreviewUrl);
    }
    if (verificationState.selfiePreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(verificationState.selfiePreviewUrl);
    }
    void clearVerificationDatabase();
    void resetCloudState().catch((error) => {
      console.warn('[WorkEthio] Cloud reset failed:', error);
      setCloudStatus('error');
    });
    setVerificationState(INITIAL_VERIFICATION_STATE);
    setWalletState(INITIAL_WALLET_STATE);
    setCurrentPage('tasks');
  };

  const isAm = language === 'am';
  const isOm = language === 'om';

  const cloudStatusLabel =
    cloudStatus === 'synced'
      ? 'Cloud saved'
      : cloudStatus === 'connecting'
      ? 'Cloud: connecting'
      : cloudStatus === 'error'
      ? 'Cloud: offline'
      : 'Local only';

  const cloudStatusTitle =
    cloudStatus === 'local'
      ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to save to Supabase'
      : cloudStatus === 'error'
      ? `Supabase request failed — changes stay in this browser only${
          cloudError ? ` (${cloudError})` : ''
        }`
      : 'Wallet, verification and preferences are stored in Supabase';

  const cloudStatusDotClass =
    cloudStatus === 'synced'
      ? 'bg-emerald-500'
      : cloudStatus === 'connecting'
      ? 'bg-amber-500 animate-pulse'
      : cloudStatus === 'error'
      ? 'bg-rose-500'
      : 'bg-slate-400';

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

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NIDP Fayda Compliant</span>
            </span>

            <span className="flex items-center gap-1 text-slate-500" title={cloudStatusTitle}>
              <span className={`w-1.5 h-1.5 rounded-full ${cloudStatusDotClass}`} />
              <span>{cloudStatusLabel}</span>
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
