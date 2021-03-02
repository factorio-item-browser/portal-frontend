import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { PortalApi, portalApi } from "../api/PortalApi";
import { SettingOptionsData, SettingStatusData } from "../api/transfer";
import { CombinationId } from "../class/CombinationId";
import { router, Router } from "../class/Router";
import { SaveGameReader } from "../class/SaveGameReader";
import { SavegameError } from "../error/savegame";
import { RouteName, RecipeMode, SettingStatus } from "../util/const";
import { errorStore, ErrorStore } from "./ErrorStore";

const validSettingStatus = [SettingStatus.Available, SettingStatus.Pending, SettingStatus.Unknown];

class SettingsNewStore {
    private readonly errorStore: ErrorStore;
    private readonly portalApi: PortalApi;
    private readonly router: Router;

    /** Whether we are processing a savegame file. */
    public isSaveGameProcessing = false;
    /** The mods from the savegame. */
    public saveGameModNames: string[] = [];
    /** The error of processing the savegame. */
    public saveGameError: SavegameError | null = null;
    /** The status of the new setting. */
    public settingStatus: SettingStatusData | null = null;
    /** The options for the new setting. */
    public newOptions: SettingOptionsData = {
        name: "",
        recipeMode: RecipeMode.Hybrid,
        locale: "en",
    };
    /** Whether we are currently saving the setting. */
    public isSavingNewSetting = false;

    public constructor(errorStore: ErrorStore, portalApi: PortalApi, router: Router) {
        this.errorStore = errorStore;
        this.portalApi = portalApi;
        this.router = router;

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

        this.router.addRoute(RouteName.SettingsNew, "/settings/new", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        this.saveGameModNames = [];
        this.saveGameError = null;
        this.settingStatus = null;
    }

    /**
     * Whether the savegame step must be shown.
     */
    public get showSaveGameStep(): boolean {
        return true;
    }

    /**
     * Whether the availability step must be shown.
     */
    public get showDataAvailabilityStep(): boolean {
        return this.saveGameModNames.length > 0 && this.settingStatus !== null;
    }

    /**
     * Whether the additional options step must be shown.
     */
    public get showAdditionalOptionsStep(): boolean {
        return (
            this.showDataAvailabilityStep &&
            this.settingStatus !== null &&
            validSettingStatus.indexOf(this.settingStatus.status as SettingStatus) !== -1
        );
    }

    /**
     * Whether the save button must be shown.
     */
    public get showSaveButton(): boolean {
        return this.showAdditionalOptionsStep && this.newOptions.name !== "";
    }

    /**
     * Whether there is an already existing setting for the combination.
     */
    public get hasExistingSetting(): boolean {
        return !!this.settingStatus?.existingSetting;
    }

    /**
     * Processes the savegame selected in the file input element.
     */
    public async processSaveGame(file: File): Promise<void> {
        this.isSaveGameProcessing = true;
        this.saveGameModNames = [];
        this.saveGameError = null;
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
                console.error(e);
            });
        }
    }

    private async requestSettingStatus(modNames: string[]): Promise<void> {
        this.settingStatus = {
            status: SettingStatus.Loading,
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
            this.errorStore.handleError(e);
        }
    }

    /**
     * Changes the options for the new setting.
     */
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
            this.errorStore.handleError(e);
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
            this.errorStore.handleError(e);
        }
    }
}

export const settingsNewStore = new SettingsNewStore(errorStore, portalApi, router);
export const settingsNewStoreContext = createContext(settingsNewStore);
