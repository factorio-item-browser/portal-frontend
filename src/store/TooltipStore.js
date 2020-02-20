import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";

import Cache from "../class/Cache";
import { portalApi } from "../class/PortalApi";

/**
 * The store managing the tooltips.
 */
class TooltipStore {
    /**
     * The cache of the tooltips.
     * @type {Cache<EntityData>}
     * @private
     */
    _cache;

    /**
     * The portal API instance.
     * @type {PortalApi}
     * @private
     */
    _portalApi;

    /**
     * The flags which may disable the tooltips.
     * @type {object<string,boolean>}
     * @private
     */
    _disableFlags = {};

    /**
     * The target for which a tooltip was requested. This target may still be waiting for its data.
     * @type {React.RefObject<HTMLElement>|null}
     */
    @observable
    requestedTarget = null;

    /**
     * The target for which the data has been fetched. This target has its data available.
     * @type {React.RefObject<HTMLElement>|null}
     */
    @observable
    fetchedTarget = null;

    /**
     * The fetched data for the tooltip.
     * @type {EntityData|null}
     */
    @observable
    fetchedData = null;

    /**
     * Initializes the store.
     * @param {Cache<EntityData>} cache
     * @param {PortalApi} portalApi
     */
    constructor(cache, portalApi) {
        this._cache = cache;
        this._portalApi = portalApi;
    }

    /**
     * Returns whether tooltips are currently enabled.
     * @return {boolean}
     */
    @computed
    get isEnabled() {
        for (const flag of Object.values(this._disableFlags)) {
            if (flag) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sets a flag to disable or re-enable the tooltips.
     * @param {string} name
     * @param {boolean} isDisabled
     */
    @action
    setDisableFlag(name, isDisabled) {
        this._disableFlags[name] = isDisabled;
    }

    /**
     * Shows the tooltip on the target with the type and name.
     * @param {React.RefObject<HTMLElement>} target
     * @param {string} type
     * @param {string} name
     * @return {Promise<void>}
     */
    @action
    async showTooltip(target, type, name) {
        if (!this.isEnabled) {
            return;
        }

        this.requestedTarget = target;
        const data = await this._fetchTooltipData(type, name);
        runInAction(() => {
            if (this.requestedTarget !== null && this.requestedTarget.current === target.current) {
                this.fetchedTarget = target;
                this.fetchedData = data;
            }
        });
    }

    /**
     * Hides the tooltip of the specified target-
     */
    @action
    hideTooltip() {
        this.requestedTarget = null;
    }

    /**
     * Returns whether a tooltip with its data is actually available.
     * @return {boolean|boolean}
     */
    @computed
    get isTooltipAvailable() {
        return (
            this.requestedTarget !== null &&
            this.fetchedTarget !== null &&
            this.requestedTarget.current === this.fetchedTarget.current
        );
    }

    /**
     * Fetches the data for the tooltip.
     * @param {string} type
     * @param {string} name
     * @return {Promise<EntityData>}
     * @private
     */
    async _fetchTooltipData(type, name) {
        const cacheKey = `${type}-${name}`;
        const cachedData = this._cache.read(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const requestedData = await this._portalApi.getTooltip(type, name);
        this._cache.write(cacheKey, requestedData);
        return requestedData;
    }
}

const cache = new Cache("tooltip", 86400000);

export const tooltipStore = new TooltipStore(cache, portalApi);
export default createContext(tooltipStore);
