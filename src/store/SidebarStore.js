// @flow

import { action, computed, makeObservable, observable } from "mobx";
import { createContext } from "react";
import { State } from "router5";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { StorageManager, storageManager } from "../class/StorageManager";
import { ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../const/route";
import type { InitData, SidebarEntityData, SidebarEntityType } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";
import { TooltipStore, tooltipStore } from "./TooltipStore";

/**
 * The store managing all the data of the sidebar.
 */
export class SidebarStore {
    /** @private */
    _portalApi: PortalApi;
    /** @private */
    _storageManager: StorageManager;
    /** @private */
    _tooltipStore: TooltipStore;

    /**
     * The entities of the sidebar.
     * @type {Map<string,SidebarEntityData>}
     */
    entities: Map<string, SidebarEntityData> = new Map();

    /**
     * The id of the entity which is currently highlighted.
     * @type {string}
     */
    highlightedEntityId: string = "";

    /**
     * Whether the sidebar has been opened on mobile.
     * @type {boolean}
     */
    isSidebarOpened: boolean = false;

    constructor(
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
        storageManager: StorageManager,
        tooltipStore: TooltipStore
    ) {
        this._portalApi = portalApi;
        this._storageManager = storageManager;
        this._tooltipStore = tooltipStore;

        makeObservable(this, {
            _assignEntities: action,
            _handleGlobalRouteChange: action,
            _validateEntities: action,
            addViewedEntity: action,
            closeSidebar: action,
            entities: observable,
            highlightedEntityId: observable,
            isSidebarOpened: observable,
            openSidebar: action,
            pinEntity: action,
            pinnedEntities: computed,
            unpinEntity: action,
            unpinnedEntities: computed,
            updatePinnedOrder: action,
        });

        router.addGlobalChangeHandler(this._handleGlobalRouteChange.bind(this));
        routeStore.addInitHandler(this._handleInit.bind(this));
        storageManager.sidebarEntitiesChangeHandler = this._handleSidebarEntitiesChange.bind(this);
    }

    /** @private */
    _handleInit(data: InitData): void {
        this._assignEntities(data.sidebarEntities);

        this._storageManager.sidebarEntities = [...this.pinnedEntities, ...this.unpinnedEntities];
    }

    /** @private */
    _handleGlobalRouteChange(state: State) {
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

    /**
     * Handles the change of the sidebar entities (e.g. in another tab).
     * @private
     */
    _handleSidebarEntitiesChange(entities: SidebarEntityData[]): void {
        try {
            this._assignEntities(entities);
        } catch (e) {
            // Ignore any errors.
        }
    }

    openSidebar(): void {
        this.isSidebarOpened = true;
    }

    closeSidebar(): void {
        this.isSidebarOpened = false;
    }

    /** @private */
    _assignEntities(entities: SidebarEntityData[]): void {
        this.entities.clear();
        for (const entity of entities) {
            this.entities.set(this.getIdForEntity(entity), entity);
        }
        this._validateEntities();
    }

    /**
     * The entities pinned to the sidebar.
     */
    get pinnedEntities(): SidebarEntityData[] {
        const entities = this._filterEntities((entity) => entity.pinnedPosition > 0);
        entities.sort((left, right) => left.pinnedPosition - right.pinnedPosition);
        return entities;
    }

    /**
     * The entities currently not pinned to the sidebar.
     */
    get unpinnedEntities(): SidebarEntityData[] {
        const entities = this._filterEntities((entity) => entity.pinnedPosition === 0);
        entities.sort((left, right) => right.lastViewTime.localeCompare(left.lastViewTime));
        return entities;
    }

    /**
     * @private
     */
    _filterEntities(predicate: (SidebarEntityData) => boolean): SidebarEntityData[] {
        const result = [];
        for (const entity of this.entities.values()) {
            if (predicate(entity)) {
                result.push(entity);
            }
        }
        return result;
    }

    /**
     * Pins an entity to the bottom of the list.
     */
    pinEntity(entity: SidebarEntityData): void {
        entity.pinnedPosition = this.pinnedEntities.length + 1;

        this._tooltipStore.hideTooltip();
        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Unpins an entity from the sidebar.
     */
    unpinEntity(entity: SidebarEntityData): void {
        entity.pinnedPosition = 0;

        this._tooltipStore.hideTooltip();
        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Adds a viewed entity to the sidebar, or updated an already existing entity in it.
     */
    addViewedEntity(type: SidebarEntityType, name: string, label: string) {
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

        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Updates the order of the pinned entities.
     */
    updatePinnedOrder(order: string[]): void {
        for (const [index, id] of order.entries()) {
            const entity = this.entities.get(id);
            if (entity) {
                entity.pinnedPosition = index + 1;
            }
        }

        this._sendEntities();
    }

    /**
     * Returns the id used for the entity.
     */
    getIdForEntity(entity: SidebarEntityData): string {
        return `${entity.type}-${entity.name}`;
    }

    /** @private */
    _validateEntities(): void {
        // Renumber pinned entities.
        for (const [index, entity] of this.pinnedEntities.entries()) {
            entity.pinnedPosition = index + 1;
        }

        // Cut off excessive unpinned entities.
        for (const entity of this.unpinnedEntities.slice(10)) {
            this.entities.delete(this.getIdForEntity(entity));
        }
    }

    /**
     * Sends the current entities to the Portal API.
     * @private
     */
    _sendEntities(): void {
        const entities = [...this.pinnedEntities, ...this.unpinnedEntities];
        this._storageManager.sidebarEntities = entities;

        (async (): Promise<void> => {
            try {
                await this._portalApi.sendSidebarEntities(entities);
            } catch (e) {
                // Ignore errors related to saving sidebar entities.
            }
        })();
    }
}

export const sidebarStore = new SidebarStore(portalApi, router, routeStore, storageManager, tooltipStore);
export const sidebarStoreContext = createContext<SidebarStore>(sidebarStore);
