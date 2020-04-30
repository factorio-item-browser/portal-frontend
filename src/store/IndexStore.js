import { action, observable, runInAction } from "mobx";
import { createContext } from "react";

import { portalApi } from "../class/PortalApi";
import { ROUTE_INDEX } from "../helper/const";

import { routeStore } from "./RouteStore";

/**
 * The store of the index page.
 */
class IndexStore {
    /**
     * The Portal API instance.
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
     * The random items.
     * @type {EntityData[]}
     */
    @observable
    randomItems = [];

    /**
     * Whether we are currently randomizing the icons.
     * @type {boolean}
     */
    @observable
    isRandomizing = false;

    /**
     * Initializes the index store.
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     */
    constructor(portalApi, routeStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addRoute(ROUTE_INDEX, "/", this._handleRouteChange.bind(this));
    }

    /**
     * Handles the route change to the index page.
     * @return {Promise<void>}
     * @private
     */
    async _handleRouteChange() {
        if (this.randomItems.length === 0) {
            await this.randomizeItems();
        }
    }

    /**
     * Randomizes the items on the index page.
     * @return {Promise<void>}
     */
    @action
    async randomizeItems() {
        if (this.isRandomizing) {
            return;
        }

        this.isRandomizing = true;
        try {
            const randomItems = await this._portalApi.getRandom();
            runInAction(() => {
                this.isRandomizing = false;
                this.randomItems = randomItems;
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const indexStore = new IndexStore(portalApi, routeStore);
export default createContext(indexStore);
