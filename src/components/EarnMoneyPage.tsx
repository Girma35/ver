import React, { useState } from 'react';
import { Language, VerificationState, UserWallet, EarningTask } from '../types';
import { EARNING_TASKS, PAYMENT_METHODS } from '../constants';
import { ShieldAlert, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
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
  const t = (om: string, am: string, en: string) =>
    language === 'om' ? om : language === 'am' ? am : en;
  const isVerified = state.isVerified;

  const [selectedTask, setSelectedTask] = useState<EarningTask | null>(null);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showKycPrompt, setShowKycPrompt] = useState(false);

  const titleOf = (task: EarningTask) => t(task.titleOm, task.titleAm, task.title);
  const descOf = (task: EarningTask) =>
    t(task.shortDescriptionOm, task.shortDescriptionAm, task.shortDescription);

  const handleTaskClick = (task: EarningTask) => {
    if (!isVerified) {
      setShowKycPrompt(true);
      return;
    }
    setSelectedTask(task);
  };

  const handleCompleteTask = (taskId: string, rewardEtb: number) => {
    if (wallet.completedTasks.includes(taskId)) return;
    onUpdateWallet({
      balanceEtb: wallet.balanceEtb + rewardEtb,
      completedTasks: [...wallet.completedTasks, taskId],
    });
  };

  const handleConfirmWithdrawal = (amount: number) => {
    onUpdateWallet({ balanceEtb: Math.max(0, wallet.balanceEtb - amount) });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Status + balance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {isVerified ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {isVerified
                ? t('Mirkanaa\'eera', 'ተረጋግጧል', 'Verified')
                : t('Hin mirkanoofne', 'አልተረጋገጠም', 'Not verified')}
            </p>
            {!isVerified && (
              <button
                onClick={onNavigateToVerification}
                className="text-xs text-emerald-700 font-medium hover:underline cursor-pointer"
              >
                {t('Amma mirkaneessi', 'አሁን አረጋግጥ', 'Verify now')}
              </button>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-slate-500">{t('Qarshii', 'ገቢ', 'Balance')}</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums">
            {wallet.balanceEtb.toLocaleString()} ETB
          </p>
          {wallet.balanceEtb > 0 && (
            <button
              onClick={() => setShowWithdrawal(true)}
              className="mt-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md cursor-pointer"
            >
              {t('Baasi', 'ወጪ አድርግ', 'Withdraw')}
            </button>
          )}
        </div>
      </div>

      {/* Tasks */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">
        {t('Hojiiwwan', 'ስራዎች', 'Tasks')}
      </h2>
      <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200 mb-6">
        {EARNING_TASKS.map((task) => {
          const done = wallet.completedTasks.includes(task.id);
          return (
            <li key={task.id}>
              <button
                onClick={() => handleTaskClick(task)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{titleOf(task)}</p>
                  <p className="text-xs text-slate-500 truncate">{descOf(task)}</p>
                </div>
                {done ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('Xumurameera', 'ተጠናቋል', 'Done')}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                    {task.rewardEtb} ETB
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Payout method */}
      <h2 className="text-base font-semibold text-slate-900 mb-3">
        {t('Karaa kaffaltii', 'የክፍያ መንገድ', 'Payout method')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => {
          const selected = wallet.withdrawalMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() =>
                onUpdateWallet({ withdrawalMethod: method.id as UserWallet['withdrawalMethod'] })
              }
              className={`px-4 py-2 rounded-lg border text-sm cursor-pointer ${
                selected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {method.name}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-8 text-center">
        {t(
          'Agarsiisa qofa — kaffaltiin dhugaa hin jiru.',
          'ማሳያ ብቻ — እውነተኛ ክፍያ የለም።',
          'Demo only — no real payments are made.'
        )}
      </p>

      {/* Verify-first prompt */}
      {showKycPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowKycPrompt(false)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-semibold text-slate-900 mb-2">
              {t('Dura mirkaneessi', 'መጀመሪያ ያረጋግጡ', 'Verify first')}
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              {t(
                'Hojii eegaluuf eenyummaa kee mirkaneessi.',
                'ስራ ለመጀመር ማንነትዎን ያረጋግጡ።',
                'Verify your identity to start tasks.'
              )}
            </p>
            <button
              onClick={() => {
                setShowKycPrompt(false);
                onNavigateToVerification();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-lg cursor-pointer"
            >
              {t('Gara mirkaneessaa', 'ወደ ማረጋገጫ', 'Go to verification')}
            </button>
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskSimulationModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onCompleteTask={handleCompleteTask}
          isAlreadyCompleted={wallet.completedTasks.includes(selectedTask.id)}
          language={language}
        />
      )}

      {showWithdrawal && (
        <WithdrawalModal
          wallet={wallet}
          onClose={() => setShowWithdrawal(false)}
          onConfirmWithdrawal={handleConfirmWithdrawal}
          language={language}
        />
      )}
    </div>
  );
};
