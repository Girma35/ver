import React, { useState } from 'react';
import { Language, UserWallet } from '../types';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Smartphone, Building2 } from 'lucide-react';

interface WithdrawalModalProps {
  wallet: UserWallet;
  onClose: () => void;
  onConfirmWithdrawal: (amount: number, method: string, targetAccount: string) => void;
  language: Language;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  wallet,
  onClose,
  onConfirmWithdrawal,
  language,
}) => {
  const isAm = language === 'am';
  const isOm = language === 'om';
  const [selectedMethod, setSelectedMethod] = useState<'telebirr' | 'cbe'>('telebirr');
  const [accountOrPhone, setAccountOrPhone] = useState<string>(
    wallet.phoneNumberOrAccount || '+251 91 123 4567'
  );
  const [withdrawAmount, setWithdrawAmount] = useState<number>(wallet.balanceEtb);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txnId, setTxnId] = useState<string>('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > wallet.balanceEtb) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTxnId(`TXN-ET-${Math.floor(100000 + Math.random() * 900000)}`);
      onConfirmWithdrawal(withdrawAmount, selectedMethod, accountOrPhone);
    }, 1200);
  };

  const modalTitle = isOm
    ? 'Qarshii Baasi'
    : isAm
    ? 'ገንዘብ አውጣ'
    : 'Disburse Earnings';

  const modalSub = isOm
    ? 'Kaffaltiin battalatti gara herrega keessaniitti daddarba'
    : isAm
    ? 'ክፍያው በቀጥታ ወደ ተገናኘው የክፍያ አካውንትዎ ይተላለፋል'
    : 'Instant disbursement to your verified Ethiopian payout account';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{modalTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{modalSub}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {isOm
                  ? 'Kaffaltiin Milkaa\'inaan Darbee Jira!'
                  : isAm
                  ? 'ክፍያው በተሳካ ሁኔታ ተላልፏል!'
                  : 'Payout Dispatched Successfully!'}
              </h4>

              {/* Transaction Receipt Card */}
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-900">{txnId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Disbursed Amount</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">{withdrawAmount.toLocaleString()} ETB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Beneficiary Account</span>
                  <span className="font-mono font-medium text-slate-900">{accountOrPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Channel</span>
                  <span className="font-medium text-slate-900">
                    {selectedMethod === 'telebirr' ? 'Telebirr (Ethio Telecom)' : 'Commercial Bank of Ethiopia'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Settlement Status</span>
                  </span>
                  <span>Direct Credit Dispatched</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isOm ? 'Cufi' : isAm ? 'ዝጋ' : 'Close Receipt'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isOm
                    ? 'Mala Kaffaltii Filadhaa'
                    : isAm
                    ? 'የክፍያ መቀበያ መንገድ'
                    : 'Select Payout Channel'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('telebirr');
                      setAccountOrPhone(wallet.phoneNumberOrAccount || '+251 91 123 4567');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedMethod === 'telebirr'
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Telebirr</div>
                      <div className="text-[10px] text-slate-500">Instant Mobile Money</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('cbe');
                      setAccountOrPhone('1000 2891 4021');
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedMethod === 'cbe'
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-amber-700" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">CBE Account</div>
                      <div className="text-[10px] text-slate-500">Commercial Bank of Eth.</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedMethod === 'telebirr'
                    ? (isOm
                        ? 'Lakkoofsa Bilbilaa Telebirr'
                        : isAm
                        ? 'የቴሌብር ስልክ ቁጥር'
                        : 'Telebirr Mobile Number')
                    : (isOm
                        ? 'Lakkoofsa Herrega Baankii (CBE)'
                        : isAm
                        ? 'የኢትዮጵያ ንግድ ባንክ ሒሳብ ቁጥር'
                        : 'CBE Bank Account Number')}
                </label>
                <input
                  type="text"
                  required
                  value={accountOrPhone}
                  onChange={(e) => setAccountOrPhone(e.target.value)}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">
                    {isOm
                      ? 'Hamma Qarshii Baafamu (ETB)'
                      : isAm
                      ? 'የማውጣት መጠን (ብር)'
                      : 'Withdrawal Amount (ETB)'}
                  </span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {isOm ? 'Kan jiru: ' : isAm ? 'ያለዎት ሂሳብ: ' : 'Available: '}
                    {wallet.balanceEtb.toLocaleString()} ETB
                  </span>
                </div>
                <input
                  type="number"
                  min="50"
                  max={wallet.balanceEtb}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isOm ? 'Dhiisi' : isAm ? 'ይቅር' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > wallet.balanceEtb}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isProcessing ? (
                    <span>{isOm ? 'Daddarbaa jira...' : isAm ? 'እየተላለፈ ነው...' : 'Processing...'}</span>
                  ) : (
                    <>
                      <span>{isOm ? 'Kaffaltii Baasi' : isAm ? 'ገንዘብ አውጣ' : 'Confirm Payout Transfer'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
