import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const STORAGE_KEY = "foxxy.language";

export type SupportedLanguage = "en" | "ar";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "ar"];

function detectDeviceLanguage(): SupportedLanguage {
  try {
    const locales = Localization.getLocales();
    const primary = locales[0]?.languageCode ?? "en";
    return primary === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

/**
 * Initialize i18n synchronously at module load. This is critical: any
 * component that calls `useTranslation()` would otherwise see different
 * hook shapes between renders if init were async, violating Rules of Hooks.
 *
 * The stored-language override is loaded asynchronously after mount via
 * `loadStoredLanguage()` and applied with `i18n.changeLanguage`.
 */
const initialLanguage = detectDeviceLanguage();

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export async function getStoredLanguage(): Promise<SupportedLanguage | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") {
      return stored;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function setStoredLanguage(lang: SupportedLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

/**
 * Load the user's stored language preference and apply it to i18n if it
 * differs from the device default. Returns the active language.
 */
export async function loadStoredLanguage(): Promise<SupportedLanguage> {
  const stored = await getStoredLanguage();
  if (stored && stored !== i18n.language) {
    await i18n.changeLanguage(stored);
  }
  return (i18n.language as SupportedLanguage) ?? initialLanguage;
}

export default i18n;
