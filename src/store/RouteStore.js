// @flow

import { action, computed, observable, runInAction } from "mobx";
import { createContext } from "react";
import { getI18n } from "react-i18next";
import { constants } from "router5";
import CombinationId from "../class/CombinationId";
import { PortalApi, portalApi, PortalApiError } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { StorageManager, storageManager } from "../class/StorageManager";
import {
    ERROR_CLIENT_FAILURE,
    ERROR_INCOMPATIBLE_CLIENT,
    ERROR_SERVER_FAILURE,
    ERROR_SERVICE_NOT_AVAILABLE,
} from "../const/error";
import { ROUTE_INDEX, ROUTE_SETTINGS, ROUTE_SETTINGS_NEW } from "../const/route";
import { SETTING_STATUS_AVAILABLE, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN } from "../const/settingStatus";
import type { InitData, SettingMetaData } from "../type/transfer";

type InitHandler = (InitData) => void;
type LoadingRef = { current: ?HTMLElement };

/**
 * The store handling the pages, including routing between them.
 */
export class RouteStore {
    /**
     * @private
     */
    _portalApi: PortalApi;

    /**
     * @private
     */
    _router: Router;

    /**
     * @private
     */
    _storageManager: StorageManager;

    /**
     * @private
     */
    _initHandlers: Set<InitHandler> = new Set();

    /**
     * The current route which is displayed.
     */
    @observable
    currentRoute: string = "";

    /**
     * The fatal error which occurred.
     */
    @observable
    fatalError: string = "";

    /**
     * The target which currently have the loading circle.
     */
    @observable
    loadingCircleTarget: ?LoadingRef = null;

    /**
     * The currently loaded setting.
     */
    @observable
    setting: SettingMetaData = {
        combinationId: "",
        name: "Vanilla",
        status: SETTING_STATUS_AVAILABLE,
    };

    /**
     * The locale to use for the page.
     * @type {string}
     */
    @observable
    locale: string = "en";

    constructor(portalApi: PortalApi, router: Router, storageManager: StorageManager) {
        this._portalApi = portalApi;
        this._router = router;
        this._storageManager = storageManager;

        this._router.addGlobalChangeHandler(this._handleRouteChange.bind(this));
        this.addInitHandler(this._initializeSession.bind(this));
    }

    /**
     * @private
     */
    @action
    _handleRouteChange() {
        this.currentRoute = this._router.currentRoute;
        window.scrollTo(0, 0);
    }

    /**
     * Initializes the session
     * @param {InitData} session
     * @private
     */
    @action
    async _initializeSession(session: InitData) {
        this.setting = session.setting;
        this.locale = session.locale;

        //this._cacheManager.setSettingHash(session.settingHash);
        await getI18n().changeLanguage(session.locale);
    }

    /**
     * Adds a handler for initializing the session.
     */
    addInitHandler(handler: InitHandler): void {
        this._initHandlers.add(handler);
    }

    get router(): Router {
        return this._router;
    }

    /**
     * Whether we are still initially loading all the things.
     * @return {boolean}
     */
    @computed
    get isInitiallyLoading() {
        return this.currentRoute === "";
    }

    /**
     * Whether we are currently viewing an unknown route.
     * @return {boolean}
     */
    @computed
    get hasUnknownRoute() {
        return this.currentRoute === constants.UNKNOWN_ROUTE;
    }

    /**
     * Initializes the session.
     * @returns {Promise<void>}
     */
    async initializeSession(): Promise<void> {
        try {
            const initData = await portalApi.initializeSession();
            if (this._hasCurrentScriptVersion(initData.scriptVersion)) {
                // Current script version is already loaded, so proceed as usual.
                const combinationId = CombinationId.fromFull(initData.setting.combinationId);
                this._storageManager.combinationId = combinationId;

                for (const handler of this._initHandlers) {
                    handler(initData);
                }

                this._router.start(combinationId);
            } else {
                // Script version has changed, force a reload of the page to get the latest files.
                window.location.reload();
            }
        } catch (e) {
            this.handlePortalApiError(e);
        }
    }

    /**
     * Checks whether the current script version is already loaded.
     * @private
     */
    _hasCurrentScriptVersion(requiredScriptVersion: string): boolean {
        if (!requiredScriptVersion) {
            // Didn't receive any script version? Meh, disable the reload feature.
            return true;
        }

        const currentScriptVersion = this._storageManager.scriptVersion;
        if (!currentScriptVersion) {
            // Don't have a script version stored? Then we may be coming from a redirect. Write version and done.
            this._storageManager.scriptVersion = requiredScriptVersion;
            return true;
        }

        if (currentScriptVersion === requiredScriptVersion) {
            // Script version did not change, so everything is fine.
            return true;
        }

        this._storageManager.scriptVersion = "";
        if (this._storageManager.scriptVersion) {
            // Somehow we aren't able to remove the script version. So do not reload to avoid an infinite loop.
            return true;
        }

        // Force a reload because the script version has changed.
        return false;
    }

    /**
     * Handles an error thrown by the Portal API, by displaying a fatal error box.
     */
    handlePortalApiError(error: PortalApiError): void {
        if (error.code === 401) {
            this.fatalError = ERROR_INCOMPATIBLE_CLIENT;
        } else if (error.code === 409) {
            this.fatalError = ERROR_CLIENT_FAILURE;
        } else if (error.code === 503) {
            this.fatalError = ERROR_SERVICE_NOT_AVAILABLE;
        } else {
            this.fatalError = ERROR_SERVER_FAILURE;
        }

        console.log(error);
    }

    /**
     * Whether to use the big version of the header.
     * @returns {boolean}
     */
    @computed
    get useBigHeader() {
        return this.currentRoute === ROUTE_INDEX;
    }

    /**
     * Shows the loading circle overlaying the passed reference object.
     */
    @action
    showLoadingCircle(ref: LoadingRef): void {
        this.loadingCircleTarget = ref;
    }

    /**
     * Returns whether the global setting status should be shown.
     */
    @computed
    get showGlobalSettingStatus(): boolean {
        return ![ROUTE_SETTINGS, ROUTE_SETTINGS_NEW].includes(this.currentRoute);
    }

    /**
     * Checks the current status of the setting, if its data is still not available.
     */
    async checkSettingStatus(): Promise<void> {
        if ([SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN].includes(this.setting.status)) {
            try {
                const settingStatus = await this._portalApi.getSettingStatus();
                if (settingStatus.status === SETTING_STATUS_AVAILABLE) {
                    window.location.reload();
                } else {
                    runInAction(() => {
                        this.setting.status = settingStatus.status;
                    });
                }
            } catch (e) {
                // Ignore any errors related to checking the setting status.
            }
        }
    }
}

export const routeStore = new RouteStore(portalApi, router, storageManager);
export const routeStoreContext = new createContext<RouteStore>(routeStore);
