import { createContext } from "react";
import { action, computed, observable, runInAction } from "mobx";

import {
    RECIPE_MODE_HYBRID,
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../helper/const";
import { ROUTE_SETTINGS_NEW } from "../const/route";

import { routeStore } from "./RouteStore";
import { portalApi } from "../class/PortalApi";
import SaveGameReader from "../class/SaveGameReader";

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
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The route store.
     * @type {RouteStore}
     * @private
     */
    _routeStore;

    /**
     * Whether a savegame is currently processed.
     * @type {boolean}
     */
    @observable
    isSaveGameProcessing = false;

    /**
     * The mod names read from the save game.
     * @type {string[]}
     */
    @observable
    saveGameModNames = [];

    /**
     * The error which occurred during processing a save game.
     * @type {string}
     */
    @observable
    saveGameError = "";

    /**
     * The status of the new setting.
     * @type {?SettingStatusData}
     */
    @observable
    settingStatus = null;

    /**
     * The options to use for the new setting.
     * @type {SettingOptionsData}
     */
    @observable
    newOptions = {
        name: "",
        recipeMode: RECIPE_MODE_HYBRID,
        locale: "en",
    };

    /**
     * Whether we are currently saving the new setting.
     * @type {boolean}
     */
    @observable
    isSavingNewSetting = false;

    /**
     * Initializes the store.
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     */
    constructor(portalApi, routeStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_SETTINGS_NEW, "/settings/new", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @returns {Promise<void>}
     * @private
     */
    @action
    async _handleRouteChange() {
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.settingStatus = null;
    }

    /**
     * Returns whether the save game step is currently shown.
     * @return {boolean}
     */
    @computed
    get showSaveGameStep() {
        return true;
    }

    /**
     * Returns whether the data availability step is currently shown.
     * @return {boolean}
     */
    @computed
    get showDataAvailabilityStep() {
        return this.saveGameModNames.length > 0 && this.settingStatus !== null;
    }

    /**
     * Returns whether the options step is currently visible.
     * @return {boolean}
     */
    @computed
    get showAdditionalOptionsStep() {
        return this.showDataAvailabilityStep && VALID_SETTING_STATUS.indexOf(this.settingStatus?.status) !== -1;
    }

    /**
     * Returns whether the save button is currently visible.
     * @return {boolean}
     */
    @computed
    get showSaveButton() {
        return !!this.showAdditionalOptionsStep;
    }

    /**
     * Processes the save game.
     * @param {File} file
     */
    @action
    async processSaveGame(file) {
        this.isSaveGameProcessing = true;
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.newOptions.name = file.name.endsWith(".zip") ? file.name.substr(0, file.name.length - 4) : file.name;

        const reader = new SaveGameReader();
        try {
            const mods = await reader.read(file);
            const modNames = mods.map((mod) => mod.name);

            runInAction(async () => {
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
     * Requests the status of the setting consisting of the specified mod names.
     * @param {string[]} modNames
     * @return {Promise<void>}
     * @private
     */
    @action
    async _requestSettingStatus(modNames) {
        this.settingStatus = {
            status: SETTING_STATUS_LOADING,
        };

        try {
            const settingStatus = await this._portalApi.getSettingStatus(modNames);
            runInAction(() => {
                this.settingStatus = settingStatus;
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    /**
     * Changes the specified options.
     * @param {Partial<SettingOptionsData>} options
     */
    @action
    changeOptions(options) {
        this.newOptions = {
            ...this.newOptions,
            ...options,
        };
    }

    /**
     * Saves the new settings, pushing them to the server and redirecting afterwards.
     * @return {Promise<void>}
     */
    @action
    async saveNewSetting() {
        this.isSavingNewSetting = true;
        try {
            const settingData = {
                ...this.newOptions,
                modNames: this.saveGameModNames,
            };
            await this._portalApi.createSetting(settingData);
            this._routeStore.redirectToIndex(/* @todo need combinationId */);
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsNewStore = new SettingsNewStore(portalApi, routeStore);
export default createContext(settingsNewStore);
