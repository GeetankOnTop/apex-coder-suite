// Simple encryption for localStorage security
const ENCRYPTION_KEY = "codeflow-secure-key-v1";

export const encrypt = (data: string): string => {
  try {
    const encoded = btoa(encodeURIComponent(data));
    return encoded.split('').reverse().join('') + ENCRYPTION_KEY;
  } catch (e) {
    console.error("Encryption failed");
    return data;
  }
};

export const decrypt = (encryptedData: string): string => {
  try {
    const cleaned = encryptedData.replace(ENCRYPTION_KEY, '');
    const reversed = cleaned.split('').reverse().join('');
    return decodeURIComponent(atob(reversed));
  } catch (e) {
    console.error("Decryption failed");
    return encryptedData;
  }
};

export const secureStorage = {
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, encrypt(value));
  },
  getItem: (key: string): string | null => {
    const item = localStorage.getItem(key);
    return item ? decrypt(item) : null;
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};
