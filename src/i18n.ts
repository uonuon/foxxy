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
  const locales = Localization.getLocales();
  const primary = locales[0]?.languageCode ?? "en";
  return primary === "ar" ? "ar" : "en";
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

export async function initI18n(): Promise<SupportedLanguage> {
  const stored = await getStoredLanguage();
  const initial = stored ?? detectDeviceLanguage();

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      lng: initial,
      fallbackLng: "en",
      compatibilityJSON: "v4",
      interpolation: { escapeValue: false },
    });
  } else {
    await i18n.changeLanguage(initial);
  }

  return initial;
}

export default i18n;
