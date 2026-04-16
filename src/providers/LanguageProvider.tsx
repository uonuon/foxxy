import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DevSettings, I18nManager, NativeModules, Platform } from "react-native";

import i18n, {
  loadStoredLanguage,
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

/**
 * Owns language state + keeps RN's I18nManager in sync with the active
 * language. We deliberately don't call `useTranslation()` here — the i18n
 * instance is initialized synchronously at module load (see src/i18n.ts),
 * and we mutate it via direct calls. This keeps the hook count stable
 * across renders.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) ?? "en",
  );

  // On mount, apply any stored preference + align RN's RTL flag.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const active = await loadStoredLanguage();
      if (cancelled) return;

      const shouldBeRTL = active === "ar";
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        // Direction only takes effect after a reload. We tolerate the
        // first-launch mismatch rather than reload during boot.
      }
      setLanguageState(active);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    await setStoredLanguage(lang);
    await i18n.changeLanguage(lang);
    setLanguageState(lang);

    const shouldBeRTL = lang === "ar";
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
      if (__DEV__) {
        DevSettings.reload();
      } else if (Platform.OS !== "web") {
        // In production we rely on the user relaunching — RN's layout
        // direction can't change at runtime without a JS reload.
        NativeModules?.DevMenu?.reload?.();
      }
    }
  }, []);

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
