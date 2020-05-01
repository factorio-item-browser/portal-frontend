import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";

import { iconManager } from "../class/IconManager";
import { portalApi } from "../class/PortalApi";
import { RECIPE_MODE_HYBRID, ROUTE_SETTINGS } from "../helper/const";
import { routeStore } from "./RouteStore";

/**
 * The store managing the settings and the settings page.
 */
class SettingsStore {
    /**
     * The icon manager.
     * @type {IconManager}
     * @private
     */
    _iconManager;

    /**
     * The Portal API.
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
     * The id of the currently active setting.
     * @type {string}
     * @private
     */
    _currentSettingId;

    /**
     * All the setting details which have been requested up to now.
     * @type {Object<string, SettingDetailsData>}
     * @private
     */
    _allSettingDetails = {};

    /**
     * The list of available settings.
     * @type {SettingMetaData[]}
     */
    @observable
    availableSettings = [];

    /**
     * The currently selected setting id.
     * @type {string}
     */
    @observable
    selectedSettingId = "";

    /**
     * The selected values of the input elements for the current setting.
     * @type {SettingOptionsData}
     */
    @observable
    selectedOptions = {
        name: "",
        locale: "en",
        recipeMode: RECIPE_MODE_HYBRID,
    };

    /**
     * Whether or not the save button is visible.
     * @type {boolean}
     */
    @observable
    isSaveButtonVisible = false;

    /**
     * Initializes the store.
     * @param {IconManager} iconManager
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     */
    constructor(iconManager, portalApi, routeStore) {
        this._iconManager = iconManager;
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_SETTINGS, "/settings", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the change of the route.
     * @returns {Promise<void>}
     * @private
     */
    @action
    async _handleRouteChange() {
        this.isSaveButtonVisible = false;
        if (!this._currentSettingId) {
            try {
                const settingsListData = await this._portalApi.getSettings();
                runInAction(() => {
                    this.availableSettings = settingsListData.settings.sort((left, right) => {
                        return left.name.localeCompare(right.name);
                    });
                    this._currentSettingId = settingsListData.currentSetting.id;
                    this._addSettingDetails(settingsListData.currentSetting);
                });
            } catch (e) {
                this._routeStore.handlePortalApiError(e);
            }
        }

        runInAction(() => {
            this.selectedSettingId = this._currentSettingId;
            this._applySelectedSetting();
        });
    }

    /**
     * Adds the setting details to the store.
     * @param {SettingDetailsData} settingDetails
     * @private
     */
    _addSettingDetails(settingDetails) {
        this._allSettingDetails[settingDetails.id] = settingDetails;
    }

    /**
     * Applies the setting details to the store.
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
     * @return {SettingDetailsData}
     */
    @computed
    get selectedSettingDetails() {
        return this._allSettingDetails[this.selectedSettingId];
    }

    /**
     * Returns whether the delete button is visible.
     * @return {boolean}
     */
    @computed
    get isDeleteButtonVisible() {
        return this._currentSettingId !== this.selectedSettingDetails.id;
    }

    /**
     * Changes the id of the currently selected setting.
     * @param {string} settingId
     * @return {Promise<void>}
     */
    @action
    async changeSettingId(settingId) {
        if (!this._allSettingDetails[settingId]) {
            try {
                const settingDetails = await this._portalApi.getSetting(settingId);
                this._addSettingDetails(settingDetails);
            } catch (e) {
                this._routeStore.handlePortalApiError(e);
            }
        }

        runInAction(() => {
            this.selectedSettingId = settingId;
            this._applySelectedSetting();
            this.isSaveButtonVisible = true;
        });
    }

    /**
     * Changes the selected options.
     * @param {Partial<SettingOptionsData>} options
     */
    @action
    changeSelectedOptions(options) {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
        this.isSaveButtonVisible = true;
    }

    /**
     * Saves the options and reloads the page on success.
     * @return {Promise<void>}
     */
    @action
    async saveOptions() {
        try {
            await this._portalApi.saveSetting(this.selectedSettingId, this.selectedOptions);
            location.reload();
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }

    /**
     * Deletes the currently selected setting.
     * @return {Promise<void>}
     */
    async deleteSelectedSetting() {
        try {
            await this._portalApi.deleteSetting(this.selectedSettingId);

            runInAction(() => {
                this.availableSettings = this.availableSettings.filter(
                    (setting) => setting.id !== this.selectedSettingId
                );
                delete this._allSettingDetails[this.selectedSettingId];

                this.selectedSettingId = this._currentSettingId;
                this._applySelectedSetting();
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsStore = new SettingsStore(iconManager, portalApi, routeStore);
export default createContext(settingsStore);
