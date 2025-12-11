// Polyfill for Node.js 25+ experimental localStorage
// This fixes the "localStorage.getItem is not a function" error

if (typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined') {
  // Check if localStorage exists but doesn't have proper methods (Node.js 25+ issue)
  const ls = globalThis.localStorage as any;
  if (typeof ls.getItem !== 'function') {
    // Create a proper localStorage-like object
    const storage = new Map<string, string>();
    
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return storage.get(key) ?? null;
      },
      setItem: (key: string, value: string): void => {
        storage.set(key, String(value));
      },
      removeItem: (key: string): void => {
        storage.delete(key);
      },
      clear: (): void => {
        storage.clear();
      },
      get length(): number {
        return storage.size;
      },
      key: (index: number): string | null => {
        const keys = Array.from(storage.keys());
        return keys[index] ?? null;
      },
    };
    
    // Replace the broken localStorage with our mock
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  }
}

export {};
