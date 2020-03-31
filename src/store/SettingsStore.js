import { action, observable, runInAction } from "mobx";
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
     * The setting details currently shown on the settings page.
     * @type {SettingDetailsData}
     */
    @observable
    settingDetails;

    /**
     * The list of available settings.
     * @type {SettingMetaData[]}
     */
    @observable
    availableSettings = [];

    /**
     * The selected values of the input elements for the current setting.
     * @type {{name: string, recipeMode: string, locale: string, settingId: string}}
     */
    @observable
    selectedOptions = {
        settingId: "",
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
    async _handleRouteChange() {
        const settingsListData = await this._portalApi.getSettings();
        runInAction(() => {
            this.isSaveButtonVisible = false;
            this.availableSettings = settingsListData.settings.sort((left, right) => {
                return left.name.localeCompare(right.name);
            });
            this.selectedOptions.settingId = settingsListData.currentSetting.id;

            this._applySettingDetails(settingsListData.currentSetting);
        });
    }

    /**
     * Changes the id of the currently selected setting.
     * @param {string} settingId
     * @return {Promise<void>}
     */
    @action
    async changeSettingId(settingId) {
        this.selectedOptions.settingId = settingId;

        const settingDetails = await this._portalApi.getSetting(settingId);
        runInAction(() => {
            this.isSaveButtonVisible = true;

            this._applySettingDetails(settingDetails);
        });
    }

    /**
     * Applies the setting details to the store.
     * @param {SettingDetailsData} settingDetails
     * @private
     */
    @action
    _applySettingDetails(settingDetails) {
        this.settingDetails = settingDetails;

        this.selectedOptions.name = settingDetails.name;
        this.selectedOptions.locale = settingDetails.locale;
        this.selectedOptions.recipeMode = settingDetails.recipeMode;

        this._iconManager.addAdditionalStyle("mod-icons", settingDetails.modIconsStyle);
    }

    /**
     * Changes the setting name.
     * @param name
     */
    @action
    changeSettingName(name) {
        this.selectedOptions.name = name;
        this.isSaveButtonVisible = true;
    }

    /**
     * Changes the locale.
     * @param {string} locale
     */
    @action
    changeLocale(locale) {
        this.selectedOptions.locale = locale;
        this.isSaveButtonVisible = true;
    }

    /**
     * Changes the recipe mode.
     * @param {string} recipeMode
     */
    @action
    changeRecipeMode(recipeMode) {
        this.selectedOptions.recipeMode = recipeMode;
        this.isSaveButtonVisible = true;
    }

    /**
     * Saves the options and reloads the page on success.
     * @return {Promise<void>}
     */
    @action
    async saveOptions() {
        await this._portalApi.saveSetting(this.selectedOptions.settingId, {
            name: this.selectedOptions.name,
            locale: this.selectedOptions.locale,
            recipeMode: this.selectedOptions.recipeMode,
        });
        location.reload();
    }
}

export const settingsStore = new SettingsStore(iconManager, portalApi, routeStore);
export default createContext(settingsStore);
