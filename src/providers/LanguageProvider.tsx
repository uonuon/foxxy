import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DevSettings, I18nManager, NativeModules, Platform } from "react-native";
import { useTranslation } from "react-i18next";

import {
  initI18n,
  setStoredLanguage,
  type SupportedLanguage,
} from "@/i18n";

type LanguageContextValue = {
  language: SupportedLanguage;
  isRTL: boolean;
  ready: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  // Initialize once on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const initial = await initI18n();
      if (cancelled) return;

      const shouldBeRTL = initial === "ar";
      // Align RN layout direction with language. Forcing RTL only takes
      // full effect after a reload — we tolerate the first-launch flip.
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      }
      setLanguageState(initial);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await setStoredLanguage(lang);
      await i18n.changeLanguage(lang);
      setLanguageState(lang);

      const shouldBeRTL = lang === "ar";
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        // Reload so RN layout direction is applied. In dev, DevSettings
        // works; in production the user must restart the app.
        if (__DEV__) {
          DevSettings.reload();
        } else if (Platform.OS !== "web") {
          // Attempt a soft reload via DevMenu if available; otherwise the
          // user will need to relaunch manually for the new direction.
          NativeModules?.DevMenu?.reload?.();
        }
      }
    },
    [i18n],
  );

  const value = useMemo(
    () => ({
      language,
      isRTL: language === "ar",
      ready,
      setLanguage,
    }),
    [language, ready, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
