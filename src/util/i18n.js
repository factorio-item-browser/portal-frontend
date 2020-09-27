// @flow

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import localeDe from "../locale/de.json";
import localeEn from "../locale/en.json";

(async (): Promise<void> => {
    await i18n.use(initReactI18next).init({
        resources: {
            en: {
                translation: localeEn,
            },
            de: {
                translation: localeDe,
            },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });
})();
