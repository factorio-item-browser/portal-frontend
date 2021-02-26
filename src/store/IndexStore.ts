import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { ROUTE_INDEX } from "../const/route";
import { EntityData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

export class IndexStore {
    private readonly portalApi: PortalApi;
    private readonly routeStore: RouteStore;

    public randomItems: EntityData[] = [];
    public isRandomizing: boolean = false;

    public constructor(
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
    ) {
        this.portalApi = portalApi;
        this.routeStore = routeStore;

        makeObservable(this, {
            isRandomizing: observable,
            randomItems: observable,
            randomizeItems: action,
        });

        router.addRoute(ROUTE_INDEX, "/", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (this.randomItems.length === 0) {
            await this.randomizeItems();
        }
    }

    public async randomizeItems(): Promise<void> {
        if (this.isRandomizing) {
            return;
        }

        this.isRandomizing = true;
        try {
            const randomItems = await this.portalApi.getRandom();
            runInAction((): void => {
                this.isRandomizing = false;
                this.randomItems = randomItems;
            });
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }
}

export const indexStore = new IndexStore(portalApi, router, routeStore);
export const indexStoreContext = createContext<IndexStore>(indexStore);
