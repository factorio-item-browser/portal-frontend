import { portalApiUrl } from "../helper/const";

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
        return this._executeRequest("/search", {
            query,
            indexOfFirstResult: (page - 1) * 24,
            numberOfResults: 24,
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     * @param {NamesByTypes} namesByTypes
     * @returns {Promise<IconsStyleData>}
     */
    async getIconsStyle(namesByTypes) {
        return this._executeRequest("/style/icons", {}, namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     */
    async getItemIngredientRecipes(type, name, page) {
        return this._executeRequest(`/${encodeURI(type)}/${encodeURI(name)}/ingredients`, {
            indexOfFirstResult: (page - 1) * 24,
            numberOfResults: 24,
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
        return this._executeRequest(`/${encodeURI(type)}/${encodeURI(name)}/products`, {
            indexOfFirstResult: (page - 1) * 24,
            numberOfResults: 24,
        });
    }

    /**
     * Fetches the recipe details with the specified name.
     * @param {string} name
     * @returns {Promise<RecipeDetailsData>}
     */
    async getRecipeDetails(name) {
        return this._executeRequest(`/recipe/${encodeURI(name)}`);
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @param {string} name
     * @param {number} page
     * @returns {Promise<RecipeMachinesData>}
     */
    async getRecipeMachines(name, page) {
        return this._executeRequest(`/recipe/${encodeURI(name)}/machines`, {
            indexOfFirstResult: (page - 1) * 12,
            numberOfResults: 12,
        });
    }

    /**
     * Initializes the current session.
     * @returns {Promise<SessionInitData>}
     */
    async initializeSession() {
        return this._executeRequest("/session/init");
    }

    /**
     * Sends the sidebar entities to the Portal API for persisting.
     * @param {array<SidebarEntityData>} sidebarEntities
     * @returns {Promise<void>}
     */
    async sendSidebarEntities(sidebarEntities) {
        this._executeRequest("/sidebar/entities", {}, sidebarEntities);
    }

    /**
     * Executes a request.
     * @param {string} route
     * @param {object} [queryParams]
     * @param {object} [requestData]
     * @returns {Promise<string|object>}
     * @private
     */
    async _executeRequest(route, queryParams, requestData) {
        const response = await fetch(this._buildRequestUrl(route, queryParams), this._buildRequestOptions(requestData));
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
        let result = portalApiUrl + route;
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
     * @param {object} [requestData]
     * @returns {object}
     * @private
     */
    _buildRequestOptions(requestData) {
        let options = {
            method: "GET",
            credentials: "include",
        };

        if (typeof requestData === "object") {
            options = {
                ...options,
                method: "POST",
                body: JSON.stringify(requestData),
                // headers: { // @todo Send correct header when the CORS preflight is handled correctly by the API.
                //     "Content-Type": "application/json",
                // }
            };
        }
        return options;
    }
}

export const portalApi = new PortalApi();
export default PortalApi;
