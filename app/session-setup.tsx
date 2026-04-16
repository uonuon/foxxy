import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/components/PressableScale";
import { useLanguage } from "@/providers/LanguageProvider";

const DURATIONS = [15, 25, 45, 60, 90] as const;

export default function SessionSetup() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [duration, setDuration] = useState<number>(25);
  const [intent, setIntent] = useState("");

  const fontClass = language === "ar" ? "font-cairo" : "font-inter";
  const fontBold =
    language === "ar" ? "font-cairo-bold" : "font-inter-bold";

  const begin = () => {
    router.replace({
      pathname: "/session",
      params: {
        seconds: String(duration * 60),
        intent: intent.trim(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-sand-200" edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-4">
        <PressableScale onPress={() => router.back()}>
          <Text className={`text-ink-muted ${fontClass}`}>
            {isRTL ? "→" : "←"}
          </Text>
        </PressableScale>

        <Text className={`text-ink text-2xl mt-6 ${fontBold}`}>
          {t("session.choose_duration")}
        </Text>

        <View className="flex-row flex-wrap mt-6 -mx-1">
          {DURATIONS.map((m) => {
            const selected = duration === m;
            return (
              <View key={m} className="w-1/3 p-1">
                <PressableScale onPress={() => setDuration(m)}>
                  <View
                    className={`rounded-2xl py-5 items-center border ${
                      selected
                        ? "bg-clay-600 border-clay-700"
                        : "bg-sand-100 border-sand-300"
                    }`}
                  >
                    <Text
                      className={`text-2xl ${fontBold} ${
                        selected ? "text-sand-50" : "text-ink"
                      }`}
                    >
                      {m}
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${fontClass} ${
                        selected ? "text-sand-100" : "text-ink-muted"
                      }`}
                    >
                      {t("session.minutes")}
                    </Text>
                  </View>
                </PressableScale>
              </View>
            );
          })}
        </View>

        <Text className={`text-ink mt-8 mb-2 ${fontBold}`}>
          {t("session.what_are_you_doing")}
        </Text>
        <TextInput
          value={intent}
          onChangeText={setIntent}
          placeholder={t("session.intent_placeholder")}
          placeholderTextColor="#b8a88e"
          className={`bg-sand-100 border border-sand-300 rounded-2xl px-4 py-4 text-ink ${fontClass}`}
          style={{
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr",
          }}
          maxLength={60}
        />

        <View className="flex-1" />

        <PressableScale onPress={begin}>
          <View className="bg-clay-600 rounded-2xl py-5 items-center mb-2">
            <Text className={`text-sand-50 text-lg ${fontBold}`}>
              {t("session.begin")}
            </Text>
          </View>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
