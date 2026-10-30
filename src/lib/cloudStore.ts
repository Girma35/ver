import { DEMO_PROFILE_ID, isSupabaseConfigured, supabase } from './supabase';
import { clearKycStorage } from './documentStorage';
import type {
  DocumentType,
  Language,
  PageType,
  UserWallet,
  VerificationState,
} from '../types';

/**
 * Persistence layer for the single demo user.
 *
 * When Supabase credentials are present every state slice is mirrored to Postgres;
 * otherwise each helper resolves as a no-op so the app keeps working from the
 * local session cache alone.
 */

export type CloudSyncStatus = 'local' | 'connecting' | 'synced' | 'error';

export interface CloudState {
  wallet: UserWallet | null;
  verification: Partial<VerificationState> | null;
  preferences: { language: Language; currentPage: PageType } | null;
}

const PROFILE_TABLE = 'workethio_profiles';
const WALLET_TABLE = 'workethio_wallets';
const VERIFICATION_TABLE = 'workethio_verifications';

const LANGUAGES: Language[] = ['en', 'am', 'om'];
const PAGES: PageType[] = ['tasks', 'verification'];
const WITHDRAWAL_METHODS: UserWallet['withdrawalMethod'][] = [
  'telebirr',
  'cbe',
  'awash',
  'abyssinia',
];
const DOCUMENT_TYPES: DocumentType[] = ['fayda', 'kebele', 'passport', 'license'];

type ProfileRow = {
  language: string | null;
  current_page: string | null;
};

type WalletRow = {
  balance_etb: number | string | null;
  completed_tasks: string[] | null;
  withdrawal_method: string | null;
  phone_number_or_account: string | null;
};

type VerificationRow = {
  is_verified: boolean | null;
  verified_at: string | null;
  applicant_name: string | null;
  phone_number: string | null;
  city: string | null;
  document_type: string | null;
  id_number: string | null;
  consent_given: boolean | null;
  id_file_id: number | null;
  selfie_file_id: number | null;
  id_file_path: string | null;
  selfie_file_path: string | null;
  submission_id: number | null;
};

const isLanguage = (value: unknown): value is Language =>
  typeof value === 'string' && LANGUAGES.includes(value as Language);

const isPage = (value: unknown): value is PageType =>
  typeof value === 'string' && PAGES.includes(value as PageType);

const isWithdrawalMethod = (value: unknown): value is UserWallet['withdrawalMethod'] =>
  typeof value === 'string' && WITHDRAWAL_METHODS.includes(value as UserWallet['withdrawalMethod']);

const isDocumentType = (value: unknown): value is DocumentType =>
  typeof value === 'string' && DOCUMENT_TYPES.includes(value as DocumentType);

function toNumber(value: number | string | null, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? NaN);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// The wallet/verification tables reference the profile row, so it must exist first.
let profileRowEnsured = false;

async function ensureProfileRow(): Promise<void> {
  if (!supabase || profileRowEnsured) return;

  const { error } = await supabase
    .from(PROFILE_TABLE)
    .upsert({ profile_id: DEMO_PROFILE_ID }, { onConflict: 'profile_id', ignoreDuplicates: true });

  if (error) throw new Error(`Could not prepare the profile row: ${error.message}`);
  profileRowEnsured = true;
}

