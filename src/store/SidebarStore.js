import { action, computed, observable } from "mobx";
import { createContext } from "react";

import { portalApi } from "../class/PortalApi";

import { routeStore } from "./RouteStore";

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
     * The entities of the sidebar.
     * @type {Object<string,SidebarEntityData>}
     */
    @observable
    entities = {};

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
     */
    constructor(portalApi, routeStore) {
        this._portalApi = portalApi;
        this._routeStore = routeStore;

        this._routeStore.addInitializeSessionHandler(this._initializeSession.bind(this));
    }

    /**
     * Initializes the sidebar from the session.
     * @param {SidebarEntityData[]} sidebarEntities
     * @private
     */
    @action
    _initializeSession({ sidebarEntities }) {
        const x = {};
        sidebarEntities.forEach((sidebarEntity) => {
            x[this.getIdForEntity(sidebarEntity)] = sidebarEntity;
        });
        this.entities = x;
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
     * The entities pinned to the sidebar.
     */
    @computed
    get pinnedEntities() {
        const entities = [];
        Object.keys(this.entities).forEach((id) => {
            const entity = this.entities[id];
            if (entity.pinnedPosition > 0) {
                entities.push(entity);
            }
        });

        entities.sort((left, right) => left.pinnedPosition - right.pinnedPosition);
        return entities;
    }

    /**
     * The entities currently not pinned to the sidebar.
     */
    @computed
    get unpinnedEntities() {
        const entities = [];
        Object.keys(this.entities).forEach((id) => {
            const entity = this.entities[id];
            if (entity.pinnedPosition === 0) {
                entities.push(entity);
            }
        });

        entities.sort((left, right) => right.lastViewTime.localeCompare(left.lastViewTime));
        return entities.slice(0, 10);
    }

    /**
     * Pins an entity to the bottom of the list.
     * @param {SidebarEntityData} entity
     */
    @action
    pinEntity(entity) {
        entity.pinnedPosition = this.pinnedEntities.length + 1;
    }

    /**
     * Unpins an entity from the sidebar.
     * @param {SidebarEntityData} entity
     */
    @action
    unpinEntity(entity) {
        entity.pinnedPosition = 0;

        this.pinnedEntities.forEach((entity, index) => {
            entity.pinnedPosition = index + 1;
        });
    }

    /**
     * Adds a viewed entity to the sidebar, or updated an already existing entity in it.
     * @param {string} type
     * @param {string} name
     * @param {string} label
     */
    @action
    async addViewedEntity(type, name, label) {
        const newEntity = {
            type: type,
            name: name,
            label: label,
            pinnedPosition: 0,
            lastViewTime: new Date().toISOString(),
        };
        const id = this.getIdForEntity(newEntity);

        if (this.entities[id]) {
            this.entities[id].label = newEntity.label;
            this.entities[id].lastViewTime = newEntity.lastViewTime;
        } else {
            this.entities[id] = newEntity;
        }

        await this._sendEntities();
    }

    /**
     * Updates the order of the pinned entities.
     * @param {string[]} order
     */
    @action
    async updatePinnedOrder(order) {
        order.forEach((id, index) => {
            if (this.entities[id]) {
                this.entities[id].pinnedPosition = index + 1;
            }
        });

        await this._sendEntities();
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
     * Sends the current entities to the Portal API.
     * @returns {Promise<void>}
     * @private
     */
    async _sendEntities() {
        const entities = [];
        entities.push(...this.pinnedEntities, ...this.unpinnedEntities);

        await this._portalApi.sendSidebarEntities(entities);
    }
}

export const sidebarStore = new SidebarStore(portalApi, routeStore);
export default createContext(sidebarStore);
