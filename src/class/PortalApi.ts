import {
    NUMBER_OF_ITEM_RECIPES_PER_PAGE,
    NUMBER_OF_ITEMS_PER_PAGE,
    NUMBER_OF_MACHINES_PER_PAGE,
    NUMBER_OF_RANDOM_ITEMS,
    NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    PORTAL_API_URL,
} from "../const/config";
import {
    EntityData,
    IconsStyleData,
    InitData,
    ItemListData,
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
import { storageManager, StorageManager } from "./StorageManager";

type Parameters = { [key: string]: any } | [];

/**
 * The class functioning as interface to the Portal API server.
 */
export class PortalApi {
    private readonly storageManager: StorageManager;

    constructor(storageManager: StorageManager) {
        this.storageManager = storageManager;
    }

    /**
     * Initializes the current session.
     * @throws {PortalApiError}
     */
    public async initializeSession(): Promise<InitData> {
        return await this.executeRequest("POST", "/init");
    }

    /**
     * Executes a search with the specified query.
     * @throws {PortalApiError}
     */
    public async search(query: string, page: number): Promise<SearchResultsData> {
        return await this.executeRequestWithCache("search", `${query}-${page}`, "GET", "/search", {
            query: query,
            indexOfFirstResult: (page - 1) * NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
            numberOfResults: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     * @throws {PortalApiError}
     */
    public async getIconsStyle(namesByTypes: NamesByTypes): Promise<IconsStyleData> {
        return await this.executeRequest("POST", "/style/icons", namesByTypes);
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     * @throws {PortalApiError}
     */
    public async getItemIngredientRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
        return await this.executeRequestWithCache(
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
    public async getItemProductRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
        return await this.executeRequestWithCache(
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
     * Fetches the list of all items.
     * @throws {PortalApiError}
     */
    public async getItemList(page: number): Promise<ItemListData> {
        return await this.executeRequest("GET", "/items", {
            indexOfFirstResult: (page - 1) * NUMBER_OF_ITEMS_PER_PAGE,
            numberOfResults: NUMBER_OF_ITEMS_PER_PAGE,
        });
    }

    /**
     * Fetches random items from the server.
     * @throws {PortalApiError}
     */
    public async getRandom(): Promise<EntityData[]> {
        return await this.executeRequest("GET", "/random", { numberOfResults: NUMBER_OF_RANDOM_ITEMS });
    }

    /**
     * Fetches the recipe details with the specified name.
     * @throws {PortalApiError}
     */
    public async getRecipeDetails(name: string): Promise<RecipeDetailsData> {
        return await this.executeRequestWithCache("recipe", name, "GET", `/recipe/${encodeURI(name)}`);
    }

    /**
     * Fetches the machines able to craft the recipe.
     * @throws {PortalApiError}
     */
    public async getRecipeMachines(name: string, page: number): Promise<RecipeMachinesData> {
        return await this.executeRequestWithCache(
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
    public async getSettings(): Promise<SettingsListData> {
        return await this.executeRequest("GET", "/settings");
    }

    /**
     * Fetches the details to a specific setting.
     * @throws {PortalApiError}
     */
    public async getSetting(combinationId: string): Promise<SettingDetailsData> {
        return await this.executeRequest("GET", `/settings/${encodeURI(combinationId)}`);
    }

    /**
     * Fetches the status of the specified combination of mods, or the current setting.
     * @throws {PortalApiError}
     */
    public async getSettingStatus(modNames?: string[]): Promise<SettingStatusData> {
        if (Array.isArray(modNames)) {
            return await this.executeRequest("POST", "/settings/status", modNames);
        }
        return await this.executeRequest("GET", "/settings/status");
    }

    /**
     * Save the setting with the options.
     * @throws {PortalApiError}
     */
    public async saveSetting(combinationId: string, options: SettingOptionsData): Promise<void> {
        await this.executeRequest("PUT", `/settings/${encodeURI(combinationId)}`, options);
    }

    /**
     * Creates a new setting with the specified data.
     * @throws {PortalApiError}
     */
    public async createSetting(settingData: SettingCreateData): Promise<void> {
        await this.executeRequest("PUT", "/settings", settingData);
    }

    /**
     * Deletes the setting with the specified combination.
     * @throws {PortalApiError}
     */
    public async deleteSetting(combinationId: string): Promise<void> {
        await this.executeRequest("DELETE", `/settings/${encodeURI(combinationId)}`);
    }

    /**
     * Fetches the tooltip data for the specified type and name.
     * @throws {PortalApiError}
     */
    public async getTooltip(type: string, name: string): Promise<EntityData> {
        return await this.executeRequestWithCache(
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
    public async sendSidebarEntities(sidebarEntities: SidebarEntityData[]): Promise<void> {
        await this.executeRequest("PUT", "/sidebar/entities", sidebarEntities);
    }

    private async executeRequestWithCache<T>(
        namespace: string,
        cacheKey: string,
        method: string,
        route: string,
        parameters?: Parameters
    ): Promise<T> {
        const cachedData = this.storageManager.readFromCache<T>(namespace, cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this.executeRequest<T>(method, route, parameters);
        this.storageManager.writeToCache<T>(namespace, cacheKey, requestedData);
        return requestedData;
    }

    private async executeRequest<T>(method: string, route: string, parameters?: Parameters): Promise<T> {
        const requestUrl = this.buildRequestUrl(route, method === "GET" ? parameters : undefined);
        const requestOptions = this.buildRequestOptions(method, method !== "GET" ? parameters : undefined);

        let response;
        try {
            response = await fetch(requestUrl, requestOptions);
        } catch (e) {
            throw new PortalApiError(503, `Connection to server failed: ${e}`);
        }

        return this.handleResponse(response);
    }

    private buildRequestUrl(route: string, queryParams?: Parameters): string {
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

    private buildRequestOptions(method: string, requestData?: Parameters): RequestInit {
        const headers: { [key: string]: string } = {};
        const options: RequestInit = {
            method,
            credentials: "include",
            headers,
        };

        if (typeof requestData === "object") {
            options.body = JSON.stringify(requestData);
            headers["Content-Type"] = "application/json";
        }

        if (this.storageManager.combinationId) {
            headers["Combination-Id"] = this.storageManager.combinationId.toFull();
        }

        return options;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        let content: any = null;
        try {
            if (response.headers.get("Content-Type") === "application/json") {
                content = await response.json();
            }
        } catch (e) {
            throw new PortalApiError(500, `Failed to parse response: ${e}`);
        }

        if (!response.ok) {
            this.handleFailedResponse(response.status, content);
        }

        return content;
    }

    private handleFailedResponse(statusCode: number, content: any): never {
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

    public constructor(statusCode: number, message: string) {
        super(message);
        this.code = statusCode;
    }
}

export const portalApi = new PortalApi(storageManager);
