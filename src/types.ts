export type PageType = 'tasks' | 'verification';

export type Language = 'en' | 'am' | 'om';

export type DocumentType = 'fayda' | 'kebele' | 'passport' | 'license';

export interface DocumentTypeOption {
  id: DocumentType;
  nameEn: string;
  nameAm: string;
  nameOm: string;
  descriptionEn: string;
  descriptionAm: string;
  descriptionOm: string;
  issuingAuthority: string;
  issuingAuthorityOm: string;
}

export interface VerificationState {
  isVerified: boolean;
  verifiedAt: string | null;
  applicantName: string;
  phoneNumber: string;
  city: string;
  documentType: DocumentType;
  idNumber: string;
  idFileName: string | null;
  idFileId: number | null;
  idPreviewUrl: string | null;
  /** Supabase Storage object path for the ID document (null until uploaded). */
  idFilePath: string | null;
  selfieFileName: string | null;
  selfieFileId: number | null;
  selfiePreviewUrl: string | null;
  /** Supabase Storage object path for the selfie (null until uploaded). */
  selfieFilePath: string | null;
  consentGiven: boolean;
  submissionId: number | null;
}

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface EarningTask {
  id: string;
  title: string;
  titleAm: string;
  titleOm: string;
  category: string;
  categoryAm: string;
  categoryOm: string;
  shortDescription: string;
  shortDescriptionAm: string;
  shortDescriptionOm: string;
  difficulty: TaskDifficulty;
  rewardEtb: number;
  estMinutes: number;
  requirements: string[];
  requirementsAm: string[];
  requirementsOm: string[];
  simulationData: {
    question: string;
    questionAm: string;
    questionOm: string;
    context: string;
    contextAm: string;
    contextOm: string;
    options: {
      id: string;
      text: string;
      textAm: string;
      textOm: string;
      isCorrect: boolean;
    }[];
  };
}

export interface UserWallet {
  balanceEtb: number;
  completedTasks: string[];
  withdrawalMethod: 'telebirr' | 'cbe' | 'awash' | 'abyssinia';
  phoneNumberOrAccount: string;
}
