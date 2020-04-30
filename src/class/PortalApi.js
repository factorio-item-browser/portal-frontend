import {
    NUMBER_OF_MACHINES_PER_PAGE,
    NUMBER_OF_ITEM_RECIPES_PER_PAGE,
    NUMBER_OF_RANDOM_ITEMS,
    NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    PORTAL_API_URL,
} from "../helper/const";
import { cacheManager } from "./CacheManager";

/**
 * The class functioning as interface to the Portal API server.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
class PortalApi {
    /**
     * The cache manager.
     * @type {CacheManager}
     * @private
     */
    _cacheManager;

    /**
     * Initializes the API instance.
     * @param {CacheManager} cacheManager
     */
    constructor(cacheManager) {
        this._cacheManager = cacheManager;
    }

    /**
     * Executes a search with the specified query.
     * @param {string} query
     * @param {number} page
     * @returns {Promise<SearchResultsData>}
     * @throws {PortalApiError}
     */
    async search(query, page) {
        return await this._executeRequestWithCache("search", `${query}-${page}`, "GET", "/search", {
            query: query,
            indexOfFirstResult: (page - 1) * NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
            numberOfResults: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     * @param {NamesByTypes} namesByTypes
     * @returns {Promise<IconsStyleData>}
     * @throws {PortalApiError}
     */
    async getIconsStyle(namesByTypes) {
        return await this._executeRequest("POST", "/style/icons", namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     * @throws {PortalApiError}
     */
    async getItemIngredientRecipes(type, name, page) {
        return await this._executeRequestWithCache(
            "ingredient",
            `${type}-${name}-${page}`,
            "GET",
            `/${encodeURI(type)}/${encodeURI(name)}/ingredients`,
            {
                indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
            }
        );
    }

    /**
     * Fetches the recipes having the specified item as a product.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     * @throws {PortalApiError}
     */
    async getItemProductRecipes(type, name, page) {
        return await this._executeRequestWithCache(
            "product",
            `${type}-${name}-${page}`,
            "GET",
            `/${encodeURI(type)}/${encodeURI(name)}/products`,
            {
                indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
            }
        );
    }

    /**
     * Fetches random items from the server.
     * @return {Promise<EntityData[]>}
     * @throws {PortalApiError}
     */
    async getRandom() {
        return this._executeRequest("GET", "/random", { numberOfResults: NUMBER_OF_RANDOM_ITEMS });
    }

    /**
     * Fetches the recipe details with the specified name.
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     * @throws {PortalApiError}
     */
    async getRecipeDetails(name) {
        return await this._executeRequestWithCache("recipe", name, "GET", `/recipe/${encodeURI(name)}`);
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @param {string} name
     * @param {number} page
     * @returns {Promise<RecipeMachinesData>}
     * @throws {PortalApiError}
     */
    async getRecipeMachines(name, page) {
        return await this._executeRequestWithCache(
            "machine",
            `${name}-${page}`,
            "GET",
            `/recipe/${encodeURI(name)}/machines`,
            {
                indexOfFirstResult: (page - 1) * NUMBER_OF_MACHINES_PER_PAGE,
                numberOfResults: NUMBER_OF_MACHINES_PER_PAGE,
            }
        );
    }

    /**
     * Fetches the settings available for the current user.
     * @return {Promise<SettingsListData>}
     */
    async getSettings() {
        return this._executeRequest("GET", "/settings");
    }

    /**
     * Fetches the details to a specific setting.
     * @param {string} settingId
     * @return {Promise<SettingDetailsData>}
     */
    async getSetting(settingId) {
        return this._executeRequest("GET", `/settings/${encodeURI(settingId)}`);
    }

    /**
     * Fetches the status of the specified combination of mods, or the current setting.
     * @param {string[]} [modNames]
     * @return {Promise<SettingStatusData>}
     */
    async getSettingStatus(modNames) {
        if (Array.isArray(modNames)) {
            return this._executeRequest("POST", "/settings/status", modNames);
        }
        return this._executeRequest("GET", "/settings/status");
    }

    /**
     * Save the setting with the options.
     * @param {string} settingId
     * @param {SettingOptionsData} options
     * @return {Promise<void>}
     */
    async saveSetting(settingId, options) {
        await this._executeRequest("PUT", `/settings/${encodeURI(settingId)}`, options);
    }

    /**
     * Creates a new setting with the specified data.
     * @param {SettingCreateData} settingData
     * @return {Promise<void>}
     */
    async createSetting(settingData) {
        await this._executeRequest("PUT", "/settings", settingData);
    }

    /**
     * Deletes the setting with the specified id.
     * @param {string} settingId
     * @return {Promise<void>}
     */
    async deleteSetting(settingId) {
        await this._executeRequest("DELETE", `/settings/${encodeURI(settingId)}`);
    }

    /**
     * Fetches the tooltip data for the specified type and name.
     * @param {string} type
     * @param {string} name
     * @return {Promise<EntityData>}
     * @throws {PortalApiError}
     */
    async getTooltip(type, name) {
        return await this._executeRequestWithCache(
            "tooltip",
            `${type}-${name}`,
            "GET",
            `/tooltip/${encodeURI(type)}/${encodeURI(name)}`
        );
    }

    /**
     * Initializes the current session.
     * @returns {Promise<SessionInitData>}
     * @throws {PortalApiError}
     */
    async initializeSession() {
        return await this._executeRequest("GET", "/session/init");
    }

    /**
     * Sends the sidebar entities to the Portal API for persisting.
     * @param {array<SidebarEntityData>} sidebarEntities
     * @returns {Promise<void>}
     * @throws {PortalApiError}
     */
    async sendSidebarEntities(sidebarEntities) {
        await this._executeRequest("PUT", "/sidebar/entities", sidebarEntities);
    }

    /**
     * Executes a request with using a cache.
     * @param {string} namespace
     * @param {string} cacheKey
     * @param {string} method
     * @param {string} route
     * @param {object} [parameters]
     * @returns {Promise<*>}
     * @throws {PortalApiError}
     * @private
     */
    async _executeRequestWithCache(namespace, cacheKey, method, route, parameters) {
        const cache = this._cacheManager.get(namespace);
        const cachedData = cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._executeRequest(method, route, parameters);
        cache.write(cacheKey, requestedData);
        return requestedData;
    }

    /**
     * Executes a request.
     * @param {string} method
     * @param {string} route
     * @param {object} [parameters]
     * @returns {Promise<*>}
     * @throws {PortalApiError}
     * @private
     */
    async _executeRequest(method, route, parameters) {
        const requestUrl = this._buildRequestUrl(route, method === "GET" ? parameters : undefined);
        const requestOptions = this._buildRequestOptions(method, method !== "GET" ? parameters : undefined);

        let response;
        try {
            response = await fetch(requestUrl, requestOptions);
        } catch (e) {
            throw new PortalApiError(503, `Connection to server failed: ${e}`);
        }

        return this._handleResponse(response);
    }

    /**
     * Builds the full URL to request.
     * @param {string} route
     * @param {object} queryParams
     * @returns {string}
     * @private
     */
    _buildRequestUrl(route, queryParams) {
        let result = PORTAL_API_URL + route;
        const encodedParams = Object.keys(queryParams || {})
            .map((name) => {
                return `${encodeURIComponent(name)}=${encodeURIComponent(queryParams[name])}`;
            })
            .join("&");

        if (encodedParams !== "") {
            result += `?${encodedParams}`;
        }
        return result;
    }

    /**
     * Builds the options to use for the request,
     * @param {string} method
     * @param {object} [requestData]
     * @returns {object}
     * @private
     */
    _buildRequestOptions(method, requestData) {
        let options = {
            method: method,
            credentials: "include",
        };

        if (typeof requestData === "object") {
            options = {
                ...options,
                body: JSON.stringify(requestData),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }
        return options;
    }

    /**
     * Handles the response received from the server.
     * @param {Response} response
     * @return {Promise<string|object>}
     * @throws {PortalApiError}
     * @private
     */
    async _handleResponse(response) {
        let content;
        try {
            if (response.headers.get("Content-Type") === "application/json") {
                content = await response.json();
            } else {
                content = await response.text();
            }
        } catch (e) {
            throw new PortalApiError(500, `Failed to parse response: ${e}`);
        }

        if (!response.ok) {
            this._handleFailedResponse(response.status, content);
        }

        return content;
    }

    /**
     * Handles a failed response.
     * @param {number} statusCode
     * @param {string|object} content
     * @throws {PortalApiError}
     * @private
     */
    _handleFailedResponse(statusCode, content) {
        let message = content;
        if (typeof content === "object") {
            if (content.error && content.error.message) {
                message = content.error.message;
            } else {
                message = "Unknown error";
            }
        }

        throw new PortalApiError(statusCode, message);
    }
}

/**
 * The error type thrown by the PortalApi.
 */
export class PortalApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.code = statusCode;
    }
}

export const portalApi = new PortalApi(cacheManager);
