# Foxxy 🦊

Arabic-first gamified focus timer. A fennec fox builds and decorates a desert burrow while you focus.

## Status

v0.1 — frontend skeleton. Local-only persistence (expo-sqlite). Backend (Firebase) comes after the experience is validated.

## Stack

- Expo SDK 54 (managed workflow)
- expo-router, NativeWind, Moti, lucide
- i18next + react-i18next, expo-localization (Arabic + English, RTL)
- expo-sqlite (sessions, wallet, decorations)

## Run

```sh
npm install
npm run ios     # or: npm run android
```

## Project layout

```
app/                   # expo-router screens
  _layout.tsx          # providers, fonts, splash
  index.tsx            # Burrow home
  session-setup.tsx    # Pick duration + intent
  session.tsx          # Active focus timer
  session-result.tsx   # Complete / broken screen
  stats.tsx            # Focus journey stats
  settings.tsx         # Language, about

src/
  components/          # FoxPlaceholder, BurrowScene, PressableScale
  db/                  # expo-sqlite schema + queries
  hooks/               # useStreak, useWallet
  i18n.ts              # i18next setup
  locales/             # en.json, ar.json
  providers/           # LanguageProvider (RTL handling)
  theme/               # colors palette
  utils/               # time helpers
```

## Roadmap

- v0.x — replace fox SVG placeholder with Rive animation
- v0.x — decoration shop + burrow placement
- v1.0 — Firebase auth + Firestore + Cloud Functions for anti-cheat
- v1.x — social: friends + leaderboards
- v2.0 — Screen Time API integration for hard app blocking
