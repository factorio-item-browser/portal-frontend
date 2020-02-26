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

export const ROUTE_INDEX = "index";
export const ROUTE_ITEM_DETAILS = "itemDetails";
export const ROUTE_RECIPE_DETAILS = "recipeDetails";
export const ROUTE_SEARCH = "search";

export const NUMBER_OF_ITEM_RECIPES_PER_PAGE = 12;
export const NUMBER_OF_MACHINES_PER_PAGE = 12;
export const NUMBER_OF_RANDOM_ITEMS = 12;
export const NUMBER_OF_RECIPES_PER_ENTITY = 3;
export const NUMBER_OF_SEARCH_RESULTS_PER_PAGE = 24;

// Environment variables
export const ENABLE_CACHE = process.env.ENABLE_CACHE === "1";
export const PORTAL_API_URL = process.env.PORTAL_API_URI;
