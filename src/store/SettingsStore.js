import { createContext } from "react";
import { routeStore } from "./RouteStore";
import { ROUTE_SETTINGS } from "../helper/const";
import { observable } from "mobx";

class SettingsStore {
    /**
     * The route store.
     * @type {RouteStore}
     * @private
     */
    _routeStore;

    /**
     * Initializes the store.
     * @param {RouteStore} routeStore
     */
    constructor(routeStore) {
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_SETTINGS, "/settings");
    }

    @observable
    currentSetting = {
        name: "Vanilla",
        mods: [
            {
                name: "base",
                label: "Base mod",
                author: "Factorio team",
                version: "0.18.9",
            },
            {
                name: "boblibrary",
                label: "Bob Library Thingy",
                author: "Bob",
                version: "0.18.0",
            },
            {
                name: "FNEI",
                label: "FNEI",
                author: "fnei",
                version: "0.18.0",
            },
        ],
    };
}

export const settingsStore = new SettingsStore(routeStore);
export default createContext(settingsStore);
