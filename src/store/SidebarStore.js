import { action, computed, observable } from "mobx";
import { createContext } from "react";

import { portalApi } from "../class/PortalApi";
import { ROUTE_ITEM_DETAILS, ROUTE_RECIPE_DETAILS } from "../helper/const";

import { routeStore } from "./RouteStore";
import { tooltipStore } from "./TooltipStore";
import { storageManager } from "../class/StorageManager";

/**
 * The store managing all the data of the sidebar.
 */
class SidebarStore {
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
     * The storage manager.
     * @type {StorageManager}
     * @private
     */
    _storageManager;

    /**
     * The tooltip store.
     * @type {TooltipStore}
     * @private
     */
    _tooltipStore;

    /**
     * The entities of the sidebar.
     * @type {Map<string,SidebarEntityData>}
     */
    @observable
    entities = new Map();

    /**
     * The id of the entity which is currently highlighted.
     * @type {string}
     */
    @observable
    highlightedEntityId = "";

    /**
     * Whether the sidebar has been opened on mobile.
     * @type {boolean}
     */
    @observable
    isSidebarOpened = false;

    /**
     * Initializes the store.
     * @param {PortalApi} portalApi
     * @param {RouteStore} routeStore
     * @param {StorageManager} storageManager
     * @param {TooltipStore} tooltipStore
     */
    constructor(portalApi, routeStore, storageManager, tooltipStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;
        this._storageManager = storageManager;
        this._tooltipStore = tooltipStore;

        this._routeStore.addInitializeSessionHandler(this._initializeSession.bind(this));
        this._routeStore.addRouteChangeHandler(this._handleRouteChange.bind(this));
        this._storageManager.sidebarEntitiesChangeHandler = this._handleSidebarEntitiesChange.bind(this);
    }

    /**
     * Initializes the sidebar from the session.
     * @param {SidebarEntityData[]} sidebarEntities
     * @private
     */
    _initializeSession({ sidebarEntities }) {
        this._assignEntities(sidebarEntities);

        this._storageManager.sidebarEntities = [...this.pinnedEntities, ...this.unpinnedEntities];
    }

    /**
     * Handles the change of the route.
     * @param {State} route
     * @private
     */
    @action
    _handleRouteChange({ route }) {
        this.closeSidebar();

        switch (route.name) {
            case ROUTE_RECIPE_DETAILS:
                this.highlightedEntityId = `recipe-${route.params.name}`;
                break;
            case ROUTE_ITEM_DETAILS:
                this.highlightedEntityId = `${route.params.type}-${route.params.name}`;
                break;
            default:
                this.highlightedEntityId = "";
        }
    }

    /**
     * Handles the change of the sidebar entities (e.g. in another tab).
     * @param {SidebarEntityData[]} entities
     * @private
     */
    _handleSidebarEntitiesChange(entities) {
        try {
            this._assignEntities(entities);
        } catch (e) {
            // Ignore any errors.
        }
    }

    /**
     * Opens the sidebar on the mobile view.
     */
    @action
    openSidebar() {
        this.isSidebarOpened = true;
    }

    /**
     * Closes the sidebar on the mobile view.
     */
    @action
    closeSidebar() {
        this.isSidebarOpened = false;
    }

    /**
     * Assigns the entities to the store.
     * @param {SidebarEntityData[]} entities
     * @private
     */
    @action
    _assignEntities(entities) {
        this.entities.clear();
        for (const entity of entities) {
            this.entities.set(this.getIdForEntity(entity), entity);
        }
        this._validateEntities();
    }

    /**
     * The entities pinned to the sidebar.
     * @return {SidebarEntityData[]}
     */
    @computed
    get pinnedEntities() {
        const entities = this._filterEntities((entity) => entity.pinnedPosition > 0);
        entities.sort((left, right) => left.pinnedPosition - right.pinnedPosition);
        return entities;
    }

    /**
     * The entities currently not pinned to the sidebar.
     * @return {SidebarEntityData[]}
     */
    @computed
    get unpinnedEntities() {
        const entities = this._filterEntities((entity) => entity.pinnedPosition === 0);
        entities.sort((left, right) => right.lastViewTime.localeCompare(left.lastViewTime));
        return entities;
    }

    /**
     * Filters the entities using the predicate.
     * @param {function(SidebarEntityData): boolean} predicate
     * @return {SidebarEntityData[]}
     * @private
     */
    _filterEntities(predicate) {
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
     * @param {SidebarEntityData} entity
     */
    @action
    pinEntity(entity) {
        entity.pinnedPosition = this.pinnedEntities.length + 1;

        this._tooltipStore.hideTooltip();
        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Unpins an entity from the sidebar.
     * @param {SidebarEntityData} entity
     */
    @action
    unpinEntity(entity) {
        entity.pinnedPosition = 0;

        this._tooltipStore.hideTooltip();
        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Adds a viewed entity to the sidebar, or updated an already existing entity in it.
     * @param {string} type
     * @param {string} name
     * @param {string} label
     */
    @action
    addViewedEntity(type, name, label) {
        const id = `${type}-${name}`;
        if (this.entities.has(id)) {
            const entity = this.entities.get(id);
            entity.label = label;
            entity.lastViewTime = new Date().toISOString();
        } else {
            this.entities.set(id, {
                type,
                name,
                label,
                pinnedPosition: 0,
                lastViewTime: new Date().toISOString(),
            });
        }

        this._validateEntities();
        this._sendEntities();
    }

    /**
     * Updates the order of the pinned entities.
     * @param {string[]} order
     */
    @action
    updatePinnedOrder(order) {
        for (const [index, id] of order.entries()) {
            if (this.entities.has(id)) {
                this.entities.get(id).pinnedPosition = index + 1;
            }
        }

        this._sendEntities();
    }

    /**
     * Returns the id used for the entity.
     * @param {SidebarEntityData} entity
     * @returns {string}
     */
    getIdForEntity(entity) {
        return `${entity.type}-${entity.name}`;
    }

    /**
     * Validates all entities of the sidebar.
     * @private
     */
    @action
    _validateEntities() {
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
    _sendEntities() {
        const entities = [...this.pinnedEntities, ...this.unpinnedEntities];
        this._storageManager.sidebarEntities = entities;

        (async () => {
            try {
                await this._portalApi.sendSidebarEntities(entities);
            } catch (e) {
                // Ignore errors related to saving sidebar entities.
            }
        })();
    }
}

export const sidebarStore = new SidebarStore(portalApi, routeStore, storageManager, tooltipStore);
export default createContext(sidebarStore);
