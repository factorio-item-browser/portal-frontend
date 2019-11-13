import {createContext} from "react";
import {action, computed, observable} from "mobx";

/**
 * The store managing all the data of the sidebar.
 */
class SidebarStore {
    /**
     * The entities of the sidebar.
     * @type {SidebarEntityData[]}
     */
    @observable
    entities = [
        {type: "recipe", name: "copper-plate", label: "Kupferplatte", pinnedPosition: 0, lastViewTime: "2019-01-01"},
        {type: "item", name: "iron-plate", label: "Eisenplatte", pinnedPosition: 13, lastViewTime: "2020-01-01"},
        {type: "fluid", name: "light-oil", label: "Leichtöl", pinnedPosition: 1, lastViewTime: new Date().toISOString()},
    ];

    /**
     * The entities pinned to the sidebar.
     */
    @computed
    get pinnedEntities() {
        const entities = this.entities.filter(entity => entity.pinnedPosition > 0);
        entities.sort((left, right) => left.pinnedPosition - right.pinnedPosition);
        return entities;
    }

    /**
     * The entities currently not pinned to the sidebar.
     */
    @computed
    get unpinnedEntities() {
        const entities = this.entities.filter(entity => !entity.pinnedPosition);
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
        let entity = this.findEntity(type, name);
        if (entity) {
            entity.label = label;
            entity.lastViewTime = (new Date()).toISOString();
        } else {
            this.entities.push({
                type: type,
                name: name,
                label: label,
                pinnedPosition: 0,
                lastViewTime: (new Date()).toISOString(),
            });
        }
    }

    /**
     * Finds the entity with the specified type and name.
     * @param {string} type
     * @param {string} name
     * @returns {SidebarEntityData|null}
     */
    findEntity(type, name) {
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (entity.type === type && entity.name === name) {
                return entity;
            }
        }
        return null;
    }
}

export const sidebarStore = new SidebarStore();
export default createContext(sidebarStore);
