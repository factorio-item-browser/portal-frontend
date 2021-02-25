import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext, RefObject } from "react";
import { getI18n } from "react-i18next";
import { constants } from "router5";
import { CombinationId } from "../class/CombinationId";
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

type InitHandler = (data: InitData) => void;

const REGEX_PATH_COMBINATION_ID = /^\/([0-9a-zA-Z]{22})(\/|$)/;

/**
 * The store handling the pages, including routing between them.
 */
export class RouteStore {
    private initHandlers = new Set<InitHandler>();

    /**
     * The current route which is displayed.
     */
    public currentRoute: string = "";

    /**
     * The fatal error which occurred.
     */
    public fatalError: string = "";

    /**
     * The target which currently have the loading circle.
     */
    public loadingCircleTarget: RefObject<Element> | null = null;

    /**
     * The currently loaded setting.
     */
    public setting: SettingMetaData = {
        combinationId: "",
        name: "Vanilla",
        status: SETTING_STATUS_AVAILABLE,
        isTemporary: false,
    };

    /**
     * The last used setting in case the current one is temporary.
     */
    public lastUsedSetting: SettingMetaData = {
        combinationId: "",
        name: "Vanilla",
        status: SETTING_STATUS_AVAILABLE,
        isTemporary: false,
    };

    /**
     * The locale to use for the page.
     */
    public locale: string = "en";

    public constructor(
        private readonly portalApi: PortalApi,
        public readonly router: Router,
        private readonly storageManager: StorageManager,
    ) {
        makeObservable<this, "handleGlobalRouteChange" | "handleInit">(this, {
            currentRoute: observable,
            fatalError: observable,
            handleGlobalRouteChange: action,
            handleInit: action,
            handlePortalApiError: action,
            hasUnknownRoute: computed,
            isInitiallyLoading: computed,
            lastUsedSetting: observable,
            loadingCircleTarget: observable,
            locale: observable,
            setting: observable,
            showGlobalSettingStatus: computed,
            showLoadingCircle: action,
            useBigHeader: computed,
        });

        this.router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
        this.addInitHandler(this.handleInit.bind(this));
    }

    private handleGlobalRouteChange() {
        this.currentRoute = this.router.currentRoute;
        this.loadingCircleTarget = null;
        window.scrollTo(0, 0);
    }

    private async handleInit(session: InitData) {
        this.setting = session.setting;
        this.lastUsedSetting = session.lastUsedSetting || session.setting;
        this.locale = session.locale;

        //this._cacheManager.setSettingHash(session.settingHash);
        await getI18n().changeLanguage(session.locale);
    }

    /**
     * Adds a handler for initializing the session.
     */
    public addInitHandler(handler: InitHandler): void {
        this.initHandlers.add(handler);
    }

    /**
     * Whether we are still initially loading all the things.
     */
    public get isInitiallyLoading(): boolean {
        return this.currentRoute === "";
    }

    /**
     * Whether we are currently viewing an unknown route.
     */
    public get hasUnknownRoute(): boolean {
        return this.currentRoute === constants.UNKNOWN_ROUTE;
    }

    /**
     * Initializes the session.
     */
    public async initializeSession(): Promise<void> {
        this.detectInitialCombinationId();
        try {
            const initData = await portalApi.initializeSession();
            if (this.hasCurrentScriptVersion(initData.scriptVersion)) {
                // Current script version is already loaded, so proceed as usual.
                const combinationId = CombinationId.fromFull(initData.setting.combinationId);
                this.storageManager.combinationId = combinationId;

                for (const handler of this.initHandlers) {
                    handler(initData);
                }

                this.router.start(combinationId);
            } else {
                // Script version has changed, force a reload of the page to get the latest files.
                window.location.reload();
            }
        } catch (e) {
            this.handlePortalApiError(e);
        }
    }

    private detectInitialCombinationId(): void {
        const match = window.location.pathname.match(REGEX_PATH_COMBINATION_ID);
        if (match && match[1]) {
            this.storageManager.combinationId = CombinationId.fromShort(match[1]);
        }
    }

    /**
     * Checks whether the current script version is already loaded.
     */
    private hasCurrentScriptVersion(requiredScriptVersion: string): boolean {
        if (!requiredScriptVersion) {
            // Didn't receive any script version? Meh, disable the reload feature.
            return true;
        }

        const currentScriptVersion = this.storageManager.scriptVersion;
        if (!currentScriptVersion) {
            // Don't have a script version stored? Then we may be coming from a redirect. Write version and done.
            this.storageManager.scriptVersion = requiredScriptVersion;
            return true;
        }

        if (currentScriptVersion === requiredScriptVersion) {
            // Script version did not change, so everything is fine.
            return true;
        }

        this.storageManager.scriptVersion = "";
        if (this.storageManager.scriptVersion) {
            // Somehow we aren't able to remove the script version. So do not reload to avoid an infinite loop.
            return true;
        }

        // Force a reload because the script version has changed.
        return false;
    }

    /**
     * Handles an error thrown by the Portal API, by displaying a fatal error box.
     */
    public handlePortalApiError(error: PortalApiError): void {
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
     */
    public get useBigHeader(): boolean {
        return this.currentRoute === ROUTE_INDEX;
    }

    /**
     * Shows the loading circle overlaying the passed reference object.
     */
    public showLoadingCircle(ref: RefObject<Element>): void {
        this.loadingCircleTarget = ref;
    }

    /**
     * Returns whether the global setting status should be shown.
     */
    public get showGlobalSettingStatus(): boolean {
        return ![ROUTE_SETTINGS, ROUTE_SETTINGS_NEW].includes(this.currentRoute);
    }

    /**
     * Checks the current status of the setting, if its data is still not available.
     */
    public async checkSettingStatus(): Promise<void> {
        if ([SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN].includes(this.setting.status)) {
            try {
                const settingStatus = await this.portalApi.getSettingStatus();
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
export const routeStoreContext = createContext<RouteStore>(routeStore);
