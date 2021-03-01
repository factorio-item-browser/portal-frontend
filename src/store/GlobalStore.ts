import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext, RefObject } from "react";
import { getI18n } from "react-i18next";
import { State } from "router5";
import { CombinationId } from "../class/CombinationId";
import { portalApi, PortalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { storageManager, StorageManager } from "../class/StorageManager";
import { InitData, SettingMetaData } from "../type/transfer";
import { RouteName, SettingStatus } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";

type InitHandler = (initData: InitData) => void | Promise<void>;

const regexPathCombinationId = /^\/([0-9a-zA-Z]{22})(\/|$)/;
const emptySetting: SettingMetaData = {
    combinationId: "",
    name: "Vanilla",
    status: SettingStatus.Available,
    isTemporary: false,
};

export class GlobalStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    public readonly router: Router;
    private readonly storageManager: StorageManager;

    private initHandlers: InitHandler[] = [];

    /** The route which is currently active. */
    public currentRoute: RouteName = RouteName.Empty;
    /** The target which currently have the loading circle. */
    public loadingCircleTarget: RefObject<Element> | null = null;

    /** The currently loaded setting. */
    public setting: SettingMetaData = emptySetting;
    /** The last used setting in case the current one is temporary. */
    public lastUsedSetting: SettingMetaData = emptySetting;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router, storageManager: StorageManager) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.router = router;
        this.storageManager = storageManager;

        makeObservable<this, "handleGlobalRouteChange" | "handleInit">(this, {
            checkSettingStatus: action,
            currentRoute: observable,
            handleGlobalRouteChange: action,
            handleInit: action,
            isGlobalSettingStatusShown: computed,
            isInitiallyLoading: computed,
            lastUsedSetting: observable,
            loadingCircleTarget: observable,
            setting: observable,
            showLoadingCircle: action,
            useBigHeader: computed,
        });

        router.addGlobalChangeHandler(this.handleGlobalRouteChange.bind(this));
        this.addInitHandler(this.handleInit.bind(this));
    }

    private handleGlobalRouteChange(state: State): void {
        this.currentRoute = state.name as RouteName;
        this.loadingCircleTarget = null;
        window.scrollTo(0, 0);
    }

    private async handleInit(initData: InitData): Promise<void> {
        this.setting = initData.setting;
        this.lastUsedSetting = initData.lastUsedSetting || initData.setting;

        await getI18n().changeLanguage(initData.locale);
    }

    /**
     * Whether we are still initially loading the page.
     */
    public get isInitiallyLoading(): boolean {
        return this.currentRoute === RouteName.Empty;
    }

    /**
     * Whether the big header should be used for displaying the current page.
     */
    public get useBigHeader(): boolean {
        return this.currentRoute === RouteName.Index;
    }

    /**
     * Returns whether the global setting status should be shown.
     */
    public get isGlobalSettingStatusShown(): boolean {
        return ![RouteName.Settings, RouteName.SettingsNew].includes(this.currentRoute);
    }

    /**
     * Adds a handler for when the session has been initialized.
     */
    public addInitHandler(handler: InitHandler): void {
        this.initHandlers.push(handler);
    }

    /**
     * Initializes the session and all the things needed to get the page going.
     */
    public async initialize(): Promise<void> {
        this.detectInitialCombinationId();
        try {
            const initData = await this.portalApi.initializeSession();
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
            this.errorStore.handleError(e);
        }
    }

    /**
     * Shows the loading circle on top of the target.
     */
    public showLoadingCircle(target: RefObject<Element>): void {
        this.loadingCircleTarget = target;
    }

    /**
     * Checks the current status of the setting, if its data is still not available.
     */
    public async checkSettingStatus(): Promise<void> {
        if ([SettingStatus.Pending, SettingStatus.Unknown].includes(this.setting.status as SettingStatus)) {
            try {
                const settingStatus = await this.portalApi.getSettingStatus();
                if (settingStatus.status === SettingStatus.Available) {
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

    private detectInitialCombinationId(): void {
        const match = window.location.pathname.match(regexPathCombinationId);
        if (match && match[1]) {
            this.storageManager.combinationId = CombinationId.fromShort(match[1]);
        }
    }

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
}

export const globalStore = new GlobalStore(errorStore, portalApi, router, storageManager);
export const globalStoreContext = createContext(globalStore);
