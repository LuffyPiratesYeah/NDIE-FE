// Check if we're in a real browser environment (not Node.js with experimental localStorage)
const isBrowserEnvironment = (): boolean => {
  // Must have window
  if (typeof window === 'undefined') return false;
  // Must have document (Node.js doesn't have this)
  if (typeof document === 'undefined') return false;
  // Must have window.localStorage with proper methods
  if (typeof window.localStorage === 'undefined') return false;
  // Check if it's the real browser localStorage (has Storage prototype)
  if (!(window.localStorage instanceof Storage)) return false;
  return true;
};

let _canUse: boolean | null = null;

const canUseLocalStorage = (): boolean => {
  if (_canUse !== null) return _canUse;
  
  try {
    if (!isBrowserEnvironment()) {
      _canUse = false;
      return false;
    }
    // Test if localStorage actually works
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    _canUse = true;
    return true;
  } catch {
    _canUse = false;
    return false;
  }
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (canUseLocalStorage()) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // ignore
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      if (canUseLocalStorage()) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
};
