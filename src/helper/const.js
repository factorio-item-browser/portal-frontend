/**
 * File containing some constant values helpful for other scripts.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */

export const BREAKPOINT_SMALL = 0;
export const BREAKPOINT_MEDIUM = 600;
export const BREAKPOINT_LARGE = 1000;
export const BREAKPOINT_HUGE = 1500;

export const LOCALES = {
    "af": "Afrikaans",
    "ar": "العَرَبِيَّة",
    "be": "Беларуская",
    "bg": "български език",
    "ca": "Català",
    "cs": "Čeština",
    "da": "Dansk",
    "de": "Deutsch",
    "el": "Ελληνικά",
    "en": "English",
    "eo": "Esperanto",
    "es-ES": "Español",
    "et": "Eesti",
    "fi": "Suomi",
    "fr": "Français",
    "fy-NL": "Frisian",
    "ga-IE": "Gaeilge",
    "he": "עברית",
    "hr": "Hrvatski",
    "hu": "Magyar",
    "id": "Bahasa Indonesia",
    "it": "Italiano",
    "ja": "日本語",
    "ko": "한국어",
    "lt": "Lietuvių",
    "lv": "Latviešu",
    "nl": "Nederlands",
    "no": "Norsk",
    "pl": "Polski",
    "pt-BR": "Português, Brasil",
    "pt-PT": "Português",
    "ro": "Română",
    "ru": "Русский",
    "sk": "Slovenčina",
    "sl": "Slovenščina",
    "sq": "Shqip",
    "sr": "Српски",
    "sv-SE": "Svenska",
    "th": "ภาษาไทย",
    "tr": "Türkçe",
    "uk": "Українська",
    "vi": "Tiếng Việt Nam",
    "zh-CN": "简体中文",
    "zh-TW": "繁體中文",
};

export const NUMBER_OF_ITEM_RECIPES_PER_PAGE = 12;
export const NUMBER_OF_MACHINES_PER_PAGE = 12;
export const NUMBER_OF_RANDOM_ITEMS = 12;
export const NUMBER_OF_RECIPES_PER_ENTITY = 3;
export const NUMBER_OF_SEARCH_RESULTS_PER_PAGE = 24;

export const RECIPE_MODE_HYBRID = "hybrid";
export const RECIPE_MODE_NORMAL = "normal";
export const RECIPE_MODE_EXPENSIVE = "expensive";
export const RECIPE_MODES = [RECIPE_MODE_HYBRID, RECIPE_MODE_NORMAL, RECIPE_MODE_EXPENSIVE];

export const ROUTE_INDEX = "index";
export const ROUTE_ITEM_DETAILS = "itemDetails";
export const ROUTE_RECIPE_DETAILS = "recipeDetails";
export const ROUTE_SEARCH = "search";
export const ROUTE_SETTINGS = "settings";

// Environment variables
export const ENABLE_CACHE = process.env.ENABLE_CACHE === "1";
export const PORTAL_API_URL = process.env.PORTAL_API_URI;
