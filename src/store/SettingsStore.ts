import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { CombinationId } from "../class/CombinationId";
import { IconManager, iconManager } from "../class/IconManager";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { storageManager, StorageManager } from "../class/StorageManager";
import { RECIPE_MODE_HYBRID } from "../const/recipeMode";
import { ROUTE_SETTINGS } from "../const/route";
import type { SettingDetailsData, SettingMetaData, SettingOptionsData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

const emptySettingDetails: SettingDetailsData = {
    combinationId: "",
    name: "",
    status: "",
    isTemporary: true,
    locale: "",
    recipeMode: "",
    mods: [],
    modIconsStyle: {
        processedEntities: {},
        style: "",
    },
};

export class SettingsStore {
    private currentSettingId: string = "";
    private allSettingDetails = new Map<string, SettingDetailsData>();

    public availableSettings: SettingMetaData[] = [];
    public selectedSettingId: string = "";
    public selectedOptions: SettingOptionsData = {
        name: "",
        locale: "en",
        recipeMode: RECIPE_MODE_HYBRID,
    };
    public isLoadingSettingDetails: boolean = false;
    public isChangingToSetting: boolean = false;
    public isSavingChanges: boolean = false;
    public isDeletingSetting: boolean = false;

    constructor(
        private readonly iconManager: IconManager,
        private readonly portalApi: PortalApi,
        private readonly router: Router,
        private readonly routeStore: RouteStore,
        private readonly storageManager: StorageManager
    ) {
        makeObservable<this, "applySelectedSetting" | "handleRouteChange">(this, {
            applySelectedSetting: action,
            availableSettings: observable,
            changeSelectedOptions: action,
            changeSettingId: action,
            changeToSelectedSetting: action,
            handleRouteChange: action,
            isChangeButtonVisible: computed,
            isChangingToSetting: observable,
            isDeleteButtonVisible: computed,
            isDeletingSetting: observable,
            isLoadingSettingDetails: observable,
            isSaveButtonVisible: computed,
            isSavingChanges: observable,
            saveOptions: action,
            selectedOptions: observable,
            selectedSettingDetails: computed,
            selectedSettingId: observable,
        });

        this.router.addRoute(ROUTE_SETTINGS, "/settings", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (!this.currentSettingId) {
            try {
                const settingsListData = await this.portalApi.getSettings();
                runInAction((): void => {
                    this.availableSettings = settingsListData.settings.sort((left, right) => {
                        return left.name.localeCompare(right.name);
                    });
                    this.currentSettingId = settingsListData.currentSetting.combinationId;
                    this.addSettingDetails(settingsListData.currentSetting);
                });
            } catch (e) {
                this.routeStore.handlePortalApiError(e);
            }
        }

        runInAction((): void => {
            this.selectedSettingId = this.currentSettingId;
            this.applySelectedSetting();
        });
    }

    private addSettingDetails(settingDetails: SettingDetailsData): void {
        this.allSettingDetails.set(settingDetails.combinationId, settingDetails);
    }

    private applySelectedSetting() {
        const selectedSetting = this.selectedSettingDetails;

        this.selectedOptions.name = selectedSetting.isTemporary ? "" : selectedSetting.name;
        this.selectedOptions.locale = selectedSetting.locale;
        this.selectedOptions.recipeMode = selectedSetting.recipeMode;

        this.iconManager.addAdditionalStyle("mod-icons", selectedSetting.modIconsStyle);
    }

    /**
     * Returns the details of the currently selected setting.
     */
    public get selectedSettingDetails(): SettingDetailsData {
        const details = this.allSettingDetails.get(this.selectedSettingId);
        if (details) {
            return details;
        }

        return emptySettingDetails;
    }

    public get isChangeButtonVisible(): boolean {
        return this.selectedSettingDetails.combinationId !== this.currentSettingId;
    }

    public get isDeleteButtonVisible(): boolean {
        return this.currentSettingId !== this.selectedSettingDetails.combinationId;
    }

    public get isSaveButtonVisible(): boolean {
        const setting = this.selectedSettingDetails;

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
    public async changeSettingId(combinationId: string): Promise<void> {
        if (!this.allSettingDetails.has(combinationId)) {
            this.isLoadingSettingDetails = true;
            try {
                const settingDetails = await this.portalApi.getSetting(combinationId);
                this.addSettingDetails(settingDetails);
            } catch (e) {
                this.routeStore.handlePortalApiError(e);
            }
        }

        runInAction((): void => {
            this.isLoadingSettingDetails = false;
            this.selectedSettingId = combinationId;
            this.applySelectedSetting();
        });
    }

    public changeSelectedOptions(options: Partial<SettingOptionsData>) {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
    }

    public changeToSelectedSetting(): void {
        this.isChangingToSetting = true;

        this.storageManager.clearCombination(CombinationId.fromFull(this.selectedSettingId));
        this.router.redirectToIndex(CombinationId.fromFull(this.selectedSettingId));
    }

    public async saveOptions(): Promise<void> {
        this.isSavingChanges = true;
        try {
            const combinationId = CombinationId.fromFull(this.selectedSettingId);

            this.storageManager.clearCombination(combinationId);
            await this.portalApi.saveSetting(this.selectedSettingId, this.selectedOptions);
            this.router.redirectToIndex(combinationId);
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }

    public async deleteSelectedSetting(): Promise<void> {
        this.isDeletingSetting = true;
        try {
            this.storageManager.clearCombination(CombinationId.fromFull(this.selectedSettingId));
            await this.portalApi.deleteSetting(this.selectedSettingId);

            runInAction(() => {
                this.isDeletingSetting = false;
                this.availableSettings = this.availableSettings.filter(
                    (setting) => setting.combinationId !== this.selectedSettingId
                );
                this.allSettingDetails.delete(this.selectedSettingId);

                this.selectedSettingId = this.currentSettingId;
                this.applySelectedSetting();
            });
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsStore = new SettingsStore(iconManager, portalApi, router, routeStore, storageManager);
export const settingsStoreContext = createContext<SettingsStore>(settingsStore);
