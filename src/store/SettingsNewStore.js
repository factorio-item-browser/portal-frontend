import { createContext } from "react";
import { action, computed, observable, runInAction } from "mobx";

import {
    UPLOAD_ERROR_INVALID_FILE,
    UPLOAD_ERROR_NO_MODS,
    RECIPE_MODE_HYBRID,
    ROUTE_SETTINGS_NEW,
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../helper/const";

import { routeStore } from "./RouteStore";
import { portalApi } from "../class/PortalApi";

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
     * Whether the current browser supports dropping files into it.
     * @type {boolean}
     */
    @observable
    isDropSupported = false;

    /**
     * The list of mods which have been requested with the upload.
     * @type {array<string>}
     */
    @observable
    uploadedModNames = [];

    /**
     * The error which occurred while uploading the file.
     * @type {string}
     */
    @observable
    uploadError = "";

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
        this._detectDropSupport();
    }

    /**
     * Handles the change of the route.
     * @returns {Promise<void>}
     * @private
     */
    @action
    async _handleRouteChange() {
        this.uploadedModNames = [];
        this.uploadError = "";
        this.settingStatus = null;
    }

    /**
     * Detects whether dropping files is supported by the current browser.
     * @private
     */
    @action
    _detectDropSupport() {
        const element = document.createElement("div");
        this.isDropSupported = "ondragstart" in element && "ondrop" in element;
    }

    /**
     * Returns whether the availability step is currently visible.
     * @return {boolean}
     */
    @computed
    get showAvailabilityStep() {
        return !!this.settingStatus;
    }

    /**
     * Returns whether the options step is currently visible.
     * @return {boolean}
     */
    @computed
    get showOptionsStep() {
        return this.settingStatus && VALID_SETTING_STATUS.indexOf(this.settingStatus.status) !== -1;
    }

    /**
     * Returns whether the save button is currently visible.
     * @return {boolean}
     */
    @computed
    get showSaveButton() {
        return this.showOptionsStep;
    }

    /**
     * Parsed the content as mod-list.json file and extracts the enabled mod names.
     * @param {string|ArrayBuffer} content
     * @return {array<string>}
     * @private
     */
    _parseModListJson(content) {
        if (typeof content !== "string") {
            throw UPLOAD_ERROR_INVALID_FILE;
        }

        let data;
        try {
            data = JSON.parse(content);
        } catch (err) {
            throw UPLOAD_ERROR_INVALID_FILE;
        }

        if (typeof data !== "object" || !Array.isArray(data.mods)) {
            throw UPLOAD_ERROR_INVALID_FILE;
        }

        const modNames = [];
        for (const mod of data.mods) {
            if (mod.enabled === true && typeof mod.name === "string" && mod.name !== "") {
                modNames.push(mod.name);
            }
        }
        if (modNames.length === 0) {
            throw UPLOAD_ERROR_NO_MODS;
        }

        modNames.sort((left, right) => left.localeCompare(right));
        return modNames;
    }

    /**
     * Uploads the file, parsing it as JSON.
     * @param {File} file
     */
    @action
    uploadFile(file) {
        this.uploadedModNames = [];
        this.uploadError = "";
        this.settingStatus = null;

        const fileReader = new FileReader();
        fileReader.addEventListener("load", this._handleFileReaderLoad.bind(this));
        fileReader.readAsText(file);
    }

    /**
     * Handles the load event of the file reader.
     * @param {ProgressEvent} event
     * @return {Promise<void>}
     * @private
     */
    @action
    async _handleFileReaderLoad(event) {
        try {
            const modNames = this._parseModListJson(event.target.result);
            this.uploadedModNames = modNames;
            this.uploadError = "";

            await this._requestSettingStatus(modNames);
        } catch (err) {
            this.uploadedModNames = [];
            this.uploadError = err;
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
                modNames: this.uploadedModNames,
            };
            await this._portalApi.createSetting(settingData);
            this._routeStore.redirectToIndex();
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsNewStore = new SettingsNewStore(portalApi, routeStore);
export default createContext(settingsNewStore);