/** Reads whatever the cloud already has. Returns null when nothing was saved yet. */
export async function loadCloudState(): Promise<CloudState | null> {
  if (!supabase) return null;

  const [profileResult, walletResult, verificationResult] = await Promise.all([
    supabase.from(PROFILE_TABLE).select('*').eq('profile_id', DEMO_PROFILE_ID).maybeSingle(),
    supabase.from(WALLET_TABLE).select('*').eq('profile_id', DEMO_PROFILE_ID).maybeSingle(),
    supabase.from(VERIFICATION_TABLE).select('*').eq('profile_id', DEMO_PROFILE_ID).maybeSingle(),
  ]);

  const firstError =
    profileResult.error ?? walletResult.error ?? verificationResult.error;
  if (firstError) {
    throw new Error(`Could not read the saved state: ${firstError.message}`);
  }

  const profile = profileResult.data as ProfileRow | null;
  const wallet = walletResult.data as WalletRow | null;
  const verification = verificationResult.data as VerificationRow | null;

  if (!profile && !wallet && !verification) return null;

  return {
    wallet: wallet
      ? {
          balanceEtb: Math.max(0, toNumber(wallet.balance_etb)),
          completedTasks: Array.isArray(wallet.completed_tasks) ? wallet.completed_tasks : [],
          withdrawalMethod: isWithdrawalMethod(wallet.withdrawal_method)
            ? wallet.withdrawal_method
            : 'telebirr',
          phoneNumberOrAccount: wallet.phone_number_or_account ?? '',
        }
      : null,
    verification: verification
      ? {
          isVerified: Boolean(verification.is_verified),
          verifiedAt: verification.verified_at,
          applicantName: verification.applicant_name ?? '',
          phoneNumber: verification.phone_number ?? '',
          city: verification.city ?? '',
          documentType: isDocumentType(verification.document_type)
            ? verification.document_type
            : 'fayda',
          idNumber: verification.id_number ?? '',
          consentGiven: Boolean(verification.consent_given),
          idFileId: verification.id_file_id,
          selfieFileId: verification.selfie_file_id,
          idFilePath: verification.id_file_path,
          selfieFilePath: verification.selfie_file_path,
          submissionId: verification.submission_id,
        }
      : null,
    preferences:
      profile && (isLanguage(profile.language) || isPage(profile.current_page))
        ? {
            language: isLanguage(profile.language) ? profile.language : 'om',
            currentPage: isPage(profile.current_page) ? profile.current_page : 'tasks',
          }
        : null,
  };
}

export async function saveWalletToCloud(wallet: UserWallet): Promise<void> {
  if (!supabase) return;
  await ensureProfileRow();

  const { error } = await supabase.from(WALLET_TABLE).upsert(
    {
      profile_id: DEMO_PROFILE_ID,
      balance_etb: wallet.balanceEtb,
      completed_tasks: wallet.completedTasks,
      withdrawal_method: wallet.withdrawalMethod,
      phone_number_or_account: wallet.phoneNumberOrAccount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'profile_id' }
  );

  if (error) throw new Error(`Could not save the wallet: ${error.message}`);
}

export async function saveVerificationToCloud(
  verification: VerificationState
): Promise<void> {
  if (!supabase) return;
  await ensureProfileRow();

  const payload = {
    profile_id: DEMO_PROFILE_ID,
    is_verified: verification.isVerified,
    verified_at: verification.verifiedAt,
    applicant_name: verification.applicantName,
    phone_number: verification.phoneNumber,
    city: verification.city,
    document_type: verification.documentType,
    id_number: verification.idNumber,
    consent_given: verification.consentGiven,
    id_file_id: verification.idFileId,
    selfie_file_id: verification.selfieFileId,
    id_file_path: verification.idFilePath,
    selfie_file_path: verification.selfieFilePath,
    submission_id: verification.submissionId,
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase
    .from(VERIFICATION_TABLE)
    .upsert(payload, { onConflict: 'profile_id' });

  if (error && /file_path|column/i.test(error.message)) {
    // supabase/storage.sql has not been applied yet: keep syncing the record itself.
    const { id_file_path: _idPath, selfie_file_path: _selfiePath, ...withoutPaths } = payload;
    console.warn(
      '[WorkEthio] Storage columns missing — run supabase/storage.sql. Saving without document paths.'
    );
    ({ error } = await supabase
      .from(VERIFICATION_TABLE)
      .upsert(withoutPaths, { onConflict: 'profile_id' }));
  }

  if (error) throw new Error(`Could not save the verification: ${error.message}`);
}

export async function savePreferencesToCloud(
  language: Language,
  currentPage: PageType
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from(PROFILE_TABLE).upsert(
    {
      profile_id: DEMO_PROFILE_ID,
      language,
      current_page: currentPage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'profile_id' }
  );

  if (error) throw new Error(`Could not save the preferences: ${error.message}`);
  profileRowEnsured = true;
}

/** Wipes the demo user's cloud rows (used by the Reset action). */
export async function resetCloudState(): Promise<void> {
  if (!supabase) return;

  const [walletResult, verificationResult] = await Promise.all([
    supabase.from(WALLET_TABLE).delete().eq('profile_id', DEMO_PROFILE_ID),
    supabase.from(VERIFICATION_TABLE).delete().eq('profile_id', DEMO_PROFILE_ID),
  ]);

  const firstError = walletResult.error ?? verificationResult.error;
  if (firstError) throw new Error(`Could not reset the cloud data: ${firstError.message}`);

  // Stored documents are best-effort: a missing bucket must not block the reset.
  await clearKycStorage().catch(() => undefined);
}

export { isSupabaseConfigured };
