import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import * as Haptics from "expo-haptics";

import { Fox } from "@/components/Fox";
import { PressableScale } from "@/components/PressableScale";
import { addFinds } from "@/db";
import { useLanguage } from "@/providers/LanguageProvider";

export default function SessionResult() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const params = useLocalSearchParams<{ result?: string; earned?: string }>();
  const completed = params.result === "completed";
  const earned = parseInt(params.earned ?? "0", 10) || 0;

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  useEffect(() => {
    if (completed) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      if (earned > 0) {
        addFinds(earned).catch(() => {});
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
        () => {},
      );
    }
  }, [completed, earned]);

  return (
    <SafeAreaView className="flex-1 bg-sand-200" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
        >
          <Fox
            state={completed ? "idle" : "distracted"}
            size={220}
          />
        </MotiView>

        <Text className={`text-ink text-3xl mt-6 ${fontBold}`}>
          {completed ? t("session.complete_title") : t("session.broken_title")}
        </Text>
        <Text
          className={`text-ink-muted text-center mt-2 ${fontClass}`}
        >
          {completed
            ? t("session.complete_subtitle")
            : t("session.broken_subtitle")}
        </Text>

        {completed && earned > 0 ? (
          <MotiView
            from={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 300 }}
            className="mt-6 bg-clay-600 px-5 py-2 rounded-full"
          >
            <Text className={`text-sand-50 ${fontBold}`}>
              {t("session.earned_finds", { count: earned })}
            </Text>
          </MotiView>
        ) : null}

        <View className="h-12" />

        <PressableScale onPress={() => router.replace("/")}>
          <View className="bg-clay-600 px-8 py-4 rounded-2xl">
            <Text className={`text-sand-50 ${fontBold}`}>
              {t("session.back_home")}
            </Text>
          </View>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
