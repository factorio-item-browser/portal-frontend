import "isomorphic-fetch";
import { SettingCreateData, SettingOptionsData, SidebarEntityData } from "../type/transfer";
import { CombinationId } from "./CombinationId";
import { PortalApi } from "./PortalApi";
import { storageManager } from "./StorageManager";

describe("PortalApi", (): void => {
    describe("endpoints", (): void => {
        const responseData = { foo: "bar" };
        const combinationId = "5e782820-364f-4f63-b227-ffcb3ce1d6fc";

        beforeEach((): void => {
            const mockedResponse = new Response(JSON.stringify(responseData), {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            jest.spyOn(window, "fetch").mockReturnValue(Promise.resolve(mockedResponse.clone()));
            storageManager.combinationId = CombinationId.fromFull(combinationId);
        });

        test("initialize", async (): Promise<void> => {
            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.initializeSession();

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/init", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
            expect(result).toEqual(responseData);
        });

        test("search", async (): Promise<void> => {
            const query = "abc";
            const page = 4;

            jest.spyOn(storageManager, "readFromCache").mockReturnValue(null);
            jest.spyOn(storageManager, "writeToCache");

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.search(query, page);

            expect(storageManager.readFromCache).toHaveBeenCalledWith("search", "abc-4");
            expect(storageManager.writeToCache).toHaveBeenCalledWith("search", "abc-4", responseData);
            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/search?query=abc&indexOfFirstResult=72&numberOfResults=24",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getIconsStyle", async (): Promise<void> => {
            const namesByTypes = {
                abc: ["def", "ghi"],
            };

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getIconsStyle(namesByTypes);

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/style/icons", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Combination-Id": combinationId,
                },
                body: JSON.stringify(namesByTypes),
            });
            expect(result).toEqual(responseData);
        });

        test("getItemIngredientRecipes", async (): Promise<void> => {
            const type = "item";
            const name = "abc";
            const page = 4;

            jest.spyOn(storageManager, "readFromCache").mockReturnValue(null);
            jest.spyOn(storageManager, "writeToCache");

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getItemIngredientRecipes(type, name, page);

            expect(storageManager.readFromCache).toHaveBeenCalledWith("ingredient", "item-abc-4");
            expect(storageManager.writeToCache).toHaveBeenCalledWith("ingredient", "item-abc-4", responseData);
            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/item/abc/ingredients?indexOfFirstResult=36&numberOfResults=12",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getItemProductRecipes", async (): Promise<void> => {
            const type = "item";
            const name = "abc";
            const page = 4;

            jest.spyOn(storageManager, "readFromCache").mockReturnValue(null);
            jest.spyOn(storageManager, "writeToCache");

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getItemProductRecipes(type, name, page);

            expect(storageManager.readFromCache).toHaveBeenCalledWith("product", "item-abc-4");
            expect(storageManager.writeToCache).toHaveBeenCalledWith("product", "item-abc-4", responseData);
            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/item/abc/products?indexOfFirstResult=36&numberOfResults=12",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getItemList", async (): Promise<void> => {
            const page = 4;

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getItemList(page);

            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/items?indexOfFirstResult=3072&numberOfResults=1024",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getRandom", async (): Promise<void> => {
            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getRandom();

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/random?numberOfResults=12", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
            expect(result).toEqual(responseData);
        });

        test("getRecipeDetails", async (): Promise<void> => {
            const name = "abc";

            jest.spyOn(storageManager, "readFromCache").mockReturnValue(null);
            jest.spyOn(storageManager, "writeToCache");

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getRecipeDetails(name);

            expect(storageManager.readFromCache).toHaveBeenCalledWith("recipe", "abc");
            expect(storageManager.writeToCache).toHaveBeenCalledWith("recipe", "abc", responseData);
            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/recipe/abc", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
            expect(result).toEqual(responseData);
        });

        test("getRecipeMachines", async (): Promise<void> => {
            const name = "abc";
            const page = 4;

            jest.spyOn(storageManager, "readFromCache").mockReturnValue(null);
            jest.spyOn(storageManager, "writeToCache");

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getRecipeMachines(name, page);

            expect(storageManager.readFromCache).toHaveBeenCalledWith("machine", "abc-4");
            expect(storageManager.writeToCache).toHaveBeenCalledWith("machine", "abc-4", responseData);
            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/recipe/abc/machines?indexOfFirstResult=36&numberOfResults=12",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getSettings", async (): Promise<void> => {
            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getSettings();

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/settings", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
            expect(result).toEqual(responseData);
        });

        test("getSetting", async (): Promise<void> => {
            const settingCombinationId = "281d1fce-dd74-41c6-8dca-3717629e869a";

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getSetting(settingCombinationId);

            expect(window.fetch).toHaveBeenCalledWith(
                "portal-api-server/settings/281d1fce-dd74-41c6-8dca-3717629e869a",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Combination-Id": combinationId,
                    },
                },
            );
            expect(result).toEqual(responseData);
        });

        test("getSettingStatus", async (): Promise<void> => {
            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getSettingStatus();

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/settings/status", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
            expect(result).toEqual(responseData);
        });

        test("getSettingStatus with modNames", async (): Promise<void> => {
            const modNames = ["abc", "def"];

            const portalApi = new PortalApi(storageManager);
            const result = await portalApi.getSettingStatus(modNames);

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/settings/status", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(modNames),
            });
            expect(result).toEqual(responseData);
        });

        test("saveSetting", async (): Promise<void> => {
            const settingCombinationId = "281d1fce-dd74-41c6-8dca-3717629e869a";
            const options: SettingOptionsData = {
                name: "abc",
                locale: "def",
                recipeMode: "ghi",
            };

            const portalApi = new PortalApi(storageManager);
            await portalApi.saveSetting(settingCombinationId, options);

            expect(window.fetch).toHaveBeenCalledWith(`portal-api-server/settings/${settingCombinationId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(options),
            });
        });

        test("createSetting", async (): Promise<void> => {
            const settingData: SettingCreateData = {
                name: "abc",
                locale: "def",
                recipeMode: "ghi",
                modNames: ["jkl", "mno"],
            };

            const portalApi = new PortalApi(storageManager);
            await portalApi.createSetting(settingData);

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/settings", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settingData),
            });
        });

        test("deleteSetting", async (): Promise<void> => {
            const settingCombinationId = "281d1fce-dd74-41c6-8dca-3717629e869a";

            const portalApi = new PortalApi(storageManager);
            await portalApi.deleteSetting(settingCombinationId);

            expect(window.fetch).toHaveBeenCalledWith(`portal-api-server/settings/${settingCombinationId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                },
            });
        });

        test("sendSidebarEntities", async (): Promise<void> => {
            const sidebarEntities: SidebarEntityData[] = [
                {
                    type: "item",
                    name: "abc",
                    label: "def",
                    pinnedPosition: 42,
                    lastViewTime: "2001-02-03T04:04:06.000+07:00",
                },
                {
                    type: "recipe",
                    name: "ghi",
                    label: "jkl",
                    pinnedPosition: 0,
                    lastViewTime: "2001-02-03T04:04:06.000+07:00",
                },
            ];

            const portalApi = new PortalApi(storageManager);
            await portalApi.sendSidebarEntities(sidebarEntities);

            expect(window.fetch).toHaveBeenCalledWith("portal-api-server/sidebar/entities", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Combination-Id": combinationId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sidebarEntities),
            });
        });
    });
});
