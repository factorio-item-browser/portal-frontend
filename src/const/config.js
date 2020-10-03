// @flow

import { faDiscord, IconDefinition } from "@fortawesome/free-brands-svg-icons";

export const CRAFTING_TIME_INFINITE = 100000;
export const NUMBER_OF_ICONS_PER_REQUEST = 128;
export const NUMBER_OF_ITEMS_PER_PAGE = 128;
export const NUMBER_OF_ITEM_RECIPES_PER_PAGE = 12;
export const NUMBER_OF_MACHINES_PER_PAGE = 12;
export const NUMBER_OF_RANDOM_ITEMS = 12;
export const NUMBER_OF_RECIPES_PER_ENTITY = 3;
export const NUMBER_OF_SEARCH_RESULTS_PER_PAGE = 24;

// Environment variables
export const CACHE_LIFETIME = parseInt(process.env.CACHE_LIFETIME || "", 10);
export const INTERVAL_CHECK_SETTING_STATUS = parseInt(process.env.INTERVAL_CHECK_SETTING_STATUS || "", 10);
export const PORTAL_API_URL = process.env.PORTAL_API_URI || "";

export const FOOTER_ICONS: {
    name: string,
    url: string,
    icon: IconDefinition,
}[] = [
    {
        name: "discord",
        url: process.env.DISCORD_LINK || "",
        icon: faDiscord,
    },
];
