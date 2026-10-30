import React, { useState, useRef, useEffect } from 'react';
import {
  VerificationState,
  Language,
  DocumentType,
} from '../types';
import {
  DOCUMENT_TYPES,
  SAMPLE_ID_IMAGE,
  SAMPLE_SELFIE_IMAGE,
} from '../constants';
import {
  UploadCloud,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  MapPin,
  Phone,
  Lock,
} from 'lucide-react';

interface VerificationPageProps {
  state: VerificationState;
  onUpdateState: (updates: Partial<VerificationState>) => void;
  onCompleteVerification: () => void;
  onNavigateToEarn: () => void;
  language: Language;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  state,
  onUpdateState,
  onCompleteVerification,
  onNavigateToEarn,
  language,
}) => {
  const isAm = language === 'am';
  const isOm = language === 'om';

  // Applicant info state
  const [applicantName, setApplicantName] = useState(state.applicantName || 'Abebe Bikila');
  const [phoneNumber, setPhoneNumber] = useState(state.phoneNumber || '+251 91 123 4567');
  const [city, setCity] = useState(state.city || 'Addis Ababa (Bole)');
  const [idNumber, setIdNumber] = useState(state.idNumber || 'FIN-0982-1402-9912');

  // Form state
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>(state.documentType || 'fayda');
  const [consent, setConsent] = useState<boolean>(state.consentGiven || true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Simulation loading state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // File input refs
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const verificationSteps = [
    {
      titleEn: 'Document encrypted & received',
      titleAm: 'የመታወቂያ ሰነድ በደህንነት ተቀብሏል',
      titleOm: 'Waraqaan eenyummaa eegumsaan qaqqabeera',
      descEn: 'Document authenticity & national format validated against Fayda registry specification.',
      descAm: 'የሰነድ ቅርጽ እና ማህተም በብሔራዊ የፋይዳ መስፈርት መሰረት ተረጋግጧል።',
      descOm: 'Ulaagaan waraqichaa galmee Faydaa biyyoolessaa wajjin qoratameera.',
    },
    {
      titleEn: 'Biometric selfie received',
      titleAm: 'የፊት ገጽታ ፎቶ ተቀብሏል',
      titleOm: 'Suuraan fuulaa (selfie) qaqqabeera',
      descEn: 'Liveness validation and portrait alignment verified.',
      descAm: 'የፊት ገጽታ ግልጽነት እና የፎቶ ጥራት ተመርምሯል።',
      descOm: 'Qulqullinni suuraa fi ifoominni fuulaa mirkanaa\'eera.',
    },
    {
      titleEn: 'Automated compliance & OCR audit',
      titleAm: 'የሰነድ ጽሑፍና መረጃ በራስ-ሰር ተነቧል',
      titleOm: 'Dubbisa barreeffamaa (OCR) fi seera qabeessummaa',
      descEn: 'Extracting FIN number, full legal name, and issuing authority.',
      descAm: 'የመታወቂያ ቁጥር፣ ስም እና የሚመለከተው አካል መረጃ ተመዝግቧል።',
      descOm: 'Lakkoofsi FIN, maqaa guutuu fi abbaan taayitaa galmaa\'aniiru.',
    },
    {
      titleEn: 'Verified & recorded into database',
      titleAm: 'ተረጋግጦ ወደ መረጃ ቋቱ ገብቷል',
      titleOm: 'Mirkanaa\'ee gara kuusaa ragaatti galeera',
      descEn: 'Applicant registered into live submissions repository with verified KYC badge.',
      descAm: 'አመልካቹ በማረጋገጫ የመረጃ ቋት ውስጥ ሙሉ በሙሉ ተመዝግቧል።',
      descOm: 'Iyyataan gara galmee ragaa biyyoolessaatti milkaa\'inaan darbeera.',
    },
  ];

  // Handle ID document file upload
  const handleIdFileUpload = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setValidationError(
        isOm
          ? 'Moo ee suuraa sirrii (JPG, JPEG ykn PNG) filadhaa.'
          : isAm
          ? 'እባክዎ ትክክለኛ የፎቶ ፋይል (JPG, JPEG ወይም PNG) ይምረጡ።'
          : 'Please select a valid image file (JPG, JPEG, or PNG).'
      );
      return;
    }

    setValidationError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdateState({
        idFileName: file.name,
        idPreviewUrl: e.target?.result as string,
        documentType: selectedDocType,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Selfie file upload
  const handleSelfieFileUpload = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setValidationError(
        isOm
          ? 'Moo ee suuraa sirrii (JPG, JPEG ykn PNG) filadhaa.'
          : isAm
          ? 'እባክዎ ትክክለኛ የፎቶ ፋይል (JPG, JPEG ወይም PNG) ይምረጡ።'
          : 'Please select a valid image file (JPG, JPEG, or PNG).'
      );
      return;
    }

    setValidationError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdateState({
        selfieFileName: file.name,
        selfiePreviewUrl: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Pre-load sample Ethiopian ID
  const handleUseSampleId = () => {
    setValidationError(null);
    onUpdateState({
      idFileName: 'ethiopian_fayda_national_id_sample.jpg',
      idPreviewUrl: SAMPLE_ID_IMAGE,
      documentType: 'fayda',
      applicantName: applicantName || 'Abebe Bikila',
      idNumber: idNumber || 'FIN-0982-1402-9912',
    });
    setSelectedDocType('fayda');
  };

  // Pre-load sample Selfie
  const handleUseSampleSelfie = () => {
    setValidationError(null);
    onUpdateState({
      selfieFileName: 'ethiopian_freelancer_selfie_sample.jpg',
      selfiePreviewUrl: SAMPLE_SELFIE_IMAGE,
    });
  };

  // Remove ID
  const handleRemoveId = () => {
    onUpdateState({
      idFileName: null,
      idPreviewUrl: null,
    });
    if (idInputRef.current) idInputRef.current.value = '';
  };

  // Remove Selfie
  const handleRemoveSelfie = () => {
    onUpdateState({
      selfieFileName: null,
      selfiePreviewUrl: null,
    });
    if (selfieInputRef.current) selfieInputRef.current.value = '';
  };

  // Submit verification form
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!applicantName.trim()) {
      setValidationError(isOm ? 'Maqaa guutuu galchaa' : isAm ? 'እባክዎ ሙሉ ስምዎን ያስገቡ' : 'Please enter full name');
      return;
    }

    if (!state.idPreviewUrl) {
      setValidationError(
        isOm
          ? 'Waraqaa eenyummaa olfe\'aa ykn fakkeenya Faydaa filadhaa'
          : isAm
          ? 'እባክዎ የመታወቂያ ሰነድዎን ፎቶ ያስገቡ ወይም ናሙናውን ይጠቀሙ'
          : 'Please upload an ID document or select the sample ID.'
      );
      return;
    }

    if (!state.selfiePreviewUrl) {
      setValidationError(
        isOm
          ? 'Suuraa fuulaa (selfie) olfe\'aa ykn fakkeenya filadhaa'
          : isAm
          ? 'እባክዎ የራስዎን ፎቶ (Selfie) ያስገቡ ወይም ናሙናውን ይጠቀሙ'
          : 'Please upload a selfie photo or select the sample selfie.'
      );
      return;
    }

    onUpdateState({
      consentGiven: true,
      documentType: selectedDocType,
      applicantName,
      phoneNumber,
      city,
      idNumber,
    });

    // Start verification pipeline
    setIsSimulating(true);
    setActiveStepIndex(0);
  };

  // Progression of simulated verification steps
  useEffect(() => {
    if (!isSimulating) return;

    if (activeStepIndex < verificationSteps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStepIndex((prev) => prev + 1);
      }, 850);
      return () => clearTimeout(timer);
    } else {
      // Final step completed
      const finalTimer = setTimeout(() => {
        setIsSimulating(false);
        onCompleteVerification();
      }, 900);
      return () => clearTimeout(finalTimer);
    }
  }, [isSimulating, activeStepIndex, verificationSteps.length, onCompleteVerification]);

  // If already verified, render the prominent Success Screen
  if (state.isVerified && !isSimulating) {
    const successTitle = isOm
      ? 'Mirkaneessi Eenyummaa Milkaa\'eera!'
      : isAm
      ? 'የማንነት ማረጋገጫዎ በተሳካ ሁኔታ ተጠናቋል!'
      : 'Identity Verification Successful!';

    const successMessage = isOm
      ? 'Mirkaneessi eenyummaa keessan milkaa\'inaan xumurameera. Amma hojiiwwan hunda hojjechuudhaan kaffaltii argachuu dandeessu.'
      : isAm
      ? 'የማንነት ማረጋገጫዎ በተሳካ ሁኔታ ጸድቋል። አሁን ሁሉንም የስራ ዕድሎች ማከናወንና ክፍያ ማግኘት ይችላሉ።'
      : 'Your identity has been verified. You now have unrestricted access to all earning tasks.';

    const currentDoc = DOCUMENT_TYPES.find((d) => d.id === state.documentType);
    const docName = isOm ? currentDoc?.nameOm : isAm ? currentDoc?.nameAm : currentDoc?.nameEn;

    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            {successTitle}
          </h2>

          <p className="text-slate-600 max-w-lg mx-auto text-base leading-relaxed mb-6">
            {successMessage}
          </p>

          {/* Verification Details Box */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 mb-8 text-left max-w-xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isOm ? 'Haala Ragaa' : isAm ? 'የመዝገብ ሁኔታ' : 'Registry Status'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Verified &amp; Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">
                  {isOm ? 'Maqaa Iyyataa' : isAm ? 'አመልካች' : 'Applicant'}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {state.applicantName || applicantName}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">
                  {isOm ? 'Gosa Waraqaa' : isAm ? 'የሰነድ አይነት' : 'Document Type'}
                </span>
                <span className="font-medium text-slate-900 text-xs sm:text-sm">
                  {docName || 'Ethiopian National Fayda ID'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">
                  {isOm ? 'Lakkoofsa Mirkaneessaa' : isAm ? 'መለያ ቁጥር' : 'Reference / FIN'}
                </span>
                <span className="font-mono font-medium text-slate-900 text-xs">
                  {state.idNumber || idNumber}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">
                  {isOm ? 'Yeroo Galmee' : isAm ? 'የተመዘገበበት ሰዓት' : 'Timestamp'}
                </span>
                <span className="font-medium text-slate-900 font-mono text-xs">
                  {state.verifiedAt || new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isOm
                  ? 'Mirkaneessi eenyummaa milkaa\'inaan xumurameera'
                  : isAm
                  ? 'የማንነት ማረጋገጫዎ በተሳካ ሁኔታ ጸድቋል'
                  : 'Identity verification completed and approved.'}
              </span>
            </div>
          </div>

          {/* Action Button: Return directly to Tasks */}
          <div className="flex items-center justify-center">
            <button
              onClick={onNavigateToEarn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-7 py-3.5 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <span>{isOm ? 'Gara Hojiiwwaniitti Deebi\'i' : isAm ? 'ወደ ስራዎች ተመለስ' : 'Start Earning Tasks'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If in simulating loading state, show the live simulated verification sequence
  if (isSimulating) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <RefreshCw className="w-7 h-7 text-slate-800 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isOm
                ? 'Eenyummaan Mirkanaa\'aa Jira...'
                : isAm
                ? 'የማንነት ማረጋገጫ በሂደት ላይ ነው...'
                : 'Processing Identity Verification...'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isOm
                ? 'Waraqaa fi suuraa qorachuudhaan gara kuusaa ragaatti galchaa jirra'
                : isAm
                ? 'የቀረበውን ሰነድ በመመርመር ወደ ማዕከላዊ የመረጃ ቋት እየተመዘገበ ነው'
                : 'Validating credentials and registering applicant into verified worker database'}
            </p>
          </div>

          {/* Step-by-step progress list */}
          <div className="space-y-4 max-w-lg mx-auto">
            {verificationSteps.map((step, idx) => {
              const isPassed = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              const stepTitle = isOm ? step.titleOm : isAm ? step.titleAm : step.titleEn;
              const stepDesc = isOm ? step.descOm : isAm ? step.descAm : step.descEn;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3.5 p-3.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-slate-50 border-slate-400 shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-100 opacity-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPassed ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? 'text-slate-900'
                          : isPassed
                          ? 'text-emerald-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {stepTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{stepDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default: Initial Verification Form
  const pageTitle = isOm
    ? 'Eenyummaa Keessan Mirkaneessaa (KYC)'
    : isAm
    ? 'የማንነትዎን ማረጋገጫ ያጠናቅቁ (KYC Verification)'
    : 'Identity Verification (KYC)';

  const pageExplanation = isOm
    ? 'Hojiiwwan kaffaltii qaban banachuuf waraqaa eenyummaa fi suuraa fuulaa dhiyeessaa.'
    : isAm
    ? 'ክፍያ ያላቸውን ስራዎች ለመጀመር የመታወቂያ ሰነድዎን እና የፊት ፎቶዎን ያቅርቡ።'
    : 'Submit your national ID document and face photograph to unlock verified task payouts.';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header section */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isOm ? 'Sirna Mirkaneessa Biyyoolessaa' : isAm ? 'ብሔራዊ የማንነት ማረጋገጫ ስርዓት' : 'National KYC Standard'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl">
          {pageExplanation}
        </p>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">
              {isOm ? 'Xiyyeeffannoon Barbaachisa' : isAm ? 'ትኩረት ያስፈልጋል' : 'Submission Incomplete'}
            </p>
            <p className="text-xs mt-0.5">{validationError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitVerification} className="space-y-8">
        {/* Step 1: Applicant Profile Fields */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            <span>{isOm ? '1. Odeeffannoo Iyyataa' : isAm ? '1. የአመልካች መረጃ' : '1. Applicant Profile'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isOm ? 'Maqaa Guutuu' : isAm ? 'ሙሉ ስም' : 'Full Legal Name'}
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{isOm ? 'Lakkoofsa Bilbilaa' : isAm ? 'ስልክ ቁጥር' : 'Phone Number'}</span>
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{isOm ? 'Magaalaa / Ganda' : isAm ? 'ከተማ / ክፍለ ከተማ' : 'City / Sub-city'}</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Document Type Selector for Ethiopian Context */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-900">
                {isOm
                  ? '2. Gosa Waraqaa Eenyummaa Itoophiyaa Filadhaa'
                  : isAm
                  ? '2. የመታወቂያ ሰነድ አይነት ይምረጡ'
                  : '2. Select Ethiopian ID Document Type'}
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOm
                  ? 'Waraqaa Faydaa, Gandaa, Paaspoortii ykn Hayyama Konkolaachisummaa'
                  : isAm
                  ? 'የሚቀርበውን ሰነድ ይምረጡ (ፋይዳ፣ የቀበሌ መታወቂያ፣ ፓስፖርት ወይም መንጃ ፈቃድ)'
                  : 'Choose the government document to be verified and stored into the database'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOCUMENT_TYPES.map((doc) => {
              const isSelected = selectedDocType === doc.id;
              const docName = isOm ? doc.nameOm : isAm ? doc.nameAm : doc.nameEn;
              const docDesc = isOm ? doc.descriptionOm : isAm ? doc.descriptionAm : doc.descriptionEn;
              const docAuth = isOm ? doc.issuingAuthorityOm : doc.issuingAuthority;

              return (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocType(doc.id);
                    onUpdateState({ documentType: doc.id });
                  }}
                  className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold text-slate-900">{docName}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{docDesc}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                    {docAuth}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: ID Document Upload */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                {isOm
                  ? '3. Suuraa Waraqaa Eenyummaa Olfe\'aa'
                  : isAm
                  ? '3. የመታወቂያ ሰነድ ፎቶ ያስገቡ'
                  : '3. Upload ID Document Image'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOm
                  ? 'Suuraa kaardii eenyummaa ykn paaspoortii (JPG, JPEG, PNG)'
                  : isAm
                  ? 'የመታወቂያ ካርድ ወይም ፓስፖርት ፎቶ (JPG, JPEG, PNG)'
                  : 'Upload an ID card or passport image. Supports JPG, JPEG, and PNG.'}
              </p>
            </div>

            {/* Quick 1-click test button */}
            <button
              type="button"
              onClick={handleUseSampleId}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isOm
                  ? 'Waraqaa Faydaa Yaalii Fayyadamaa'
                  : isAm
                  ? 'የፋይዳ ናሙና መታወቂያ ጫን'
                  : 'Use Sample Ethiopian Fayda ID'}
              </span>
            </button>
          </div>

          {/* ID Preview or Upload dropzone */}
          {state.idPreviewUrl ? (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="relative rounded-lg overflow-hidden bg-slate-900/5 max-h-64 flex items-center justify-center border border-slate-200">
                <img
                  src={state.idPreviewUrl}
                  alt="ID Document Preview"
                  className="max-h-60 w-auto object-contain rounded"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-600 truncate max-w-xs">
                  <span className="font-semibold text-slate-900 block truncate">
                    {state.idFileName || 'Selected Document'}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    OCR Status: Ready for verification
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={idInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleIdFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => idInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isOm ? 'Jijjiiri' : isAm ? 'ቀይር' : 'Replace Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isOm ? 'Haqi' : isAm ? 'ሰርዝ' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => idInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleIdFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-lg p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
            >
              <input
                ref={idInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleIdFileUpload(e.target.files[0]);
                  }
                }}
              />
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900">
                {isOm
                  ? 'Suuraa waraqaa eenyummaa filachuuf as tuqaa'
                  : isAm
                  ? 'የመታወቂያ ፎቶ ለመምረጥ እዚህ ይጫኑ'
                  : 'Click to upload or drag & drop ID document'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isOm ? 'JPG, JPEG ykn PNG (Hanga 10MB)' : isAm ? 'JPG, JPEG ወይም PNG (ከ 10MB በታች)' : 'PNG, JPG, or JPEG (Max 10MB)'}
              </p>
            </div>
          )}
        </div>

        {/* Step 4: Selfie Upload */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                {isOm
                  ? '4. Suuraa Fuulaa (Selfie) Olfe\'aa'
                  : isAm
                  ? '4. የራስዎን ፎቶ (Selfie) ያስገቡ'
                  : '4. Upload Selfie Face Photograph'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOm
                  ? 'Suuraa ifa ta\'e kan fuula keessanii dhiyeessaa'
                  : isAm
                  ? 'የፊት ገጽታ ፎቶ ያቅርቡ (ግልጽ የሆነ የፊት ምስል)'
                  : 'Upload a clear face photograph for biometric matching.'}
              </p>
            </div>

            {/* Quick 1-click test button */}
            <button
              type="button"
              onClick={handleUseSampleSelfie}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isOm
                  ? 'Suuraa Fuulaa Yaalii Fayyadamaa'
                  : isAm
                  ? 'የናሙና ሴልፊ ፎቶ ጫን'
                  : 'Use Sample Selfie Photo'}
              </span>
            </button>
          </div>

          {/* Selfie Preview or Dropzone */}
          {state.selfiePreviewUrl ? (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="relative rounded-lg overflow-hidden bg-slate-900/5 max-h-64 flex items-center justify-center border border-slate-200">
                <img
                  src={state.selfiePreviewUrl}
                  alt="Selfie Preview"
                  className="max-h-60 w-auto object-contain rounded"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-600 truncate max-w-xs">
                  <span className="font-semibold text-slate-900 block truncate">
                    {state.selfieFileName || 'Selected Face Photo'}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Liveness check: Passed
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSelfieFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => selfieInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isOm ? 'Jijjiiri' : isAm ? 'ቀይር' : 'Replace Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveSelfie}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isOm ? 'Haqi' : isAm ? 'ሰርዝ' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => selfieInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleSelfieFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-lg p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50"
            >
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSelfieFileUpload(e.target.files[0]);
                  }
                }}
              />
              <User className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-900">
                {isOm
                  ? 'Suuraa fuulaa (selfie) filachuuf as tuqaa'
                  : isAm
                  ? 'የፊት ፎቶ (Selfie) ለመምረጥ እዚህ ይጫኑ'
                  : 'Click to upload or drag & drop selfie photo'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isOm ? 'JPG, JPEG ykn PNG' : isAm ? 'JPG, JPEG ወይም PNG' : 'PNG, JPG, or JPEG (Max 10MB)'}
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {isOm
                ? 'Ragaan keessan eegumsa cimaadhaan qabama'
                : isAm
                ? 'የቀረበው መረጃ በጥንቃቄ የተጠበቀ ነው'
                : 'Credentials encrypted & verified securely'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-7 py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>
              {isOm ? 'Mirkaneessa Galchi' : isAm ? 'ማረጋገጫውን አስገባ' : 'Submit Verification'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
