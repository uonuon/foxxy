import React from "react";
import { ScrollView, Text, View } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/components/PressableScale";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  const version =
    Constants.expoConfig?.version ?? Constants.manifest2?.extra?.expoClient?.version ?? "0.1.0";

  return (
    <SafeAreaView className="flex-1 bg-sand-200" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-6 pt-4 flex-row items-center justify-between">
          <PressableScale onPress={() => router.back()}>
            <Text className={`text-ink-muted ${fontClass}`}>
              {isRTL ? "→" : "←"}
            </Text>
          </PressableScale>
          <Text className={`text-ink text-xl ${fontBold}`}>
            {t("settings.title")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Language */}
        <View className="px-6 mt-6">
          <Text className={`text-ink-muted text-sm mb-2 ${fontClass}`}>
            {t("settings.language")}
          </Text>
          <View className="flex-row gap-3">
            <LangChip
              active={language === "en"}
              label="English"
              onPress={() => setLanguage("en")}
              fontBold={fontBold}
              fontClass={fontClass}
            />
            <LangChip
              active={language === "ar"}
              label="العربية"
              onPress={() => setLanguage("ar")}
              fontBold={fontBold}
              fontClass={fontClass}
            />
          </View>
        </View>

        {/* About */}
        <View className="px-6 mt-10">
          <Text className={`text-ink-muted text-sm mb-2 ${fontClass}`}>
            {t("settings.about")}
          </Text>
          <View className="bg-sand-100 border border-sand-300 rounded-2xl p-4">
            <View className="flex-row justify-between">
              <Text className={`text-ink ${fontClass}`}>
                {t("settings.version")}
              </Text>
              <Text className={`text-ink-muted ${fontClass}`}>{version}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LangChip({
  active,
  label,
  onPress,
  fontBold,
  fontClass,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  fontBold: string;
  fontClass: string;
}) {
  return (
    <PressableScale onPress={onPress} style={{ flex: 1 }}>
      <View
        className={`rounded-2xl py-4 items-center border ${
          active
            ? "bg-clay-600 border-clay-700"
            : "bg-sand-100 border-sand-300"
        }`}
      >
        <Text
          className={`${active ? `text-sand-50 ${fontBold}` : `text-ink ${fontClass}`}`}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
