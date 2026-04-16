import React, { useEffect, useRef, useState } from "react";
import { Alert, AppState, type AppStateStatus, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { BurrowScene } from "@/components/BurrowScene";
import { PressableScale } from "@/components/PressableScale";
import type { FoxState } from "@/components/FoxPlaceholder";
import { insertSession } from "@/db";
import { useLanguage } from "@/providers/LanguageProvider";
import { formatMMSS } from "@/utils/time";

// Earn rate: 1 desert find per minute focused. Tweak post-launch.
const FINDS_PER_MINUTE = 1;

export default function Session() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const params = useLocalSearchParams<{ seconds?: string; intent?: string }>();
  const plannedSeconds = Math.max(
    60,
    Math.min(7200, parseInt(params.seconds ?? "1500", 10)),
  );
  const intent = (params.intent ?? "").toString();

  const [remaining, setRemaining] = useState(plannedSeconds);
  const [foxState, setFoxState] = useState<FoxState>("working");
  const startedAtRef = useRef<number>(Date.now());
  const finishedRef = useRef(false);

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  // Tick down once per second.
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          completeSession();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect leaving the app — soft loss-aversion signal for v1. We don't
  // hard-fail the session here, but we mark Foxxy as "distracted" so the
  // user feels the cost. v2 will integrate Screen Time API.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "background" || next === "inactive") {
        setFoxState("distracted");
      } else if (next === "active") {
        setFoxState("working");
      }
    });
    return () => sub.remove();
  }, []);

  async function completeSession() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const endedAt = Date.now();
    const actualSeconds = Math.round((endedAt - startedAtRef.current) / 1000);
    const earned = Math.floor(plannedSeconds / 60) * FINDS_PER_MINUTE;
    await insertSession({
      startedAt: startedAtRef.current,
      endedAt,
      plannedSeconds,
      actualSeconds: Math.min(actualSeconds, plannedSeconds),
      status: "completed",
      intent: intent || null,
    });
    router.replace({
      pathname: "/session-result",
      params: { result: "completed", earned: String(earned) },
    });
  }

  async function abortSession() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const endedAt = Date.now();
    const actualSeconds = Math.round((endedAt - startedAtRef.current) / 1000);
    await insertSession({
      startedAt: startedAtRef.current,
      endedAt,
      plannedSeconds,
      actualSeconds,
      status: "broken",
      intent: intent || null,
    });
    router.replace({
      pathname: "/session-result",
      params: { result: "broken", earned: "0" },
    });
  }

  function confirmAbort() {
    Alert.alert(
      t("session.give_up"),
      t("session.give_up_warn"),
      [
        { text: t("session.give_up_no"), style: "cancel" },
        {
          text: t("session.give_up_yes"),
          style: "destructive",
          onPress: abortSession,
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sand-200" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-between px-6 py-4">
        <View className="items-center mt-4">
          <Text className={`text-ink-muted text-xs uppercase ${fontClass}`}>
            {t("session.time_left")}
          </Text>
          <Text
            className={`text-ink mt-2 ${fontBold}`}
            style={{ fontSize: 64, lineHeight: 72 }}
          >
            {formatMMSS(remaining)}
          </Text>
          {intent ? (
            <Text className={`text-ink-muted mt-2 ${fontClass}`}>
              {intent}
            </Text>
          ) : null}
        </View>

        <View className="w-full">
          <BurrowScene state={foxState} height={300} />
          <Text className={`text-center text-ink-muted mt-2 ${fontClass}`}>
            {t("session.running")}
          </Text>
        </View>

        <PressableScale onPress={confirmAbort}>
          <View className="px-6 py-3 rounded-full border border-sand-400">
            <Text className={`text-ink-muted ${fontClass}`}>
              {t("session.give_up")}
            </Text>
          </View>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
