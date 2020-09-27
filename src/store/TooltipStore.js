// @flow

import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import type { ElementRef } from "../type/common";
import type { EntityData } from "../type/transfer";

/**
 * The store managing the tooltips.
 */
export class TooltipStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _disableFlags: Map<string, boolean> = new Map();

    /**
     * The target for which a tooltip was requested. This target may still be waiting for its data.
     */
    @observable
    requestedTarget: ?ElementRef = null;

    /**
     * The target for which the data has been fetched. This target has its data available.
     */
    @observable
    fetchedTarget: ?ElementRef = null;

    /**
     * The fetched data for the tooltip.
     */
    @observable
    fetchedData: ?EntityData = null;

    constructor(portalApi: PortalApi, router: Router) {
        this._portalApi = portalApi;

        router.addGlobalChangeHandler(this._handleGlobalRouteChange.bind(this));
    }

    /**
     * @private
     */
    _handleGlobalRouteChange(): void {
        this.hideTooltip();
    }

    /**
     * Returns whether tooltips are currently enabled.
     */
    @computed
    get isEnabled(): boolean {
        for (const flag of this._disableFlags.values()) {
            if (flag) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sets a flag to disable or re-enable the tooltips.
     */
    @action
    setDisableFlag(name: string, isDisabled: boolean): void {
        this._disableFlags.set(name, isDisabled);
        if (isDisabled) {
            this.hideTooltip();
        }
    }

    /**
     * Shows the tooltip on the target with the type and name.
     */
    @action
    async showTooltip(target: ElementRef, type: string, name: string): Promise<void> {
        if (!this.isEnabled) {
            return;
        }

        this.requestedTarget = target;
        this.fetchedTarget = null;

        try {
            const data = await this._portalApi.getTooltip(type, name);
            runInAction((): void => {
                if (this.requestedTarget && this.requestedTarget.current === target.current) {
                    this.fetchedTarget = target;
                    this.fetchedData = data;
                }
            });
        } catch (e) {
            // Fetching the tooltip failed. So we can't do anything.
            runInAction((): void => {
                if (this.requestedTarget && this.requestedTarget.current === target.current) {
                    this.requestedTarget = null;
                }
            });
        }
    }

    /**
     * Hides the tooltip of the specified target-
     */
    @action
    hideTooltip(): void {
        this.requestedTarget = null;
    }

    /**
     * Returns whether a tooltip with its data is actually available.
     */
    @computed
    get isTooltipAvailable(): boolean {
        return (
            !!this.requestedTarget &&
            !!this.fetchedTarget &&
            this.requestedTarget.current === this.fetchedTarget.current
        );
    }
}

export const tooltipStore = new TooltipStore(portalApi, router);
export const tooltipStoreContext = createContext<TooltipStore>(tooltipStore);
