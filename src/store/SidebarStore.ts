import { action, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { StorageManager, storageManager } from "../class/StorageManager";
import { ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../const/route";
import { InitData, SidebarEntityData, SidebarEntityType } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";
import { TooltipStore, tooltipStore } from "./TooltipStore";

export class SidebarStore {
    private readonly portalApi: PortalApi;
    private readonly storageManager: StorageManager;
    private readonly tooltipStore: TooltipStore;

    public entities = new Map<string, SidebarEntityData>();
    public highlightedEntityId: string = "";
    public isSidebarOpened: boolean = false;

    constructor(
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
        storageManager: StorageManager,
        tooltipStore: TooltipStore,
    ) {
        this.portalApi = portalApi;
        this.storageManager = storageManager;
        this.tooltipStore = tooltipStore;

        makeObservable<this, "assignEntities" | "handleGlobalRouteChange" | "validateEntities">(this, {
            addViewedEntity: action,
            assignEntities: action,
            closeSidebar: action,
            entities: observable,
            handleGlobalRouteChange: action,
            highlightedEntityId: observable,
            isSidebarOpened: observable,
            openSidebar: action,
            pinEntity: action,
            pinnedEntities: computed,
            unpinEntity: action,
            unpinnedEntities: computed,
            updatePinnedOrder: action,
            validateEntities: action,
        });

        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
        routeStore.addInitHandler(this.handleInit.bind(this));
        this.storageManager.sidebarEntitiesChangeHandler = this.handleSidebarEntitiesChange.bind(this);
    }

    private handleInit(data: InitData): void {
        this.assignEntities(data.sidebarEntities);

        this.storageManager.sidebarEntities = [...this.pinnedEntities, ...this.unpinnedEntities];
    }

    private handleGlobalRouteChange(state: State) {
        this.closeSidebar();
        const { type, name } = state.params;

        switch (state.name) {
            case ROUTE_RECIPE_DETAILS:
                this.highlightedEntityId = `recipe-${name}`;
                break;
            case ROUTE_ITEM_DETAILS:
                this.highlightedEntityId = `${type}-${name}`;
                break;
            default:
                this.highlightedEntityId = "";
        }
    }

    private handleSidebarEntitiesChange(entities: SidebarEntityData[]): void {
        try {
            this.assignEntities(entities);
        } catch (e) {
            // Ignore any errors.
        }
    }

    public openSidebar(): void {
        this.isSidebarOpened = true;
    }

    public closeSidebar(): void {
        this.isSidebarOpened = false;
    }

    private assignEntities(entities: SidebarEntityData[]): void {
        this.entities.clear();
        for (const entity of entities) {
            this.entities.set(this.getIdForEntity(entity), entity);
        }
        this.validateEntities();
    }

    public get pinnedEntities(): SidebarEntityData[] {
        const entities = this.filterEntities((entity) => entity.pinnedPosition > 0);
        entities.sort((left, right) => left.pinnedPosition - right.pinnedPosition);
        return entities;
    }

    public get unpinnedEntities(): SidebarEntityData[] {
        const entities = this.filterEntities((entity) => entity.pinnedPosition === 0);
        entities.sort((left, right) => right.lastViewTime.localeCompare(left.lastViewTime));
        return entities;
    }

    private filterEntities(predicate: (sidebarEntities: SidebarEntityData) => boolean): SidebarEntityData[] {
        const result = [];
        for (const entity of this.entities.values()) {
            if (predicate(entity)) {
                result.push(entity);
            }
        }
        return result;
    }

    public pinEntity(entity: SidebarEntityData): void {
        entity.pinnedPosition = this.pinnedEntities.length + 1;

        this.tooltipStore.hideTooltip();
        this.validateEntities();
        this.sendEntities();
    }

    public unpinEntity(entity: SidebarEntityData): void {
        entity.pinnedPosition = 0;

        this.tooltipStore.hideTooltip();
        this.validateEntities();
        this.sendEntities();
    }

    public addViewedEntity(type: SidebarEntityType, name: string, label: string) {
        const id = `${type}-${name}`;
        const entity = this.entities.get(id);
        if (entity) {
            entity.label = label;
            entity.lastViewTime = new Date().toISOString();
        } else {
            this.entities.set(id, {
                type: type,
                name: name,
                label: label,
                pinnedPosition: 0,
                lastViewTime: new Date().toISOString(),
            });
        }

        this.validateEntities();
        this.sendEntities();
    }

    public updatePinnedOrder(order: string[]): void {
        for (const [index, id] of order.entries()) {
            const entity = this.entities.get(id);
            if (entity) {
                entity.pinnedPosition = index + 1;
            }
        }

        this.sendEntities();
    }

    public getIdForEntity(entity: SidebarEntityData): string {
        return `${entity.type}-${entity.name}`;
    }

    private validateEntities(): void {
        // Renumber pinned entities.
        for (const [index, entity] of this.pinnedEntities.entries()) {
            entity.pinnedPosition = index + 1;
        }

        // Cut off excessive unpinned entities.
        for (const entity of this.unpinnedEntities.slice(10)) {
            this.entities.delete(this.getIdForEntity(entity));
        }
    }

    private sendEntities(): void {
        const entities = [...this.pinnedEntities, ...this.unpinnedEntities];
        this.storageManager.sidebarEntities = entities;

        (async (): Promise<void> => {
            try {
                await this.portalApi.sendSidebarEntities(entities);
            } catch (e) {
                // Ignore errors related to saving sidebar entities.
            }
        })();
    }
}

export const sidebarStore = new SidebarStore(portalApi, router, routeStore, storageManager, tooltipStore);
export const sidebarStoreContext = createContext<SidebarStore>(sidebarStore);
