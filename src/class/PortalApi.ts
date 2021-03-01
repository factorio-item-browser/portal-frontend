import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
    NUMBER_OF_ITEM_RECIPES_PER_PAGE,
    NUMBER_OF_ITEMS_PER_PAGE,
    NUMBER_OF_MACHINES_PER_PAGE,
    NUMBER_OF_RANDOM_ITEMS,
    NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
    PORTAL_API_URL,
} from "../const/config";
import { ClientFailureError, PageNotFoundError, ServerFailureError, ServiceNotAvailableError } from "../error/page";
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

type ServerError = {
    error: {
        message: string;
    };
};

/**
 * The class functioning as interface to the Portal API server.
 */
export class PortalApi {
    private readonly client: AxiosInstance;
    private readonly storageManager: StorageManager;

    public constructor(storageManager: StorageManager) {
        this.storageManager = storageManager;

        this.client = axios.create({
            baseURL: PORTAL_API_URL,
            withCredentials: true,
        });
        this.client.interceptors.request.use(this.prepareRequest.bind(this));
        this.client.interceptors.response.use(undefined, this.prepareResponseError.bind(this));
    }

    private prepareRequest(request: AxiosRequestConfig): AxiosRequestConfig {
        if (this.storageManager.combinationId !== null) {
            request.headers["Combination-Id"] = this.storageManager.combinationId.toFull();
        }
        if (request.data) {
            request.headers["Content-Type"] = "application/json";
        }
        return request;
    }

    private prepareResponseError(error: AxiosError<ServerError | null>): Promise<never> {
        let message = error.response?.data?.error?.message;
        if (typeof message !== "string") {
            message = "Unknown error";
        }

        switch (error.response?.status) {
            case 400:
            case 401:
            case 409:
                throw new ClientFailureError(message);
            case 404:
                throw new PageNotFoundError(message);
            case 503:
                throw new ServiceNotAvailableError(message);
            case 500:
            default:
                throw new ServerFailureError(message);
        }
    }

    /**
     * Initializes the current session.
     */
    public async initializeSession(): Promise<InitData> {
        const response = await this.client.post<InitData>("/init");
        return response.data;
    }

    /**
     * Executes a search with the specified query.
     */
    public async search(query: string, page: number): Promise<SearchResultsData> {
        return this.withCache(`search-${query}-${page}`, () => {
            return this.client.get<SearchResultsData>("/search", {
                params: {
                    query: query,
                    indexOfFirstResult: (page - 1) * NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
                    numberOfResults: NUMBER_OF_SEARCH_RESULTS_PER_PAGE,
                },
            });
        });
    }

    /**
     * Fetches the style of the icons with the specified types and names.
     */
    public async getIconsStyle(namesByTypes: NamesByTypes): Promise<IconsStyleData> {
        const response = await this.client.post<IconsStyleData>("/style/icons", namesByTypes);
        return response.data;
    }

