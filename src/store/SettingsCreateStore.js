import { createContext } from "react";

import {
    ERROR_INVALID_FILE,
    ERROR_NO_MODS,
    RECIPE_MODE_HYBRID,
    ROUTE_SETTINGS_CREATE, SETTING_STATUS_AVAILABLE, SETTING_STATUS_LOADING, SETTING_STATUS_PENDING,
} from "../helper/const";

import { routeStore } from "./RouteStore";
import { action, computed, observable, runInAction } from "mobx";
import { portalApi } from "../class/PortalApi";

/**
 * The store managing the creation of new settings for the users.
 */
class SettingsCreateStore {
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
     * @type {SettingStatusData|undefined}
     */
    @observable
    settingStatus;

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
     * Initializes the store.
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     */
    constructor(portalApi, routeStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_SETTINGS_CREATE, "/settings/create");
        this._detectDropSupport();
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

    @computed
    get showAvailabilityStep() {
        return !!this.settingStatus;
    }

    @computed
    get showOptionsStep() {
        return this.settingStatus &&
            ([SETTING_STATUS_AVAILABLE, SETTING_STATUS_PENDING].indexOf(this.settingStatus.status) !== -1);
    }

    /**
     * Parsed the content as mod-list.json file and extractes the enabled mod names.
     * @param {string|ArrayBuffer} content
     * @return {array<string>}
     * @private
     */
    _parseModListJson(content) {
        if (typeof content !== "string") {
            throw ERROR_INVALID_FILE;
        }

        let data;
        try {
            data = JSON.parse(content);
        } catch (err) {
            throw ERROR_INVALID_FILE;
        }

        if (typeof data !== "object" || !Array.isArray(data.mods)) {
            throw ERROR_INVALID_FILE;
        }

        const modNames = [];
        for (const mod of data.mods) {
            if (mod.enabled === true && typeof mod.name === "string" && mod.name !== "") {
                modNames.push(mod.name);
            }
        }
        if (modNames.length === 0) {
            throw ERROR_NO_MODS;
        }

        modNames.sort((left, right) => left.localeCompare(right));
        return modNames;
    }

    /**
     * Uploads the file, parsing it as JSON.
     * @param {File} file
     */
    uploadFile(file) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", async (event) => {
            try {
                const modNames = this._parseModListJson(event.target.result);
                this._requestSettingStatus(modNames);

                runInAction(() => {
                    this.uploadedModNames = modNames;
                    this.uploadError = "";
                });
            } catch (err) {
                this.uploadedModNames = [];
                this.uploadError = err;
            }
        });
        fileReader.readAsText(file);
    }

    /**
     * Requests the status of the setting consisting of the specified mod names.
     * @param {string[]} modNames
     * @return {Promise<void>}
     * @private
     */
    async _requestSettingStatus(modNames) {
        this.settingStatus = {
            status: SETTING_STATUS_LOADING,
        };

        const settingStatus = await this._portalApi.getSettingStatus(modNames);
        runInAction(() => {
            this.settingStatus = settingStatus;
        });
    }

    /**
     * Changes the specified options.
     * @param {Partial<SettingOptionsData>} options
     */
    @action
    changeOptions(options) {
        this.newOptions = {
            ...this.newOptions,
            ...options
        }
    }
}

export const settingsCreateStore = new SettingsCreateStore(portalApi, routeStore);
export default createContext(settingsCreateStore);
