import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

// --- Aliased Imports for JSON files ---
import en from "@/assets/locales/en/translation.json";
import fa from "@/assets/locales/fa/translation.json";
import es from "@/assets/locales/es/translation.json"; // <-- Import Spanish
import fr from "@/assets/locales/fr/translation.json"; // <-- Import French
import de from "@/assets/locales/de/translation.json"; // <-- Import German
import ar from "@/assets/locales/ar/translation.json"; // <-- Import Arabic
import zh from "@/assets/locales/zh/translation.json";

// 1. Define your resources, now including the new languages.
const resources = {
  en: {
    translation: en,
  },
  fa: {
    translation: fa,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
  ar: {
    translation: ar,
  },
  zh: {
    translation: zh,
  },
} as const;

// 2. Get the list of languages your app supports from the resources object.
// This will now automatically include ['en', 'fa', 'es', 'fr', 'de', 'ar']
const supportedLngs = Object.keys(resources);

// 3. Get the user's preferred languages from their device.
const deviceLocales = getLocales();

// 4. Find the first language from the user's device that your app supports.
// This logic remains the same and works perfectly.
const bestSupportedLanguage = deviceLocales.find((locale) =>
  supportedLngs.includes(locale.languageCode),
);

// 5. Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  // Use the best-matched language, or fall back to 'en' if no match is found.
  // lng: bestSupportedLanguage?.languageCode || "en",
  lng: "fa",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already safes from xss
  },
  compatibilityJSON: "v3", // Recommended for React Native
});

export default i18n;
