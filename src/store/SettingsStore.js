// @flow

import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import CombinationId from "../class/CombinationId";
import { IconManager, iconManager } from "../class/IconManager";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_SETTINGS } from "../const/route";
import { RECIPE_MODE_HYBRID } from "../helper/const";
import type { SettingDetailsData, SettingMetaData, SettingOptionsData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

/**
 * The store managing the settings and the settings page.
 */
class SettingsStore {
    /**
     * @private
     */
    _iconManager: IconManager;

    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _router: Router;

    /**
     * @private
     */
    _routeStore: RouteStore;

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
    @observable
    availableSettings: SettingMetaData[] = [];

    /**
     * The currently selected setting id.
     */
    @observable
    selectedSettingId: string = "";

    @observable
    selectedOptions: SettingOptionsData = {
        name: "",
        locale: "en",
        recipeMode: RECIPE_MODE_HYBRID,
    };

    @observable
    isLoadingSettingDetails: boolean = false;

    @observable
    isSaveButtonVisible: boolean = false;

    @observable
    isSavingChanges: boolean = false;

    @observable
    isDeletingSetting: boolean = false;

    constructor(iconManager: IconManager, portalApi: PortalApi, router: Router, routeStore: RouteStore) {
        this._iconManager = iconManager;
        this._portalApi = portalApi;
        this._router = router;
        this._routeStore = routeStore;

        router.addRoute(ROUTE_SETTINGS, "/settings", this._handleRouteChange.bind(this));
    }

    /**
     * @private
     */
    @action
    async _handleRouteChange(): Promise<void> {
        this.isSaveButtonVisible = false;
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

    /**
     * @private
     */
    _addSettingDetails(settingDetails: SettingDetailsData): void {
        this._allSettingDetails.set(settingDetails.combinationId, settingDetails);
    }

    /**
     * @private
     */
    @action
    _applySelectedSetting() {
        const selectedSetting = this.selectedSettingDetails;

        this.selectedOptions.name = selectedSetting.name;
        this.selectedOptions.locale = selectedSetting.locale;
        this.selectedOptions.recipeMode = selectedSetting.recipeMode;

        this._iconManager.addAdditionalStyle("mod-icons", selectedSetting.modIconsStyle);
    }

    /**
     * Returns the details of the currently selected setting.
     */
    @computed
    get selectedSettingDetails(): SettingDetailsData {
        const details = this._allSettingDetails.get(this.selectedSettingId);
        if (details) {
            return details;
        }

        return {};
    }

    @computed
    get isDeleteButtonVisible(): boolean {
        return this._currentSettingId !== this.selectedSettingDetails.combinationId;
    }

    /**
     * Changes the id of the currently selected setting.
     */
    @action
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
            this.isSaveButtonVisible = true;
        });
    }

    @action
    changeSelectedOptions(options: $Shape<SettingOptionsData>) {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
        this.isSaveButtonVisible = true;
    }

    /**
     * Saves the options and reloads the page on success.
     */
    @action
    async saveOptions(): Promise<void> {
        this.isSavingChanges = true;
        try {
            await this._portalApi.saveSetting(this.selectedSettingId, this.selectedOptions);
            this._router.redirectToIndex(CombinationId.fromFull(this.selectedSettingId));
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    async deleteSelectedSetting(): Promise<void> {
        this.isDeletingSetting = true;
        try {
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

export const settingsStore = new SettingsStore(iconManager, portalApi, router, routeStore);
export const settingsStoreContext = createContext<SettingsStore>(settingsStore);
