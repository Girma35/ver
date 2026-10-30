export type VerificationFileKind = 'id' | 'selfie';

export interface StoredVerificationFile {
  id: number;
  kind: VerificationFileKind;
  name: string;
  mimeType: string;
  sizeBytes: number;
  blob: Blob;
  createdAt: string;
}

export interface StoredVerificationSubmission {
  id?: number;
  applicantName: string;
  phoneNumber: string;
  city: string;
  documentType: string;
  idNumber: string;
  idFileId: number | null;
  selfieFileId: number | null;
  createdAt: string;
}

const DB_NAME = 'workethio_kyc_db';
const DB_VERSION = 1;
const FILES_STORE = 'files';
const SUBMISSIONS_STORE = 'submissions';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        db.createObjectStore(FILES_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SUBMISSIONS_STORE)) {
        db.createObjectStore(SUBMISSIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open verification database'));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export async function saveVerificationFile(
  file: Blob,
  kind: VerificationFileKind,
  fileName: string
): Promise<StoredVerificationFile> {
  const db = await openDb();
  try {
    const record: Omit<StoredVerificationFile, 'id'> = {
      kind,
      name: fileName,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      blob: file,
      createdAt: new Date().toISOString(),
    };

    const tx = db.transaction(FILES_STORE, 'readwrite');
    const store = tx.objectStore(FILES_STORE);
    const id = await requestToPromise(store.add(record) as IDBRequest<number>);
    return { id, ...record };
  } finally {
    db.close();
  }
}

export async function getVerificationFile(id: number): Promise<StoredVerificationFile | null> {
  const db = await openDb();
  try {
    const tx = db.transaction(FILES_STORE, 'readonly');
    const record = await requestToPromise(
      tx.objectStore(FILES_STORE).get(id) as IDBRequest<StoredVerificationFile | undefined>
    );
    return record ?? null;
  } finally {
    db.close();
  }
}

export async function deleteVerificationFile(id: number): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(FILES_STORE, 'readwrite');
    await requestToPromise(tx.objectStore(FILES_STORE).delete(id));
  } finally {
    db.close();
  }
}

export async function saveVerificationSubmission(
  submission: StoredVerificationSubmission
): Promise<StoredVerificationSubmission> {
  const db = await openDb();
  try {
    const tx = db.transaction(SUBMISSIONS_STORE, 'readwrite');
    const id = await requestToPromise(
      tx.objectStore(SUBMISSIONS_STORE).add(submission) as IDBRequest<number>
    );
    return { ...submission, id };
  } finally {
    db.close();
  }
}

export async function clearVerificationDatabase(): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction([FILES_STORE, SUBMISSIONS_STORE], 'readwrite');
    await Promise.all([
      requestToPromise(tx.objectStore(FILES_STORE).clear()),
      requestToPromise(tx.objectStore(SUBMISSIONS_STORE).clear()),
    ]);
  } finally {
    db.close();
  }
}

export async function blobFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Could not load sample file');
  }
  return response.blob();
}
