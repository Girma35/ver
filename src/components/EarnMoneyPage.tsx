import React, { useState } from 'react';
import { Language, VerificationState, UserWallet, EarningTask } from '../types';
import { EARNING_TASKS, PAYMENT_METHODS, HERO_WORKSPACE_IMAGE } from '../constants';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Wallet,
  CheckCircle2,
  ChevronRight,
  Send,
  Lock,
  Building2,
  AlertCircle,
  Briefcase,
  X,
} from 'lucide-react';
import { TaskSimulationModal } from './TaskSimulationModal';
import { WithdrawalModal } from './WithdrawalModal';

interface EarnMoneyPageProps {
  state: VerificationState;
  wallet: UserWallet;
  onUpdateWallet: (updates: Partial<UserWallet>) => void;
  onNavigateToVerification: () => void;
  language: Language;
}

export const EarnMoneyPage: React.FC<EarnMoneyPageProps> = ({
  state,
  wallet,
  onUpdateWallet,
  onNavigateToVerification,
  language,
}) => {
  const isAm = language === 'am';
  const isOm = language === 'om';
  const isVerified = state.isVerified;

  // Modals
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<EarningTask | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState<boolean>(false);
  const [showKycRequiredModal, setShowKycRequiredModal] = useState<boolean>(false);
  const [pendingTaskTitle, setPendingTaskTitle] = useState<string>('');

  // Handle task click
  const handleTaskClick = (task: EarningTask) => {
    if (!isVerified) {
      setPendingTaskTitle(isOm ? task.titleOm : isAm ? task.titleAm : task.title);
      setShowKycRequiredModal(true);
      return;
    }
    setSelectedTaskForModal(task);
  };

  // Complete a sample task
  const handleCompleteTask = (taskId: string, rewardEtb: number) => {
    if (!wallet.completedTasks.includes(taskId)) {
      onUpdateWallet({
        balanceEtb: wallet.balanceEtb + rewardEtb,
        completedTasks: [...wallet.completedTasks, taskId],
      });
    }
  };

  // Confirm simulated withdrawal
  const handleConfirmWithdrawal = (amount: number) => {
    onUpdateWallet({
      balanceEtb: Math.max(0, wallet.balanceEtb - amount),
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Showcase Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 mb-8 overflow-hidden relative shadow-sm border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/90 text-emerald-400 text-xs font-semibold mb-3 border border-slate-700/80">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isOm
                ? 'Pilaatfoormii Hojii Dijitaalaa Itoophiyaa'
                : isAm
                ? 'የኢትዮጵያ ብሔራዊ የዲጂታል ስራዎች መድረክ'
                : 'Ethiopia National Digital Work Ecosystem'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
            {isOm
              ? 'Hojiiwwan Dijitaalaa Hojjedhaa, Kaffaltii Battalaa Argadhaa'
              : isAm
              ? 'የዲጂታል ስራዎችን ያከናውኑ፣ ክፍያዎን በቴሌብር እና በባንክ ይቀበሉ'
              : 'Complete Verified Digital Tasks & Earn in Ethiopian Birr'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            {isOm
              ? 'Hojiiwwan daataa AI, qorannoo gabaa fi qulqullina sooftiweerii Itoophiyaa keessatti qophaa\'an. Kaffaltiin karaa Telebirr fi Baankii Daldala Itoophiyaa raawwatama.'
              : isAm
              ? 'በአማርኛ እና ኦሮምኛ ቋንቋዎች የተዘጋጁ የ AI ዳታ ስያሜ፣ የገበያ መረጃ ቅኝት እና የፍሪላንስ ስራዎችን ያግኙ። ክፍያ በቀጥታ በቴሌብር እና በባንክ ይተላለፋል።'
              : 'Access enterprise AI data-labeling, Ethiopian retail audits, and localization QA. Payouts processed directly via Telebirr and Commercial Bank of Ethiopia.'}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {!isVerified ? (
              <button
                onClick={onNavigateToVerification}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>
                  {isOm
                    ? 'Eenyummaa Mirkaneessii Hojii Eegali'
                    : isAm
                    ? 'ማንነትዎን አረጋግጠው ስራ ይጀምሩ'
                    : 'Verify Identity & Unlock Tasks'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-lg text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {isOm
                    ? 'Eenyummaan Mirkanaa\'eera: Hojiiwwan Hunduu Banamaniiru'
                    : isAm
                    ? 'ማንነትዎ ተረጋግጧል፡ ስራዎችን ማከናወን ይችላሉ'
                    : 'KYC Verified: All Tasks Active'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Background image decoration */}
        <div className="absolute right-0 bottom-0 top-0 w-2/5 opacity-20 hidden lg:block overflow-hidden pointer-events-none">
          <img
            src={HERO_WORKSPACE_IMAGE}
            alt="Ethiopia Workspace"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Verification Status & Wallet Summary Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Verification Status Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              isVerified
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                : 'bg-amber-50 border border-amber-200 text-amber-600'
            }`}
          >
            {isVerified ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isOm ? 'Haala KYC' : isAm ? 'የማንነት ማረጋገጫ ሁኔታ' : 'Worker Verification Status'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {isVerified
                  ? isOm
                    ? 'Waraqaa Faydaan Mirkanaa\'eera'
                    : isAm
                    ? 'በብሔራዊ መታወቂያ ተረጋግጧል (Active)'
                    : 'Fayda Verified (Active)'
                  : isOm
                  ? 'Mirkaneessi Eenyummaa Hin Xumuramne'
                  : isAm
                  ? 'ማረጋገጫ አልተጠናቀቀም (KYC Required)'
                  : 'Identity Verification Required'}
              </span>
              {!isVerified && (
                <button
                  onClick={onNavigateToVerification}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
                >
                  {isOm ? 'Amma Mirkaneessi' : isAm ? 'አሁን አረጋግጥ' : 'Verify Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wallet Balance Widget */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {isOm ? 'Qarshii Hojjetame' : isAm ? 'ያለዎት ጠቅላላ ገቢ' : 'Available Earnings'}
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {wallet.balanceEtb.toLocaleString()} ETB
            </span>
          </div>

          {wallet.balanceEtb > 0 && (
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isOm ? 'Baasi' : isAm ? 'ወጪ አድርግ' : 'Withdraw'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Available Earning Tasks Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isOm ? 'Hojiiwwan Dhiyaatan' : isAm ? 'የሚገኙ የስራ እድሎች' : 'Available Earning Opportunities'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOm
                ? 'Hojii barbaaddan filachuudhaan eegaluu dandeessu'
                : isAm
                ? 'የሚፈልጉትን ስራ በመምረጥ ወዲያውኑ ማከናወን ይችላሉ'
                : 'Select an opportunity below to start working and earn Ethiopian Birr'}
            </p>
          </div>

          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isOm ? 'Hojiiwwan 3 Banaa Dha' : isAm ? '3 ክፍት ስራዎች አሉ' : '3 Open Tasks'}</span>
          </div>
        </div>

        {/* 3 Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EARNING_TASKS.map((task) => {
            const isCompleted = wallet.completedTasks.includes(task.id);
            const taskTitle = isOm ? task.titleOm : isAm ? task.titleAm : task.title;
            const taskCat = isOm ? task.categoryOm : isAm ? task.categoryAm : task.category;
            const taskDesc = isOm ? task.shortDescriptionOm : isAm ? task.shortDescriptionAm : task.shortDescription;
            const taskReqs = isOm ? task.requirementsOm : isAm ? task.requirementsAm : task.requirements;

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border transition-all p-6 flex flex-col justify-between shadow-xs ${
                  isVerified
                    ? 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Category & Difficulty */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                    <span className="truncate max-w-[150px] font-medium">{taskCat}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        task.difficulty === 'Beginner'
                          ? 'text-emerald-700'
                          : task.difficulty === 'Intermediate'
                          ? 'text-amber-700'
                          : 'text-indigo-700'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{taskTitle}</h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{taskDesc}</p>

                  {/* Key Highlights */}
                  <div className="space-y-1.5 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {isOm ? 'Ulaagaalee' : isAm ? 'መስፈርቶች' : 'Requirements'}
                    </span>
                    {taskReqs.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom strip: Reward & Action */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      {isOm ? 'Kaffaltii' : isAm ? 'የስራ ክፍያ' : 'Payout Reward'}
                    </span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {task.rewardEtb} ETB
                    </span>
                  </div>

                  <button
                    onClick={() => handleTaskClick(task)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        : isVerified
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isOm ? 'Xumurameera' : isAm ? 'ተጠናቋል' : 'Completed'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isOm ? 'Hojii Eegali' : isAm ? 'ስራ ጀምር' : 'Start Task'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ethiopian Payment Infrastructure - Exactly the 3 requested channels */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isOm ? 'Karaalee Kaffaltii Itoophiyaa' : isAm ? 'የክፍያ መቀበያ መንገዶች' : 'Supported Ethiopian Payment Channels'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOm
                ? 'Kaffaltiin hojiiwwan xumuraman battalatti karaa Telebirr fi Baankii Daldalaatiin daddarba'
                : isAm
                ? 'የተጠናቀቁ ስራዎች ክፍያ ወዲያውኑ በቴሌብር እና በባንክ በኩል ይተላለፋል'
                : 'Earnings settle directly via Telebirr and commercial banks'}
            </p>
          </div>

          {wallet.balanceEtb > 0 && (
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isOm ? 'Qarshii Baasi' : isAm ? 'ገንዘብ አውጣ' : 'Withdraw Balance'}</span>
            </button>
          )}
        </div>

        {/* 3 Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = wallet.withdrawalMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onUpdateWallet({ withdrawalMethod: method.id as any })}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {method.name}
                  </h4>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 ml-1">
                      ✓
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3">
                  {method.provider}
                </p>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold">{method.speed}</span>
                  <span className="text-slate-400 text-[10px] font-mono">
                    {isSelected ? (isOm ? 'Filatameera' : isAm ? 'ተመርጧል' : 'Active') : (isOm ? 'Filadhu' : isAm ? 'ምረጥ' : 'Select')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KYC Required Gatekeeping Modal (Triggered when unverified user clicks a task) */}
      {showKycRequiredModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isOm ? 'Mirkaneessi Eenyummaa Barbaachisaadha' : isAm ? 'የማንነት ማረጋገጫ ያስፈልጋል' : 'Identity Verification Required'}
                </h3>
              </div>
              <button
                onClick={() => setShowKycRequiredModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {isOm ? (
                  <>
                    Hojii <strong className="text-slate-900">{pendingTaskTitle}</strong> eegaluuf
                    duraan dursitanii waraqaa eenyummaa (Faydaa, Gandaa ykn Paaspoortii) dhiyeessuun
                    dirqama. Kunis seera kaffaltii fi eegumsa maallaqaatiif kan ooludha.
                  </>
                ) : isAm ? (
                  <>
                    የተመረጠውን ስራ <strong className="text-slate-900">{pendingTaskTitle}</strong> ለመጀመር
                    እና ክፍያ ለማግኘት አስቀድመው የማንነት ማረጋገጫ (ፋይዳ፣ የቀበሌ መታወቂያ ወይም ፓስፖርት)
                    ማጠናቀቅ አለብዎት።
                  </>
                ) : (
                  <>
                    To begin <strong className="text-slate-900">{pendingTaskTitle}</strong> and receive
                    payouts via Telebirr or CBE, your identity must be verified under National ID Program (NIDP) compliance.
                  </>
                )}
              </p>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 mb-6 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {isOm
                    ? 'Mirkaneessi daqiiqaa 1 qofa fudhata. Suuraa waraqaa fi selfie qofatu barbaadama.'
                    : isAm
                    ? 'የማረጋገጫ ሂደቱ 1 ደቂቃ ብቻ የሚወስድ ሲሆን የመታወቂያ ፎቶና ሴልፊ ብቻ ያካትታል።'
                    : 'Verification takes under 1 minute with instant automated review.'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowKycRequiredModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isOm ? 'Dhiisi' : isAm ? 'ይቅር' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowKycRequiredModal(false);
                    onNavigateToVerification();
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <span>{isOm ? 'Gara Mirkaneessaatti Deemi' : isAm ? 'ወደ ማረጋገጫ ገጽ ቀጥል' : 'Proceed to Verification'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Simulation Modal */}
      {selectedTaskForModal && (
        <TaskSimulationModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
          onCompleteTask={handleCompleteTask}
          isAlreadyCompleted={wallet.completedTasks.includes(selectedTaskForModal.id)}
          language={language}
        />
      )}

      {/* Payout Withdrawal Modal */}
      {showWithdrawalModal && (
        <WithdrawalModal
          wallet={wallet}
          onClose={() => setShowWithdrawalModal(false)}
          onConfirmWithdrawal={handleConfirmWithdrawal}
          language={language}
        />
      )}
    </div>
  );
};
