// @flow

import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import CombinationId from "../class/CombinationId";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import SaveGameReader from "../class/SaveGameReader";
import { RECIPE_MODE_HYBRID } from "../const/recipeMode";
import { ROUTE_SETTINGS_NEW } from "../const/route";
import {
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../const/settingStatus";
import type { SettingOptionsData, SettingStatusData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

/**
 * The status making a setting valid for adding.
 * @type {string[]}
 */
const VALID_SETTING_STATUS = [SETTING_STATUS_AVAILABLE, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN];

/**
 * The store managing the creation of new settings for the users.
 */
class SettingsNewStore {
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

    @observable
    isSaveGameProcessing: boolean = false;

    @observable
    saveGameModNames: string[] = [];

    @observable
    saveGameError: string = "";

    @observable
    settingStatus: ?SettingStatusData = null;

    @observable
    newOptions: SettingOptionsData = {
        name: "",
        recipeMode: RECIPE_MODE_HYBRID,
        locale: "en",
    };

    @observable
    isSavingNewSetting: boolean = false;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore) {
        this._portalApi = portalApi;
        this._router = router;
        this._routeStore = routeStore;

        router.addRoute(ROUTE_SETTINGS_NEW, "/settings/new", this._handleRouteChange.bind(this));
    }

    @action
    async _handleRouteChange(): Promise<void> {
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.settingStatus = null;
    }

    @computed
    get showSaveGameStep(): boolean {
        return true;
    }

    @computed
    get showDataAvailabilityStep(): boolean {
        return this.saveGameModNames.length > 0 && this.settingStatus !== null;
    }

    @computed
    get showAdditionalOptionsStep(): boolean {
        return this.showDataAvailabilityStep && VALID_SETTING_STATUS.indexOf(this.settingStatus?.status) !== -1;
    }

    @computed
    get showSaveButton(): boolean {
        return !!this.showAdditionalOptionsStep && this.newOptions.name !== "";
    }

    @computed
    get hasExistingSetting(): boolean {
        return !!this.settingStatus?.existingSetting;
    }

    @action
    async processSaveGame(file: File): Promise<void> {
        this.isSaveGameProcessing = true;
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.newOptions.name = file.name.endsWith(".zip") ? file.name.substr(0, file.name.length - 4) : file.name;

        const reader = new SaveGameReader();
        try {
            const mods = await reader.read(file);
            const modNames = mods.map((mod) => mod.name);

            await runInAction(async () => {
                this.isSaveGameProcessing = false;
                this.saveGameModNames = modNames;

                await this._requestSettingStatus(modNames);
            });
        } catch (e) {
            runInAction(() => {
                this.isSaveGameProcessing = false;
                this.saveGameError = e;
            });
        }
    }

    /**
     * @private
     */
    @action
    async _requestSettingStatus(modNames: string[]): Promise<void> {
        this.settingStatus = {
            status: SETTING_STATUS_LOADING,
        };

        try {
            const settingStatus = await this._portalApi.getSettingStatus(modNames);
            runInAction(() => {
                this.settingStatus = settingStatus;

                if (settingStatus.existingSetting) {
                    this.newOptions.name = settingStatus.existingSetting.name;
                    this.newOptions.locale = settingStatus.existingSetting.locale;
                    this.newOptions.recipeMode = settingStatus.existingSetting.recipeMode;
                }
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    @action
    changeOptions(options: $Shape<SettingOptionsData>): void {
        this.newOptions = {
            ...this.newOptions,
            ...options,
        };
    }

    /**
     * Saves the new settings, pushing them to the server and redirecting afterwards.
     */
    @action
    async saveNewSetting(): Promise<void> {
        this.isSavingNewSetting = true;
        try {
            const settingData = {
                ...this.newOptions,
                modNames: this.saveGameModNames,
            };
            await this._portalApi.createSetting(settingData);
            this._router.redirectToIndex(/* @todo need combinationId */);
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    /**
     * Saves the options and changes to the already existing setting.
     */
    @action
    async changeToSetting(): Promise<void> {
        const setting = this.settingStatus?.existingSetting;
        if (!setting) {
            return;
        }

        this.isSavingNewSetting = true;
        try {
            await this._portalApi.saveSetting(setting.combinationId, this.newOptions);
            this._router.redirectToIndex(CombinationId.fromFull(setting.combinationId));
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsNewStore = new SettingsNewStore(portalApi, router, routeStore);
export const settingsNewStoreContext = createContext<SettingsNewStore>(settingsNewStore);
