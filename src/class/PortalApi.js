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

    requestRecipeDetails(name) {
        const data = {
            name: name,
            label: "Some fancy shit",
            description: "Lorem ipsum dolor sit amet.",
            recipe: {
                craftingTime: 0.5,
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        label: "Eisenplatte",
                        amount: 9,
                    },
                    {
                        type: "item",
                        name: "iron-gear-wheel",
                        label: "Eisenzahnrad",
                        amount: 5,
                    },
                    {
                        type: "item",
                        name: "electronic-circuit",
                        label: "Elektronischer Schaltkreis",
                        amount: 3,
                    },
                    {
                        type: "item",
                        name: "assembling-machine-1",
                        label: "Montagemaschine 1",
                        amount: 1,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "assembling-machine-2",
                        label: "Montagemaschine 2",
                        amount: 1,
                    },
                ],
                isExpensive: false,
            },
            expensiveRecipe: {
                craftingTime: 0.5,
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        label: "Eisenplatte",
                        amount: 20,
                    },
                    {
                        type: "item",
                        name: "iron-gear-wheel",
                        label: "Eisenzahnrad",
                        amount: 10,
                    },
                    {
                        type: "item",
                        name: "electronic-circuit",
                        label: "Elektronischer Schaltkreis",
                        amount: 5,
                    },
                    {
                        type: "item",
                        name: "assembling-machine-1",
                        label: "Montagemaschine 1",
                        amount: 1,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "assembling-machine-2",
                        label: "Montagemaschine 2",
                        amount: 1,
                    },
                ],
                isExpensive: true,
            },
            machines: [
                {
                    name: "character",
                    label: "Character",
                    craftingSpeed: 1,
                },
                {
                    name: "assembling-machine-1",
                    label: "Assembling Machine 1",
                    craftingSpeed: 0.5,
                },
                {
                    name: "test machine",
                    label: "Test Machine",
                    craftingSpeed: 1,
                },
            ],
        };

        return new window.Promise((resolve) => {
            window.setTimeout(() => {
                resolve(data);
            }, 1000);
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
