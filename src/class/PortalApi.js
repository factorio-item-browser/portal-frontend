import {
    NUMBER_OF_MACHINES_PER_PAGE,
    NUMBER_OF_ITEM_RECIPES_PER_PAGE,
    NUMBER_OF_RANDOM_ITEMS,
    NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    PORTAL_API_URL,
} from "../helper/const";

/**
 * The class functioning as interface to the Portal API server.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
class PortalApi {
    /**
     * Executes a search with the specified query.
     * @param {string} query
     * @param {number} page
     * @returns {Promise<SearchResultsData>}
     */
    async search(query, page) {
        return this._executeRequest("GET", "/search", {
            query,
            indexOfFirstResult: (page - 1) * NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
            numberOfResults: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     * @param {NamesByTypes} namesByTypes
     * @returns {Promise<IconsStyleData>}
     */
    async getIconsStyle(namesByTypes) {
        return this._executeRequest("POST", "/style/icons", namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     */
    async getItemIngredientRecipes(type, name, page) {
        return this._executeRequest("GET", `/${encodeURI(type)}/${encodeURI(name)}/ingredients`, {
            indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
            numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
        });
    }

    /**
     * Fetches the recipes having the specified item as a product.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     */
    async getItemProductRecipes(type, name, page) {
        return this._executeRequest("GET", `/${encodeURI(type)}/${encodeURI(name)}/products`, {
            indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
            numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
        });
    }

    /**
     * Fetches random items from the server.
     * @return {Promise<EntityData[]>}
     */
    async getRandom() {
        return this._executeRequest("GET", "/random", { numberOfResults: NUMBER_OF_RANDOM_ITEMS });
    }

    /**
     * Fetches the recipe details with the specified name.
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     */
    async getRecipeDetails(name) {
        return this._executeRequest("GET", `/recipe/${encodeURI(name)}`);
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @param {string} name
     * @param {number} page
     * @returns {Promise<RecipeMachinesData>}
     */
    async getRecipeMachines(name, page) {
        return this._executeRequest("GET", `/recipe/${encodeURI(name)}/machines`, {
            indexOfFirstResult: (page - 1) * NUMBER_OF_MACHINES_PER_PAGE,
            numberOfResults: NUMBER_OF_MACHINES_PER_PAGE,
        });
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
     * Fetches the tooltip data for the specified type and name.
     * @param {string} type
     * @param {string} name
     * @return {Promise<EntityData>}
     */
    async getTooltip(type, name) {
        return this._executeRequest("GET", `/tooltip/${encodeURI(type)}/${encodeURI(name)}`);
    }

    /**
     * Initializes the current session.
     * @returns {Promise<SessionInitData>}
     */
    async initializeSession() {
        return this._executeRequest("GET", "/session/init");
    }

    /**
     * Sends the sidebar entities to the Portal API for persisting.
     * @param {array<SidebarEntityData>} sidebarEntities
     * @returns {Promise<void>}
     */
    async sendSidebarEntities(sidebarEntities) {
        await this._executeRequest("PUT", "/sidebar/entities", sidebarEntities);
    }

    /**
     * Executes a request.
     * @param {string} method
     * @param {string} route
     * @param {object} [parameters]
     * @returns {Promise<string|object>}
     * @private
     */
    async _executeRequest(method, route, parameters) {
        const requestUrl = this._buildRequestUrl(route, method === "GET" ? parameters : undefined);
        const requestOptions = this._buildRequestOptions(method, method !== "GET" ? parameters : undefined);

        const response = await fetch(requestUrl, requestOptions);
        return this._handleResponse(response);
    }

    /**
     * Handles the response received from the server.
     * @param {Response} response
     * @return {Promise<string|object>}
     * @private
     */
    async _handleResponse(response) {
        if (response.headers.get("Content-Type") === "application/json") {
            return response.json();
        } else {
            return response.text();
        }
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
}

export const portalApi = new PortalApi();
