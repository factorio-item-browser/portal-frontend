// @flow

import {
    NUMBER_OF_MACHINES_PER_PAGE,
    NUMBER_OF_ITEM_RECIPES_PER_PAGE,
    NUMBER_OF_RANDOM_ITEMS,
    NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    PORTAL_API_URL,
} from "../helper/const";
import { storageManager, StorageManager } from "./StorageManager";
import type {
    EntityData,
    IconsStyleData,
    ItemRecipesData,
    ItemType,
    NamesByTypes,
    RecipeDetailsData,
    RecipeMachinesData,
    SearchResultsData,
    SettingCreateData,
    SettingDetailsData,
    SettingOptionsData,
    SettingsListData,
    SettingStatusData,
    SidebarEntityData,
} from "../type/transfer";

type Parameters = { ... } | any[];

/**
 * The class functioning as interface to the Portal API server.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
export class PortalApi {
    /** @private */
    _storageManager: StorageManager;

    constructor(storageManager: StorageManager) {
        this._storageManager = storageManager;
    }

    /**
     * Initializes the current session.
     * @throws {PortalApiError}
     */
    async initializeSession(): Promise<void> {
        return await this._executeRequest("POST", "/init");
    }

    /**
     * Executes a search with the specified query.
     * @throws {PortalApiError}
     */
    async search(query: string, page: number): Promise<SearchResultsData> {
        return await this._executeRequestWithCache("search", `${query}-${page}`, "GET", "/search", {
            query: query,
            indexOfFirstResult: (page - 1) * NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
            numberOfResults: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     * @throws {PortalApiError}
     */
    async getIconsStyle(namesByTypes: NamesByTypes): Promise<IconsStyleData> {
        return await this._executeRequest("POST", "/style/icons", namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @throws {PortalApiError}
     */
    async getItemIngredientRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
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
     * @throws {PortalApiError}
     */
    async getItemProductRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
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
     * @throws {PortalApiError}
     */
    async getRandom(): Promise<EntityData[]> {
        return await this._executeRequest("GET", "/random", { numberOfResults: NUMBER_OF_RANDOM_ITEMS });
    }

    /**
     * Fetches the recipe details with the specified name.
     * @throws {PortalApiError}
     */
    async getRecipeDetails(name: string): Promise<RecipeDetailsData> {
        return await this._executeRequestWithCache("recipe", name, "GET", `/recipe/${encodeURI(name)}`);
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @throws {PortalApiError}
     */
    async getRecipeMachines(name: string, page: number): Promise<RecipeMachinesData> {
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
     * @throws {PortalApiError}
     */
    async getSettings(): Promise<SettingsListData> {
        return await this._executeRequest("GET", "/settings");
    }

    /**
     * Fetches the details to a specific setting.
     * @throws {PortalApiError}
     */
    async getSetting(combinationId: string): Promise<SettingDetailsData> {
        return await this._executeRequest("GET", `/settings/${encodeURI(combinationId)}`);
    }

    /**
     * Fetches the status of the specified combination of mods, or the current setting.
     * @throws {PortalApiError}
     */
    async getSettingStatus(modNames?: string[]): Promise<SettingStatusData> {
        if (Array.isArray(modNames)) {
            return await this._executeRequest("POST", "/settings/status", modNames);
        }
        return await this._executeRequest("GET", "/settings/status");
    }

    /**
     * Save the setting with the options.
     * @throws {PortalApiError}
     */
    async saveSetting(combinationId: string, options: SettingOptionsData): Promise<void> {
        await this._executeRequest("PUT", `/settings/${encodeURI(combinationId)}`, options);
    }

    /**
     * Creates a new setting with the specified data.
     * @throws {PortalApiError}
     */
    async createSetting(settingData: SettingCreateData): Promise<void> {
        await this._executeRequest("PUT", "/settings", settingData);
    }

    /**
     * Deletes the setting with the specified combination.
     * @throws {PortalApiError}
     */
    async deleteSetting(combinationId: string): Promise<void> {
        await this._executeRequest("DELETE", `/settings/${encodeURI(combinationId)}`);
    }

    /**
     * Fetches the tooltip data for the specified type and name.
     * @throws {PortalApiError}
     */
    async getTooltip(type: string, name: string): Promise<EntityData> {
        return await this._executeRequestWithCache(
            "tooltip",
            `${type}-${name}`,
            "GET",
            `/tooltip/${encodeURI(type)}/${encodeURI(name)}`
        );
    }

    /**
     * Sends the sidebar entities to the Portal API for persisting.
     * @throws {PortalApiError}
     */
    async sendSidebarEntities(sidebarEntities: SidebarEntityData[]): Promise<void> {
        await this._executeRequest("PUT", "/sidebar/entities", sidebarEntities);
    }

    /**
     * @throws {PortalApiError}
     * @private
     */
    async _executeRequestWithCache<T>(
        namespace: string,
        cacheKey: string,
        method: string,
        route: string,
        parameters?: Parameters
    ): Promise<T> {
        const cachedData = this._storageManager.readFromCache<T>(namespace, cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._executeRequest(method, route, parameters);
        this._storageManager.writeToCache<T>(namespace, cacheKey, requestedData);
        return requestedData;
    }

    /**
     * @throws {PortalApiError}
     * @private
     */
    async _executeRequest<T>(method: string, route: string, parameters?: Parameters): Promise<T> {
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
     * @private
     */
    _buildRequestUrl(route: string, queryParams?: Parameters): string {
        let requestUrl = PORTAL_API_URL + route;

        const encodedParams: string[] = [];
        if (queryParams && !(queryParams instanceof Array)) {
            for (const name of Object.keys(queryParams)) {
                encodedParams.push(`${encodeURIComponent(name)}=${encodeURIComponent(queryParams[name])}`);
            }
        }

        if (encodedParams.length > 0) {
            requestUrl += "?" + encodedParams.join("&");
        }

        return requestUrl;
    }

    /**
     * @private
     */
    _buildRequestOptions(method: string, requestData?: Parameters): RequestOptions {
        const headers: { [string]: string } = {};
        const options: RequestOptions = {
            method,
            credentials: "include",
            headers,
        };

        if (typeof requestData === "object") {
            options.body = JSON.stringify(requestData);
            headers["Content-Type"] = "application/json";
        }

        if (this._storageManager.combinationId) {
            headers["Combination-Id"] = this._storageManager.combinationId.toFull();
        }

        return options;
    }

    /**
     * @throws {PortalApiError}
     * @private
     */
    async _handleResponse<T>(response: Response): Promise<T> {
        let content: any = null;
        try {
            if (response.headers.get("Content-Type") === "application/json") {
                content = await response.json();
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
     * @throws {PortalApiError}
     * @private
     */
    _handleFailedResponse(statusCode: number, content: any): void {
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

export class PortalApiError extends Error {
    code: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.code = statusCode;
    }
}

export const portalApi = new PortalApi(storageManager);
