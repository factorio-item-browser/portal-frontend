// @flow

export const COMBINATION_ID_VANILLA = "2f4a45fa-a509-a9d1-aae6-ffcf984a7a76";
export const CRAFTING_TIME_INFINITE = 100000;
export const NUMBER_OF_ICONS_PER_REQUEST = 128;
export const NUMBER_OF_ITEM_RECIPES_PER_PAGE = 12;
export const NUMBER_OF_MACHINES_PER_PAGE = 12;
export const NUMBER_OF_RANDOM_ITEMS = 12;
export const NUMBER_OF_RECIPES_PER_ENTITY = 3;
export const NUMBER_OF_SEARCH_RESULTS_PER_PAGE = 24;

// Environment variables
export const CACHE_LIFETIME = parseInt(process.env.CACHE_LIFETIME || "", 10);
export const INTERVAL_CHECK_SETTING_STATUS = parseInt(process.env.INTERVAL_CHECK_SETTING_STATUS || "", 10);
export const PORTAL_API_URL = process.env.PORTAL_API_URI || "";
