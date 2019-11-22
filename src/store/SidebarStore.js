import { action, computed, observable } from "mobx";
import { createContext } from "react";

/**
 * The store managing all the data of the sidebar.
 */
class SidebarStore {
    /**
     * The entities of the sidebar.
     * @type {Object<string,SidebarEntityData>}
     */
    @observable
    entities = {
        "recipe-copper-plate": {
            type: "recipe",
            name: "copper-plate",
            label: "Kupferplatte",
            pinnedPosition: 0,
            lastViewTime: "2019-01-01",
        },
        "item-iron-plate": {
            type: "item",
            name: "iron-plate",
            label: "Eisenplatte",
            pinnedPosition: 13,
            lastViewTime: "2020-01-01",
        },
        "fluid-light-oil": {
            type: "fluid",
            name: "light-oil",
            label: "Leichtöl",
            pinnedPosition: 1,
            lastViewTime: new Date().toISOString(),
        },
    };

    /**
     * Whether the sidebar has been opened on mobile.
     * @type {boolean}
     */
    @observable
    isSidebarOpened = false;

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
        return entities;
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
    addViewedEntity(type, name, label) {
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
    }

    /**
     * Updates the order of the pinned entities.
     * @param {string[]} order
     */
    @action
    updatePinnedOrder(order) {
        order.forEach((id, index) => {
            if (this.entities[id]) {
                this.entities[id].pinnedPosition = index + 1;
            }
        });
    }

    /**
     * Returns the id used for the entity.
     * @param {SidebarEntityData} entity
     * @returns {string}
     */
    getIdForEntity(entity) {
        return `${entity.type}-${entity.name}`;
    }
}

export const sidebarStore = new SidebarStore();
export default createContext(sidebarStore);
