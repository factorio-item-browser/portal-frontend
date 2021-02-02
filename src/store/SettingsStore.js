// @flow

import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import CombinationId from "../class/CombinationId";
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

/**
 * The store managing the settings and the settings page.
 */
export class SettingsStore {
    /** @private */
    _iconManager: IconManager;
    /** @private */
    _portalApi: PortalApi;
    /** @private */
    _router: Router;
    /** @private */
    _routeStore: RouteStore;
    /** @private */
    _storageManager: StorageManager;

    /**
     * The id of the currently active setting.
     * @private
     */
    _currentSettingId: string;

    /**
     * All the setting details which have been requested up to now.
     * @private
     */
    _allSettingDetails: Map<string, SettingDetailsData> = new Map();

    /**
     * The list of available settings.
     */
    availableSettings: SettingMetaData[] = [];

    /**
     * The currently selected setting id.
     */
    selectedSettingId: string = "";

    selectedOptions: SettingOptionsData = {
        name: "",
        locale: "en",
        recipeMode: RECIPE_MODE_HYBRID,
    };
    isLoadingSettingDetails: boolean = false;
    isChangingToSetting: boolean = false;
    isSavingChanges: boolean = false;
    isDeletingSetting: boolean = false;

    constructor(
        iconManager: IconManager,
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
        storageManager: StorageManager
    ) {
        this._iconManager = iconManager;
        this._portalApi = portalApi;
        this._router = router;
        this._routeStore = routeStore;
        this._storageManager = storageManager;

        makeObservable(this, {
            _applySelectedSetting: action,
            _handleRouteChange: action,
            availableSettings: observable,
            changeSelectedOptions: action,
            changeSettingId: action,
            changeToSelectedSetting: action,
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

        router.addRoute(ROUTE_SETTINGS, "/settings", this._handleRouteChange.bind(this));
    }

    /** @private */
    async _handleRouteChange(): Promise<void> {
        if (!this._currentSettingId) {
            try {
                const settingsListData = await this._portalApi.getSettings();
                runInAction((): void => {
                    this.availableSettings = settingsListData.settings.sort((left, right) => {
                        return left.name.localeCompare(right.name);
                    });
                    this._currentSettingId = settingsListData.currentSetting.combinationId;
                    this._addSettingDetails(settingsListData.currentSetting);
                });
            } catch (e) {
                this._routeStore.handlePortalApiError(e);
            }
        }

        runInAction((): void => {
            this.selectedSettingId = this._currentSettingId;
            this._applySelectedSetting();
        });
    }

    /** @private */
    _addSettingDetails(settingDetails: SettingDetailsData): void {
        this._allSettingDetails.set(settingDetails.combinationId, settingDetails);
    }

    /** @private */
    _applySelectedSetting() {
        const selectedSetting = this.selectedSettingDetails;

        this.selectedOptions.name = selectedSetting.isTemporary ? "" : selectedSetting.name;
        this.selectedOptions.locale = selectedSetting.locale;
        this.selectedOptions.recipeMode = selectedSetting.recipeMode;

        this._iconManager.addAdditionalStyle("mod-icons", selectedSetting.modIconsStyle);
    }

    /**
     * Returns the details of the currently selected setting.
     */
    get selectedSettingDetails(): SettingDetailsData {
        const details = this._allSettingDetails.get(this.selectedSettingId);
        if (details) {
            return details;
        }

        return emptySettingDetails;
    }

    get isChangeButtonVisible(): boolean {
        return this.selectedSettingDetails.combinationId !== this._currentSettingId;
    }

    get isDeleteButtonVisible(): boolean {
        return this._currentSettingId !== this.selectedSettingDetails.combinationId;
    }

    get isSaveButtonVisible(): boolean {
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
    async changeSettingId(combinationId: string): Promise<void> {
        if (!this._allSettingDetails.has(combinationId)) {
            this.isLoadingSettingDetails = true;
            try {
                const settingDetails = await this._portalApi.getSetting(combinationId);
                this._addSettingDetails(settingDetails);
            } catch (e) {
                this._routeStore.handlePortalApiError(e);
            }
        }

        runInAction((): void => {
            this.isLoadingSettingDetails = false;
            this.selectedSettingId = combinationId;
            this._applySelectedSetting();
        });
    }

    changeSelectedOptions(options: $Shape<SettingOptionsData>) {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
    }

    changeToSelectedSetting(): void {
        this.isChangingToSetting = true;

        this._storageManager.clearCombination(CombinationId.fromFull(this.selectedSettingId));
        this._router.redirectToIndex(CombinationId.fromFull(this.selectedSettingId));
    }

    async saveOptions(): Promise<void> {
        this.isSavingChanges = true;
        try {
            const combinationId = CombinationId.fromFull(this.selectedSettingId);

            this._storageManager.clearCombination(combinationId);
            await this._portalApi.saveSetting(this.selectedSettingId, this.selectedOptions);
            this._router.redirectToIndex(combinationId);
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    async deleteSelectedSetting(): Promise<void> {
        this.isDeletingSetting = true;
        try {
            this._storageManager.clearCombination(CombinationId.fromFull(this.selectedSettingId));
            await this._portalApi.deleteSetting(this.selectedSettingId);

            runInAction(() => {
                this.isDeletingSetting = false;
                this.availableSettings = this.availableSettings.filter(
                    (setting) => setting.combinationId !== this.selectedSettingId
                );
                this._allSettingDetails.delete(this.selectedSettingId);

                this.selectedSettingId = this._currentSettingId;
                this._applySelectedSetting();
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsStore: SettingsStore = new SettingsStore(
    iconManager,
    portalApi,
    router,
    routeStore,
    storageManager
);
export const settingsStoreContext: React$Context<SettingsStore> = createContext<SettingsStore>(settingsStore);