    /**
     * Fetches the recipes having the specified item as an ingredient.
     */
    public async getItemIngredientRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
        return this.withCache(`ingredient-${type}-${name}-${page}`, () => {
            return this.client.get<ItemRecipesData>(`/${encodeURI(type)}/${encodeURI(name)}/ingredients`, {
                params: {
                    indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                    numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                },
            });
        });
    }

    /**
     * Fetches the recipes having the specified item as a product.
     */
    public async getItemProductRecipes(type: ItemType, name: string, page: number): Promise<ItemRecipesData> {
        return this.withCache(`product-${type}-${name}-${page}`, () => {
            return this.client.get<ItemRecipesData>(`/${encodeURI(type)}/${encodeURI(name)}/products`, {
                params: {
                    indexOfFirstResult: (page - 1) * NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                    numberOfResults: NUMBER_OF_ITEM_RECIPES_PER_PAGE,
                },
            });
        });
    }

    /**
     * Fetches the list of all items.
     */
    public async getItemList(page: number): Promise<ItemListData> {
        const response = await this.client.get<ItemListData>("/items", {
            params: {
                indexOfFirstResult: (page - 1) * NUMBER_OF_ITEMS_PER_PAGE,
                numberOfResults: NUMBER_OF_ITEMS_PER_PAGE,
            },
        });
        return response.data;
    }

    /**
     * Fetches random items from the server.
     */
    public async getRandom(): Promise<EntityData[]> {
        const response = await this.client.get<EntityData[]>("/random", {
            params: {
                numberOfResults: NUMBER_OF_RANDOM_ITEMS,
            },
        });
        return response.data;
    }

    /**
     * Fetches the recipe details with the specified name.
     */
    public async getRecipeDetails(name: string): Promise<RecipeDetailsData> {
        return this.withCache(`recipe-${name}`, () => {
            return this.client.get<RecipeDetailsData>(`/recipe/${encodeURI(name)}`);
        });
    }

    /**
     * Fetches the machines able to craft the recipe.
     */
    public async getRecipeMachines(name: string, page: number): Promise<RecipeMachinesData> {
        return this.withCache(`machine-${name}-${page}`, () => {
            return this.client.get<RecipeMachinesData>(`/recipe/${encodeURI(name)}/machines`, {
                params: {
                    indexOfFirstResult: (page - 1) * NUMBER_OF_MACHINES_PER_PAGE,
                    numberOfResults: NUMBER_OF_MACHINES_PER_PAGE,
                },
            });
        });
    }

    /**
     * Fetches the settings available for the current user.
     */
    public async getSettings(): Promise<SettingsListData> {
        const response = await this.client.get<SettingsListData>("/settings");
        return response.data;
    }

    /**
     * Fetches the details to a specific setting.
     */
    public async getSetting(combinationId: string): Promise<SettingDetailsData> {
        const response = await this.client.get<SettingDetailsData>(`/settings/${encodeURI(combinationId)}`);
        return response.data;
    }

    /**
     * Fetches the status of the specified combination of mods, or the current setting.
     */
    public async getSettingStatus(modNames?: string[]): Promise<SettingStatusData> {
        if (Array.isArray(modNames)) {
            const response = await this.client.post<SettingStatusData>("/settings/status", modNames);
            return response.data;
        }

        const response = await this.client.get<SettingStatusData>("/settings/status");
        return response.data;
    }

    /**
     * Save the setting with the options.
     */
    public async saveSetting(combinationId: string, options: SettingOptionsData): Promise<void> {
        await this.client.put<void>(`/settings/${encodeURI(combinationId)}`, options);
    }

    /**
     * Creates a new setting with the specified data.
     */
    public async createSetting(settingData: SettingCreateData): Promise<void> {
        await this.client.put<void>("/settings", settingData);
    }

    /**
     * Deletes the setting with the specified combination.
     */
    public async deleteSetting(combinationId: string): Promise<void> {
        await this.client.delete<void>(`/settings/${encodeURI(combinationId)}`);
    }

    /**
     * Fetches the tooltip data for the specified type and name.
     */
    public async getTooltip(type: string, name: string): Promise<EntityData> {
        return this.withCache(`tooltip-${type}-${name}`, () => {
            return this.client.get<EntityData>(`/tooltip/${encodeURI(type)}/${encodeURI(name)}`);
        });
    }

    /**
     * Sends the sidebar entities to the Portal API for persisting.
     */
    public async sendSidebarEntities(sidebarEntities: SidebarEntityData[]): Promise<void> {
        await this.client.put<void>("/sidebar/entities", sidebarEntities);
    }

    private async withCache<T>(cacheKey: string, handler: () => Promise<AxiosResponse<T>>): Promise<T> {
        const data = this.storageManager.readFromCache<T>(cacheKey);
        if (data !== null) {
            return data;
        }

        const response = await handler();
        this.storageManager.writeToCache(cacheKey, response.data);
        return response.data;
    }
}

export const portalApi = new PortalApi(storageManager);
