import { DEMO_PROFILE_ID, supabase } from './supabase';
import type { VerificationFileKind } from './verificationDb';

/**
 * KYC document storage in Supabase Storage.
 *
 * Objects live in the private `kyc-documents` bucket under `<profile>/<kind>/`.
 * Postgres stores only the path, so the images can be fetched from any device.
 * Without credentials every helper resolves to null and the app keeps using the
 * local IndexedDB copy.
 */

export const KYC_BUCKET = 'kyc-documents';

// Signed links are created on load, so a long TTL only needs to cover one session.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

const KINDS: VerificationFileKind[] = ['id', 'selfie'];

function safeFileName(fileName: string): string {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^_+/, '');
  return cleaned.length > 0 ? cleaned.slice(-80) : 'document';
}

// Deterministic path: re-uploading the same file overwrites one object instead of
// leaving duplicates behind (the upload effect can legitimately run twice).
export function buildKycObjectPath(kind: VerificationFileKind, fileName: string): string {
  return `${DEMO_PROFILE_ID}/${kind}/${safeFileName(fileName)}`;
}

/** Uploads one document and returns its object path (null when storage is off). */
export async function uploadKycFile(
  file: Blob,
  kind: VerificationFileKind,
  fileName: string
): Promise<string | null> {
  if (!supabase) return null;

  const path = buildKycObjectPath(kind, fileName);
  const { error } = await supabase.storage.from(KYC_BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  });

  if (error) throw new Error(`Could not upload ${kind} document: ${error.message}`);
  return path;
}

/** Best-effort delete; failures are never fatal for the UI. */
export async function deleteKycFile(path: string | null | undefined): Promise<void> {
  if (!supabase || !path) return;
  await supabase.storage.from(KYC_BUCKET).remove([path]);
}

/** Temporary readable URL for a stored object. */
export async function createKycSignedUrl(
  path: string | null | undefined
): Promise<string | null> {
  if (!supabase || !path) return null;

  const { data, error } = await supabase.storage
    .from(KYC_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/** Empties the demo user's document folders (used by Reset). */
export async function clearKycStorage(): Promise<void> {
  if (!supabase) return;

  for (const kind of KINDS) {
    const folder = `${DEMO_PROFILE_ID}/${kind}`;
    const { data } = await supabase.storage.from(KYC_BUCKET).list(folder, { limit: 100 });
    const paths = (data ?? []).map((entry) => `${folder}/${entry.name}`);
    if (paths.length > 0) {
      await supabase.storage.from(KYC_BUCKET).remove(paths);
    }
  }
}
