import React, { useState } from 'react';
import { EarningTask, Language } from '../types';
import { X, CheckCircle2, Clock, Check, Sparkles } from 'lucide-react';

interface TaskSimulationModalProps {
  task: EarningTask | null;
  onClose: () => void;
  onCompleteTask: (taskId: string, rewardEtb: number) => void;
  isAlreadyCompleted: boolean;
  language: Language;
}

export const TaskSimulationModal: React.FC<TaskSimulationModalProps> = ({
  task,
  onClose,
  onCompleteTask,
  isAlreadyCompleted,
  language,
}) => {
  if (!task) return null;

  const isAm = language === 'am';
  const isOm = language === 'om';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      onCompleteTask(task.id, task.rewardEtb);
    }, 800);
  };

  const taskTitle = isOm ? task.titleOm : isAm ? task.titleAm : task.title;
  const taskCat = isOm ? task.categoryOm : isAm ? task.categoryAm : task.category;
  const simQuestion = isOm ? task.simulationData.questionOm : isAm ? task.simulationData.questionAm : task.simulationData.question;
  const simContext = isOm ? task.simulationData.contextOm : isAm ? task.simulationData.contextAm : task.simulationData.context;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{taskCat}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-slate-700">{task.difficulty}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{taskTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {showSuccess || isAlreadyCompleted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {isOm
                  ? 'Hojiin Yaalii Milkaa\'inaan Xumurameera!'
                  : isAm
                  ? 'ተግባሩ በተሳካ ሁኔታ ተጠናቋል!'
                  : 'Sample Task Completed!'}
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {isOm
                  ? `Kaffaltiin yaalii ${task.rewardEtb} Qarshii Itoophiyaa (ETB) gara walattee keessaniitti galii ta\'eera.`
                  : isAm
                  ? `የይስሙላ ክፍያ ${task.rewardEtb} የኢትዮጵያ ብር (ETB) ወደ ዋሌትዎ ገቢ ተደርጓል።`
                  : `Simulated reward of ${task.rewardEtb} ETB has been credited to your demo balance.`}
              </p>

              <div className="mt-5 p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 inline-block text-xs text-emerald-800 font-medium">
                {isOm
                  ? 'Kun kaffaltii agarsiisa barnootaa qofadha.'
                  : isAm
                  ? 'ይህ ለትምህርት ማሳያ ብቻ የተዘጋጀ የይስሙላ ገቢ ነው።'
                  : 'Demonstration payout only · Simulated academic wallet'}
              </div>

              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  {isOm ? 'Gara Hojiiwwaniitti Deebi\'i' : isAm ? 'ወደ ስራዎች ተመለስ' : 'Return to Dashboard'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Task info summary */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{task.estMinutes} {isOm ? 'daqiiqaa' : isAm ? 'ደቂቃ' : 'mins'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">
                    {isOm ? 'Kaffaltii Yaalii' : isAm ? 'የሙከራ ክፍያ' : 'Simulated Reward'}
                  </span>
                  <span className="font-bold text-emerald-700 text-sm font-mono tabular-nums">
                    +{task.rewardEtb} ETB
                  </span>
                </div>
              </div>

              {/* Simulation scenario */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isOm ? 'Gocha Agarsiisa Hojii' : isAm ? 'የተግባር ማጠቃለያና ጥያቄ' : 'Demonstration Activity'}
                </label>
                <p className="text-sm font-semibold text-slate-900 mb-2">{simQuestion}</p>
                <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-200/80">
                  {simContext}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500">
                  {isOm
                    ? 'Deebii mirkaneessaa sirrii ta\'e filadhaa:'
                    : isAm
                    ? 'ትክክለኛውን ምላሽ ይምረጡ'
                    : 'Select verification response:'}
                </label>
                {task.simulationData.options.map((opt) => {
                  const optText = isOm ? opt.textOm : isAm ? opt.textAm : opt.text;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                        selectedOption === opt.id
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 font-medium text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{optText}</span>
                        {selectedOption === opt.id && (
                          <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Submit sample task */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isOm ? 'Dhiisi' : isAm ? 'ይቅር' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={!selectedOption || isSubmitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{isOm ? 'Ergamaa jira...' : isAm ? 'እየተላከ ነው...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {isOm
                          ? 'Xumuri & Qarshii Hojjedhu'
                          : isAm
                          ? 'ተግባሩን አጠናቅቅና ብር አግኝ'
                          : 'Complete & Earn ETB'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
