// @flow

import { action, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_INDEX } from "../const/route";
import type { EntityData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

/**
 * The store of the index page.
 */
export class IndexStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _routeStore: RouteStore;

    @observable
    randomItems: EntityData[] = [];

    @observable
    isRandomizing: boolean = false;

    constructor(portalApi: PortalApi, router: Router, routeStore: RouteStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        router.addRoute(ROUTE_INDEX, "/", this._handleRouteChange.bind(this));
    }

    /**
     * @private
     */
    async _handleRouteChange(): Promise<void> {
        if (this.randomItems.length === 0) {
            await this.randomizeItems();
        }
    }

    @action
    async randomizeItems(): Promise<void> {
        if (this.isRandomizing) {
            return;
        }

        this.isRandomizing = true;
        try {
            const randomItems = await this._portalApi.getRandom();
            runInAction((): void => {
                this.isRandomizing = false;
                this.randomItems = randomItems;
            });
        } catch (e) {
            this._routeStore.handlePortalApiError(e);
        }
    }
}

export const indexStore = new IndexStore(portalApi, router, routeStore);
export const indexStoreContext = createContext<IndexStore>(indexStore);
