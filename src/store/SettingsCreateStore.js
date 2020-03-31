import { createContext } from "react";

import { ROUTE_SETTINGS_CREATE } from "../helper/const";

import { routeStore } from "./RouteStore";
import { action, observable } from "mobx";

/**
 * The store managing the creation of new settings for the users.
 */
class SettingsCreateStore {
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
     * Initializes the store.
     * @param {RouteStore} routeStore
     */
    constructor(routeStore) {
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

    /**
     * Parsed the content as mod-list.json file and extractes the enabled mod names.
     * @param {string|ArrayBuffer} content
     * @return {array<string>}
     * @private
     */
    _parseModListJson(content) {
        if (typeof content !== "string") {
            throw "invalid-file";
        }

        let data;
        try {
            data = JSON.parse(content);
        } catch (err) {
            throw "invalid-file";
        }

        if (typeof data !== "object" || !Array.isArray(data.mods)) {
            throw "invalid-file";
        }

        const modNames = [];
        for (const mod of data.mods) {
            if (mod.enabled === true && typeof mod.name === "string" && mod.name !== "") {
                modNames.push(mod.name);
            }
        }
        return modNames;
    }

    /**
     * Uploads the file, parsing it as JSON.
     * @param {File} file
     */
    uploadFile(file) {
        const fileReader = new FileReader();
        fileReader.addEventListener("load", (event) => {
            try {
                const modNames = this._parseModListJson(event.target.result);
                console.log(modNames);
            } catch (err) {
                console.log("ERROR", err);
            }
        });
        fileReader.readAsText(file);
    }
}

export const settingsCreateStore = new SettingsCreateStore(routeStore);
export default createContext(settingsCreateStore);
