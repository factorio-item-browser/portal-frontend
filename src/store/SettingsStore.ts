import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../api/PortalApi";
import { emptySettingData } from "../api/empty";
import { InitData, ModData, SettingData, SettingOptionsData } from "../api/transfer";
import { CombinationId } from "../class/CombinationId";
import { router, Router } from "../class/Router";
import { storageManager, StorageManager } from "../class/StorageManager";
import { RecipeMode, RouteName, SettingStatus } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";
import { globalStore, GlobalStore } from "./GlobalStore";

export class SettingsStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly router: Router;
    private readonly storageManager: StorageManager;

    private currentCombinationId = "";

    /** All the settings available for the current user. */
    public settings = new Map<string, SettingData>();
    /** The combination id of the currently selected setting. */
    public selectedCombinationId = "";
    /** The currently selected options. */
    public selectedOptions: SettingOptionsData = {
        name: "",
        locale: "en",
        recipeMode: RecipeMode.Hybrid,
    };
    /** The mods of the selected setting. */
    public selectedSettingMods: ModData[] = [];
    /** Whether we are currently loading the mods of the setting. */
    public isLoadingMods = false;
    /** Whether we are currently changing to a new setting. */
    public isChangingToSetting = false;
    /** Whether we are currently saving the changes. */
    public isSavingChanges = false;
    /** Whether we are currently deleting a setting. */
    public isDeletingSetting = false;

    public constructor(
        errorStore: ErrorStore,
        globalStore: GlobalStore,
        portalApi: PortalApi,
        router: Router,
        storageManager: StorageManager,
    ) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.router = router;
        this.storageManager = storageManager;

        makeObservable<this, "applySelectedSetting" | "handleInit" | "handleRouteChange">(this, {
            applySelectedSetting: action,
            changeSelectedOptions: action,
            changeCombinationId: action,
            changeToSelectedSetting: action,
            deleteSelectedSetting: action,
            handleInit: action,
            handleRouteChange: action,
            isChangeButtonVisible: computed,
            isChangingToSetting: observable,
            isDeleteButtonVisible: computed,
            isDeletingSetting: observable,
            isLoadingMods: observable,
            isSaveButtonVisible: computed,
            isSavingChanges: observable,
            saveOptions: action,
            selectedOptions: observable,
            selectedSetting: computed,
            selectedSettingMods: observable,
            selectedCombinationId: observable,
        });

        globalStore.addInitHandler(this.handleInit.bind(this));
        this.router.addRoute(RouteName.Settings, "/settings", this.handleRouteChange.bind(this));
    }

    private handleInit(initData: InitData): void {
        this.settings.set(initData.setting.combinationId, initData.setting);
        this.currentCombinationId = initData.setting.combinationId;
        if (initData.lastUsedSetting) {
            this.settings.set(initData.lastUsedSetting.combinationId, initData.lastUsedSetting);
        }
    }

    private async handleRouteChange(): Promise<void> {
        if (!this.selectedCombinationId) {
            try {
                const settings = await this.portalApi.getSettings();
                runInAction(() => {
                    for (const setting of settings) {
                        this.settings.set(setting.combinationId, setting);
                    }
                });
            } catch (e) {
                this.errorStore.handleError(e);
            }
        }

        runInAction((): void => {
            this.selectedCombinationId = this.currentCombinationId;
            this.applySelectedSetting();
        });
    }

    /**
     * The details of the currently selected setting.
     */
    public get selectedSetting(): SettingData {
        return this.settings.get(this.selectedCombinationId) || emptySettingData;
    }

    /**
     * Whether the change setting button must be visible.
     */
    public get isChangeButtonVisible(): boolean {
        return this.selectedSetting.combinationId !== this.currentCombinationId;
    }

    /**
     * Whether the delete button must be visible.
     */
    public get isDeleteButtonVisible(): boolean {
        return this.currentCombinationId !== this.selectedSetting.combinationId;
    }

    /**
     * Whether the save setting button must be visible.
     */
    public get isSaveButtonVisible(): boolean {
        const setting = this.selectedSetting;

        if (this.selectedOptions.name === "") {
            return false;
        }

        return (
            setting.isTemporary ||
            setting.name !== this.selectedOptions.name ||
            setting.locale !== this.selectedOptions.locale ||
            setting.recipeMode !== this.selectedOptions.recipeMode
        );
    }

    /**
     * Changes the id of the currently selected setting.
     */
    public async changeCombinationId(combinationId: string): Promise<void> {
        this.isLoadingMods = false;
        this.selectedCombinationId = combinationId;
        await this.applySelectedSetting();
    }

    /**
     * Changes the current selected options.
     */
    public changeSelectedOptions(options: Partial<SettingOptionsData>): void {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
    }

    /**
     * Changes to the currently selected setting.
     */
    public changeToSelectedSetting(): void {
        this.isChangingToSetting = true;

        this.storageManager.clearCombination(CombinationId.fromFull(this.selectedCombinationId));
        this.router.redirectToIndex(CombinationId.fromFull(this.selectedCombinationId));
    }

    /**
     * Saves the options to the currently selected setting.
     */
    public async saveOptions(): Promise<void> {
        this.isSavingChanges = true;
        try {
            const combinationId = CombinationId.fromFull(this.selectedCombinationId);

            this.storageManager.clearCombination(combinationId);
            await this.portalApi.saveSetting(this.selectedCombinationId, this.selectedOptions);
            this.router.redirectToIndex(combinationId);
        } catch (e) {
            this.errorStore.handleError(e);
        }
    }

    /**
     * Deletes the currently selected setting.
     */
    public async deleteSelectedSetting(): Promise<void> {
        this.isDeletingSetting = true;
        try {
            this.storageManager.clearCombination(CombinationId.fromFull(this.selectedCombinationId));
            await this.portalApi.deleteSetting(this.selectedCombinationId);

            runInAction(() => {
                this.isDeletingSetting = false;
                this.settings.delete(this.selectedCombinationId);
                this.selectedCombinationId = this.currentCombinationId;
                this.applySelectedSetting();
            });
        } catch (e) {
            this.errorStore.handleError(e);
        }
    }

    private async applySelectedSetting() {
        const selectedSetting = this.selectedSetting;

        this.selectedOptions.name = selectedSetting.isTemporary ? "" : selectedSetting.name;
        this.selectedOptions.locale = selectedSetting.locale;
        this.selectedOptions.recipeMode = selectedSetting.recipeMode;

        this.selectedSettingMods = [];
        this.isLoadingMods = false;

        if (selectedSetting.status === SettingStatus.Available) {
            this.isLoadingMods = true;
            try {
                const mods = await this.portalApi.getSettingMods(this.selectedCombinationId);
                runInAction(() => {
                    this.selectedSettingMods = mods;
                    this.isLoadingMods = false;
                });
            } catch (e) {
                this.errorStore.handleError(e);
            }
        }
    }
}

export const settingsStore = new SettingsStore(errorStore, globalStore, portalApi, router, storageManager);
export const settingsStoreContext = createContext(settingsStore);
