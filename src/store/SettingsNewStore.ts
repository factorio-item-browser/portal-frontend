import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { CombinationId } from "../class/CombinationId";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { SaveGameReader } from "../class/SaveGameReader";
import { RECIPE_MODE_HYBRID } from "../const/recipeMode";
import { ROUTE_SETTINGS_NEW } from "../const/route";
import {
    SETTING_STATUS_AVAILABLE,
    SETTING_STATUS_LOADING,
    SETTING_STATUS_PENDING,
    SETTING_STATUS_UNKNOWN,
} from "../const/settingStatus";
import { SettingOptionsData, SettingStatusData } from "../type/transfer";
import { RouteStore, routeStore } from "./RouteStore";

const VALID_SETTING_STATUS = [SETTING_STATUS_AVAILABLE, SETTING_STATUS_PENDING, SETTING_STATUS_UNKNOWN];

class SettingsNewStore {
    private readonly portalApi: PortalApi;
    private readonly router: Router;
    private readonly routeStore: RouteStore;

    public isSaveGameProcessing: boolean = false;
    public saveGameModNames: string[] = [];
    public saveGameError: string = "";
    public settingStatus: SettingStatusData | null = null;
    public newOptions: SettingOptionsData = {
        name: "",
        recipeMode: RECIPE_MODE_HYBRID,
        locale: "en",
    };
    public isSavingNewSetting: boolean = false;

    constructor(
        portalApi: PortalApi,
        router: Router,
        routeStore: RouteStore,
    ) {
        this.portalApi = portalApi;
        this.router = router;
        this.routeStore = routeStore;

        makeObservable<this, "handleRouteChange" | "requestSettingStatus">(this, {
            changeOptions: action,
            changeToSetting: action,
            handleRouteChange: action,
            hasExistingSetting: computed,
            isSaveGameProcessing: observable,
            isSavingNewSetting: observable,
            newOptions: observable,
            processSaveGame: action,
            requestSettingStatus: action,
            saveGameModNames: observable,
            saveGameError: observable,
            saveNewSetting: action,
            settingStatus: observable,
            showAdditionalOptionsStep: computed,
            showDataAvailabilityStep: computed,
            showSaveButton: computed,
            showSaveGameStep: computed,
        });

        this.router.addRoute(ROUTE_SETTINGS_NEW, "/settings/new", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.settingStatus = null;
    }

    public get showSaveGameStep(): boolean {
        return true;
    }

    public get showDataAvailabilityStep(): boolean {
        return this.saveGameModNames.length > 0 && this.settingStatus !== null;
    }

    public get showAdditionalOptionsStep(): boolean {
        return this.showDataAvailabilityStep
            && this.settingStatus !== null
            && VALID_SETTING_STATUS.indexOf(this.settingStatus.status) !== -1;
    }

    public get showSaveButton(): boolean {
        return this.showAdditionalOptionsStep && this.newOptions.name !== "";
    }

    public get hasExistingSetting(): boolean {
        return !!this.settingStatus?.existingSetting;
    }

    public async processSaveGame(file: File): Promise<void> {
        this.isSaveGameProcessing = true;
        this.saveGameModNames = [];
        this.saveGameError = "";
        this.newOptions.name = file.name.endsWith(".zip") ? file.name.substr(0, file.name.length - 4) : file.name;

        const reader = new SaveGameReader();
        try {
            const mods = await reader.read(file);
            const modNames = mods.map((mod) => mod.name);

            await runInAction(async () => {
                this.isSaveGameProcessing = false;
                this.saveGameModNames = modNames;

                await this.requestSettingStatus(modNames);
            });
        } catch (e) {
            runInAction(() => {
                this.isSaveGameProcessing = false;
                this.saveGameError = e;
            });
        }
    }

    private async requestSettingStatus(modNames: string[]): Promise<void> {
        this.settingStatus = {
            status: SETTING_STATUS_LOADING,
        };

        try {
            const settingStatus = await this.portalApi.getSettingStatus(modNames);
            runInAction(() => {
                this.settingStatus = settingStatus;

                if (settingStatus.existingSetting) {
                    this.newOptions.name = settingStatus.existingSetting.name;
                    this.newOptions.locale = settingStatus.existingSetting.locale;
                    this.newOptions.recipeMode = settingStatus.existingSetting.recipeMode;
                }
            });
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }

    public changeOptions(options: Partial<SettingOptionsData>): void {
        this.newOptions = {
            ...this.newOptions,
            ...options,
        };
    }

    /**
     * Saves the new settings, pushing them to the server and redirecting afterwards.
     */
    public async saveNewSetting(): Promise<void> {
        this.isSavingNewSetting = true;
        try {
            const settingData = {
                ...this.newOptions,
                modNames: this.saveGameModNames,
            };
            await this.portalApi.createSetting(settingData);
            this.router.redirectToIndex(/* @todo need combinationId */);
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }

    /**
     * Saves the options and changes to the already existing setting.
     */
    public async changeToSetting(): Promise<void> {
        const setting = this.settingStatus?.existingSetting;
        if (!setting) {
            return;
        }

        this.isSavingNewSetting = true;
        try {
            await this.portalApi.saveSetting(setting.combinationId, this.newOptions);
            this.router.redirectToIndex(CombinationId.fromFull(setting.combinationId));
        } catch (e) {
            this.routeStore.handlePortalApiError(e);
        }
    }
}

export const settingsNewStore = new SettingsNewStore(portalApi, router, routeStore);
export const settingsNewStoreContext = createContext<SettingsNewStore>(settingsNewStore);
