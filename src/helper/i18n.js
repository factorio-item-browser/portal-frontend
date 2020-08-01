import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import localeDe from "../locale/de";
import localeEn from "../locale/en";

(async () => {
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
