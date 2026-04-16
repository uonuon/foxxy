import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/components/PressableScale";
import { getRecentSessions, type SessionRecord } from "@/db";
import { useStreak } from "@/hooks/useStreak";
import { useLanguage } from "@/providers/LanguageProvider";

const DAY_MS = 86_400_000;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function Stats() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { streak } = useStreak();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentSessions(200).then(setSessions);
    }, []),
  );

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  const todayStart = startOfToday();
  const weekStart = todayStart - 6 * DAY_MS;

  const completed = sessions.filter((s) => s.status === "completed");
  const todaySeconds = completed
    .filter((s) => s.startedAt >= todayStart)
    .reduce((sum, s) => sum + s.actualSeconds, 0);
  const weekSeconds = completed
    .filter((s) => s.startedAt >= weekStart)
    .reduce((sum, s) => sum + s.actualSeconds, 0);
  const allTimeSeconds = completed.reduce(
    (sum, s) => sum + s.actualSeconds,
    0,
  );

  function fmt(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}${t("stats.hours")} ${m}${t("stats.minutes_short")}`;
    return `${m}${t("stats.minutes_short")}`;
  }

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
            {t("stats.title")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="px-6 mt-6 gap-3">
          <StatCard
            label={t("stats.today_focus")}
            value={fmt(todaySeconds)}
            count={`${completed.filter((s) => s.startedAt >= todayStart).length} ${t("stats.sessions")}`}
            fontClass={fontClass}
            fontBold={fontBold}
          />
          <StatCard
            label={t("stats.this_week")}
            value={fmt(weekSeconds)}
            count={`${completed.filter((s) => s.startedAt >= weekStart).length} ${t("stats.sessions")}`}
            fontClass={fontClass}
            fontBold={fontBold}
          />
          <StatCard
            label={t("stats.all_time")}
            value={fmt(allTimeSeconds)}
            count={`${completed.length} ${t("stats.sessions")}`}
            fontClass={fontClass}
            fontBold={fontBold}
          />
          <StatCard
            label={t("stats.current_streak")}
            value={`${streak} 🔥`}
            count=""
            fontClass={fontClass}
            fontBold={fontBold}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  count,
  fontClass,
  fontBold,
}: {
  label: string;
  value: string;
  count: string;
  fontClass: string;
  fontBold: string;
}) {
  return (
    <View className="bg-sand-100 rounded-2xl p-5 border border-sand-300">
      <Text className={`text-ink-muted text-sm ${fontClass}`}>{label}</Text>
      <Text className={`text-ink text-3xl mt-2 ${fontBold}`}>{value}</Text>
      {count ? (
        <Text className={`text-ink-muted text-xs mt-1 ${fontClass}`}>
          {count}
        </Text>
      ) : null}
    </View>
  );
}
