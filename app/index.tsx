import React, { useCallback, useMemo } from "react";
import { Text, View, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { BurrowScene } from "@/components/BurrowScene";
import { PressableScale } from "@/components/PressableScale";
import { useStreak } from "@/hooks/useStreak";
import { useWallet } from "@/hooks/useWallet";
import { useLanguage } from "@/providers/LanguageProvider";
import { greetingKey } from "@/utils/time";

export default function BurrowHome() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { streak, refresh: refreshStreak } = useStreak();
  const { finds, refresh: refreshWallet } = useWallet();

  // Refresh on focus so completed sessions show up immediately.
  useFocusEffect(
    useCallback(() => {
      refreshStreak();
      refreshWallet();
    }, [refreshStreak, refreshWallet]),
  );

  const greeting = useMemo(() => {
    const key = greetingKey(new Date().getHours());
    return t(`burrow.greeting_${key}`);
  }, [t]);

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  return (
    <SafeAreaView className="flex-1 bg-sand-200" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
          <View>
            <Text className={`text-ink-muted text-sm ${fontClass}`}>
              {greeting}
            </Text>
            <Text className={`text-ink text-2xl mt-1 ${fontBold}`}>
              {t("app.name")}
            </Text>
          </View>
          <PressableScale onPress={() => router.push("/settings")}>
            <View className="w-10 h-10 rounded-full bg-sand-100 items-center justify-center border border-sand-300">
              <Text className="text-ink text-lg">⚙</Text>
            </View>
          </PressableScale>
        </View>

        {/* Stats strip */}
        <View className="px-6 mb-4 flex-row gap-3">
          <View className="flex-1 bg-sand-100 rounded-2xl p-4 border border-sand-300">
            <Text className={`text-ink-muted text-xs ${fontClass}`}>
              {t("burrow.finds_label")}
            </Text>
            <Text className={`text-ink text-xl mt-1 ${fontBold}`}>
              {finds}
            </Text>
          </View>
          <PressableScale
            onPress={() => router.push("/stats")}
            style={{ flex: 1 }}
          >
            <View className="bg-sand-100 rounded-2xl p-4 border border-sand-300">
              <Text className={`text-ink-muted text-xs ${fontClass}`}>
                {streak === 0
                  ? t("burrow.streak_days_zero")
                  : t("burrow.streak_days", { count: streak })}
              </Text>
              <Text className={`text-ink text-xl mt-1 ${fontBold}`}>
                {streak > 0 ? `${streak} 🔥` : "—"}
              </Text>
            </View>
          </PressableScale>
        </View>

        {/* Burrow scene */}
        <View className="mx-4 my-4 bg-sand-100 rounded-3xl overflow-hidden border border-sand-300">
          <BurrowScene state="idle" />
        </View>

        {/* Fox status */}
        <Text className={`text-center text-ink-muted ${fontClass} mb-6`}>
          {t("burrow.fox_idle")}
        </Text>

        {/* Primary CTA */}
        <View className="px-6">
          <PressableScale onPress={() => router.push("/session-setup")}>
            <View className="bg-clay-600 rounded-2xl py-5 items-center shadow">
              <Text
                className={`text-sand-50 text-lg ${fontBold}`}
              >
                {t("burrow.start_focus")}
              </Text>
            </View>
          </PressableScale>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
