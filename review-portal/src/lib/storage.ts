import type { Draft, PortalState } from "./model";

export interface Workspace {
  state: PortalState;
  draft: Draft;
}

const DB_NAME = "include-review-portal";
const DB_VERSION = 1;
const KV = "kv";
const FILES = "files";
const KEY = "workspace";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB non disponibile"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(KV)) db.createObjectStore(KV);
        if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES);
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };
      request.onerror = () => reject(request.error ?? new Error("IndexedDB: apertura fallita"));
    });
  }
  return dbPromise;
}

function run<T>(
  store: string,
  mode: IDBTransactionMode,
  operation: (s: IDBObjectStore) => IDBRequest,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, mode);
        const request = operation(tx.objectStore(store));
        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB: operazione fallita"));
      }),
  );
}

export function storageAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

/** Async variant: opens the database once so private-mode failures surface. */
export async function storageAvailableAsync(): Promise<boolean> {
  if (!storageAvailable()) return false;
  try {
    await openDb();
    return true;
  } catch {
    return false;
  }
}

export async function loadWorkspace(): Promise<Workspace | null> {
  try {
    const value = await run<Workspace | undefined>(KV, "readonly", (s) => s.get(KEY));
    return value ?? null;
  } catch {
    return null;
  }
}

export async function saveWorkspace(workspace: Workspace): Promise<void> {
  await run<IDBValidKey>(KV, "readwrite", (s) => s.put(workspace, KEY));
}

export async function clearWorkspace(): Promise<void> {
  await run<undefined>(KV, "readwrite", (s) => s.delete(KEY));
}

export async function putAttachmentFile(id: string, file: Blob): Promise<void> {
  await run<IDBValidKey>(FILES, "readwrite", (s) => s.put(file, id));
}

export async function getAttachmentFile(id: string): Promise<Blob | null> {
  try {
    const value = await run<Blob | undefined>(FILES, "readonly", (s) => s.get(id));
    return value ?? null;
  } catch {
    return null;
  }
}

export async function deleteAttachmentFile(id: string): Promise<void> {
  try {
    await run<undefined>(FILES, "readwrite", (s) => s.delete(id));
  } catch {
    // an orphaned blob is harmless; the metadata is already gone
  }
}
