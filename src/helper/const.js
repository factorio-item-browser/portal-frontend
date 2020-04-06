/**
 * File containing some constant values helpful for other scripts.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */

export const BREAKPOINT_SMALL = 0;
export const BREAKPOINT_MEDIUM = 800;
export const BREAKPOINT_LARGE = 1200;
export const BREAKPOINT_HUGE = 1500;

export const ERROR_INVALID_FILE = "invalid-file";
export const ERROR_NO_MODS = "no-mods";

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
export const ROUTE_SETTINGS_NEW = "settingsNew";

export const SETTING_STATUS_AVAILABLE = "available";
export const SETTING_STATUS_ERRORED = "errored";
export const SETTING_STATUS_LOADING = "loading";
export const SETTING_STATUS_PENDING = "pending";
export const SETTING_STATUS_UNKNOWN = "unknown";

export const STATUS_ERROR = "error";
export const STATUS_PENDING = "pending";
export const STATUS_SUCCESS = "success";
export const STATUS_WARNING = "warning";

export const STORAGE_KEY_SIDEBAR_ENTITIES = "sidebar-entities";
export const STORAGE_KEY_SETTING_HASH = "setting-hash";

// Environment variables
export const CACHE_LIFETIME = process.env.CACHE_LIFETIME;
export const PORTAL_API_URL = process.env.PORTAL_API_URI;
