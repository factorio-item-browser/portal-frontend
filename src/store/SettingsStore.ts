import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { createContext } from "react";
import { CombinationId } from "../class/CombinationId";
import { IconManager, iconManager } from "../class/IconManager";
import { PortalApi, portalApi } from "../class/PortalApi";
import { router, Router } from "../class/Router";
import { storageManager, StorageManager } from "../class/StorageManager";
import { RECIPE_MODE_HYBRID } from "../const/recipeMode";
import { Route } from "../const/route";
import { SettingDetailsData, SettingMetaData, SettingOptionsData } from "../type/transfer";
import { errorStore, ErrorStore } from "./ErrorStore";

const emptySettingDetails: SettingDetailsData = {
    combinationId: "",
    name: "",
    status: "",
    isTemporary: true,
    locale: "",
    recipeMode: "",
    mods: [],
    modIconsStyle: {
        processedEntities: {},
        style: "",
    },
};

export class SettingsStore {
    private readonly errorStore: ErrorStore;
    private readonly iconManager: IconManager;
    private readonly portalApi: PortalApi;
    private readonly router: Router;
    private readonly storageManager: StorageManager;

    private currentCombinationId = "";
    private allSettingDetails = new Map<string, SettingDetailsData>();

    /** All the settings available for the current user. */
    public availableSettings: SettingMetaData[] = [];
    /** The combination id of the currently selected setting. */
    public selectedCombinationId = "";
    /** The currently selected options. */
    public selectedOptions: SettingOptionsData = {
        name: "",
        locale: "en",
        recipeMode: RECIPE_MODE_HYBRID,
    };
    /** Whether we are currently loading the setting details. */
    public isLoadingSettingDetails = false;
    /** Whether we are currently changing to a new setting. */
    public isChangingToSetting = false;
    /** Whether we are currently saving the changes. */
    public isSavingChanges = false;
    /** Whether we are currently deleting a setting. */
    public isDeletingSetting = false;

    public constructor(
        errorStore: ErrorStore,
        iconManager: IconManager,
        portalApi: PortalApi,
        router: Router,
        storageManager: StorageManager,
    ) {
        this.errorStore = errorStore;
        this.iconManager = iconManager;
        this.portalApi = portalApi;
        this.router = router;
        this.storageManager = storageManager;

        makeObservable<this, "applySelectedSetting" | "handleRouteChange">(this, {
            applySelectedSetting: action,
            availableSettings: observable,
            changeSelectedOptions: action,
            changeCombinationId: action,
            changeToSelectedSetting: action,
            handleRouteChange: action,
            isChangeButtonVisible: computed,
            isChangingToSetting: observable,
            isDeleteButtonVisible: computed,
            isDeletingSetting: observable,
            isLoadingSettingDetails: observable,
            isSaveButtonVisible: computed,
            isSavingChanges: observable,
            saveOptions: action,
            selectedOptions: observable,
            selectedSettingDetails: computed,
            selectedCombinationId: observable,
        });

        this.router.addRoute(Route.Settings, "/settings", this.handleRouteChange.bind(this));
    }

    private async handleRouteChange(): Promise<void> {
        if (!this.currentCombinationId) {
            try {
                const settingsListData = await this.portalApi.getSettings();
                runInAction((): void => {
                    this.availableSettings = settingsListData.settings.sort((left, right) => {
                        return left.name.localeCompare(right.name);
                    });
                    this.currentCombinationId = settingsListData.currentSetting.combinationId;
                    this.allSettingDetails.set(
                        settingsListData.currentSetting.combinationId,
                        settingsListData.currentSetting,
                    );
                });
            } catch (e) {
                this.errorStore.handleError(e);
            }
        }

        runInAction((): void => {
            this.selectedCombinationId = this.currentCombinationId;
            this.applySelectedSetting();
        });
    }

    /**
     * The details of the currently selected setting.
     */
    public get selectedSettingDetails(): SettingDetailsData {
        const details = this.allSettingDetails.get(this.selectedCombinationId);
        if (details) {
            return details;
        }

        return emptySettingDetails;
    }

