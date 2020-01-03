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
        return this.sendSimpleRequest("/search", {
            query: query,
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
        return this.sendPostRequest("/style/icons", namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @param {string} type
     * @param {string} name
     * @param {number} page
     * @returns {Promise<ItemRecipesData>}
     */
    async getItemIngredientRecipes(type, name, page) {
        return this.sendSimpleRequest("/" + encodeURI(type) + "/" + encodeURI(name) + "/ingredients", {
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
        return this.sendSimpleRequest("/" + encodeURI(type) + "/" + encodeURI(name) + "/products", {
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
        return this.sendSimpleRequest("/recipe/" + encodeURI(name), {});
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @param {string} name
     * @param {number} page
     * @returns {Promise<RecipeMachinesData>}
     */
    async getRecipeMachines(name, page) {
        return this.sendSimpleRequest("/recipe/" + encodeURI(name) + "/machines", {
            indexOfFirstResult: (page - 1) * 12,
            numberOfResults: 12,
        });
    }

    /**
     * Sends a simple request to the Portal API server.
     * @param {string} route
     * @param {object} params
     * @returns {Promise<any>}
     */
    async sendSimpleRequest(route, params) {
        const queryParams = Object.keys(params)
            .map((name) => {
                return encodeURIComponent(name) + "=" + encodeURIComponent(params[name]);
            })
            .join("&");
        const url = portalApiUrl + route + "?" + queryParams;

        const response = await fetch(url);
        return response.json();
    }

    async sendPostRequest(route, requestBody) {
        const url = portalApiUrl + route;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        return response.json();
    }
}

export const portalApi = new PortalApi();
export default PortalApi;
