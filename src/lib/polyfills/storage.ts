// Minimal in-memory Storage polyfill for environments where the Web Storage API
// is absent or only partially implemented (e.g., Node during SSR/dev).
const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
};

const ensureStorage = (name: 'localStorage' | 'sessionStorage') => {
  const existing = (globalThis as unknown as Record<string, unknown>)[name] as Storage | undefined;
  if (typeof existing?.getItem === 'function' && typeof existing?.setItem === 'function') {
    return existing;
  }

  const memoryStorage = createMemoryStorage();
  (globalThis as unknown as Record<string, Storage>)[name] = memoryStorage;
  return memoryStorage;
};

ensureStorage('localStorage');
ensureStorage('sessionStorage');
