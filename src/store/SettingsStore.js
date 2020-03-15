import { action, observable, runInAction } from "mobx";
import { createContext } from "react";

import { RECIPE_MODE_HYBRID, ROUTE_SETTINGS } from "../helper/const";
import { portalApi } from "../class/PortalApi";
import { routeStore } from "./RouteStore";

/**
 * The store managing the settings and the settings page.
 */
class SettingsStore {
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
     * The meta data of the currently used setting.
     * @type {SettingMetaData}
     */
    @observable
    settingMeta;

    /**
     * The setting details currently shown on the settings page.
     * @type {SettingDetailsData}
     */
    @observable
    settingDetails;

    /**
     * The locale which has been selected.
     * @type {string}
     */
    @observable
    selectedLocale = "en";

    /**
     * The recipe mode which have been selected.
     * @type {string}
     */
    @observable
    selectedRecipeMode = RECIPE_MODE_HYBRID;

    /**
     * Initializes the store.
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     */
    constructor(portalApi, routeStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_SETTINGS, "/settings", this._handleRouteChange.bind(this));
        this._routeStore.addInitializeSessionHandler(this._initializeSession.bind(this));
    }

    /**
     * Initializes the store with the session data.
     * @param {SettingMetaData} setting
     * @private
     */
    @action
    _initializeSession({ setting }) {
        this.settingMeta = setting;
    }

    /**
     * Handles the change of the route.
     * @returns {Promise<void>}
     * @private
     */
    async _handleRouteChange() {
        const settingsListData = await this._portalApi.getSettings();
        runInAction(() => {
            this.settingDetails = settingsListData.currentSetting;
            this.selectedLocale = settingsListData.currentSetting.locale;
            this.selectedRecipeMode = settingsListData.currentSetting.recipeMode;
        });
    }

    /**
     * Changes the locale.
     * @param {string} locale
     */
    @action
    changeLocale(locale) {
        this.selectedLocale = locale;
    }

    /**
     * Changes the recipe mode.
     * @param {string} recipeMode
     */
    @action
    changeRecipeMode(recipeMode) {
        this.selectedRecipeMode = recipeMode;
    }
}

export const settingsStore = new SettingsStore(portalApi, routeStore);
export default createContext(settingsStore);
