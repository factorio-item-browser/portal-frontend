/**
 * File containing some constant values helpful for other scripts.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */

export const breakpointSmall = 0;
export const breakpointMedium = 600;
export const breakpointLarge = 1000;
export const breakpointHuge = 1500;

export const routeFluidDetails = "fluidDetails";
export const routeIndex = "index";
export const routeItemDetails = "itemDetails";
export const routeRecipeDetails = "recipeDetails";
export const routeSearch = "search";

// Environment variables
export const enableCache = process.env.ENABLE_CACHE === "1";
export const portalApiUrl = process.env.PORTAL_API_URI;