    /**
     * Whether the change setting button must be visible.
     */
    public get isChangeButtonVisible(): boolean {
        return this.selectedSettingDetails.combinationId !== this.currentCombinationId;
    }

    /**
     * Whether the delete button must be visible.
     */
    public get isDeleteButtonVisible(): boolean {
        return this.currentCombinationId !== this.selectedSettingDetails.combinationId;
    }

    /**
     * Whether the save setting button must be visible.
     */
    public get isSaveButtonVisible(): boolean {
        const setting = this.selectedSettingDetails;

        if (this.selectedOptions.name === "") {
            return false;
        }

        return (
            setting.isTemporary ||
            setting.name !== this.selectedOptions.name ||
            setting.locale !== this.selectedOptions.locale ||
            setting.recipeMode !== this.selectedOptions.recipeMode
        );
    }

    /**
     * Changes the id of the currently selected setting.
     */
    public async changeCombinationId(combinationId: string): Promise<void> {
        if (!this.allSettingDetails.has(combinationId)) {
            this.isLoadingSettingDetails = true;
            try {
                const settingDetails = await this.portalApi.getSetting(combinationId);
                this.allSettingDetails.set(settingDetails.combinationId, settingDetails);
            } catch (e) {
                this.errorStore.handleError(e);
            }
        }

        runInAction((): void => {
            this.isLoadingSettingDetails = false;
            this.selectedCombinationId = combinationId;
            this.applySelectedSetting();
        });
    }

    /**
     * Changes the current selected options.
     */
    public changeSelectedOptions(options: Partial<SettingOptionsData>): void {
        this.selectedOptions = {
            ...this.selectedOptions,
            ...options,
        };
    }

    /**
     * Changes to the currently selected setting.
     */
    public changeToSelectedSetting(): void {
        this.isChangingToSetting = true;

        this.storageManager.clearCombination(CombinationId.fromFull(this.selectedCombinationId));
        this.router.redirectToIndex(CombinationId.fromFull(this.selectedCombinationId));
    }

    /**
     * Saves the options to the currently selected setting.
     */
    public async saveOptions(): Promise<void> {
        this.isSavingChanges = true;
        try {
            const combinationId = CombinationId.fromFull(this.selectedCombinationId);

            this.storageManager.clearCombination(combinationId);
            await this.portalApi.saveSetting(this.selectedCombinationId, this.selectedOptions);
            this.router.redirectToIndex(combinationId);
        } catch (e) {
            this.errorStore.handleError(e);
        }
    }

    /**
     * Deletes the currently selected setting.
     */
    public async deleteSelectedSetting(): Promise<void> {
        this.isDeletingSetting = true;
        try {
            this.storageManager.clearCombination(CombinationId.fromFull(this.selectedCombinationId));
            await this.portalApi.deleteSetting(this.selectedCombinationId);

            runInAction(() => {
                this.isDeletingSetting = false;
                this.availableSettings = this.availableSettings.filter(
                    (setting) => setting.combinationId !== this.selectedCombinationId,
                );
                this.allSettingDetails.delete(this.selectedCombinationId);

                this.selectedCombinationId = this.currentCombinationId;
                this.applySelectedSetting();
            });
        } catch (e) {
            this.errorStore.handleError(e);
        }
    }

    private applySelectedSetting() {
        const selectedSetting = this.selectedSettingDetails;

        this.selectedOptions.name = selectedSetting.isTemporary ? "" : selectedSetting.name;
        this.selectedOptions.locale = selectedSetting.locale;
        this.selectedOptions.recipeMode = selectedSetting.recipeMode;

        this.iconManager.addAdditionalStyle("mod-icons", selectedSetting.modIconsStyle);
    }
}

export const settingsStore = new SettingsStore(errorStore, iconManager, portalApi, router, storageManager);
export const settingsStoreContext = createContext(settingsStore);
