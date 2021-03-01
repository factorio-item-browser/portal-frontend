import { action, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { EntityData } from "../type/transfer";
import { RouteName } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";

export class IndexStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly router: Router;

    /** The random items to display on the index page. */
    public randomItems: EntityData[] = [];
    /** Whether we are currently loading new random items. */
    public isRandomizing = false;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.router = router;

        makeObservable(this, {
            isRandomizing: observable,
            randomItems: observable,
            randomizeItems: action,
        });

        router.addRoute(RouteName.Index, "/", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (this.randomItems.length === 0) {
            await this.randomizeItems();
        }
    }

    /**
     * Randomizes the items displayed on the index page.
     */
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
            this.errorStore.handleError(e);
        }
    }
}

export const indexStore = new IndexStore(errorStore, portalApi, router);
export const indexStoreContext = createContext(indexStore);
