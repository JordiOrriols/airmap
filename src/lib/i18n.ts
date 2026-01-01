import i18n, { type InitOptions, type Resource } from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "../locales/en";
import { es } from "../locales/es";
import { ca } from "../locales/ca";

const resources: Resource = {
  en,
  es,
  ca,
};

const options: InitOptions = {
  resources,

  lng: "en",
  fallbackLng: "en",
  debug: true,

  interpolation: {
    escapeValue: false,
  },
};

i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init(options);

export default i18n;
