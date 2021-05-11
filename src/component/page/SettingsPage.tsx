import { faArrowRight, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsStoreContext } from "../../store/SettingsStore";
import { RouteName } from "../../util/const";
import { useDocumentTitle } from "../../util/hooks";
import ActionButton from "../button/ActionButton";
import ButtonGroup from "../button/ButtonGroup";
import LinkedButton from "../button/LinkedButton";
import Section from "../common/Section";
import SelectedSettingStatus from "../status/SelectedSettingStatus";
import ModList from "./setting/ModList";
import OptionCombinationId from "./setting/option/OptionCombinationId";
import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingId from "./setting/option/OptionSettingId";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";

/**
 * The component representing the settings page.
 */
const SettingsPage: FC = () => {
    const settingsStore = useContext(settingsStoreContext);
    const { t } = useTranslation();
    const selectedSetting = settingsStore.selectedSetting;
    const isTemporary = selectedSetting.isTemporary;
    const areOptionsChanged = settingsStore.isChangeButtonVisible;

    useDocumentTitle("settings.title");

    const handleChangeToSettingClick = useCallback((): void => {
        settingsStore.changeToSelectedSetting();
    }, []);
    const handleDeleteClick = useCallback(async (): Promise<void> => {
        await settingsStore.deleteSelectedSetting();
    }, []);
    const handleSaveClick = useCallback(async (): Promise<void> => {
        await settingsStore.saveOptions();
    }, []);

    return (
        <>
            <Section headline={t("settings.headline.settings")}>
                <OptionsList>
                    <OptionSettingId
                        settings={settingsStore.settings}
                        value={settingsStore.selectedCombinationId}
                        onChange={(settingId) => settingsStore.changeCombinationId(settingId)}
                        loading={settingsStore.isLoadingMods}
                    />
                </OptionsList>

                <SelectedSettingStatus setting={selectedSetting} />

                <ActionButton
                    primary
                    spacing
                    label={t("settings.change-to-setting", { name: selectedSetting.name })}
                    loadingLabel={t("settings.changing-to-setting", { name: selectedSetting.name })}
                    icon={faArrowRight}
                    isVisible={settingsStore.isChangeButtonVisible}
                    isLoading={settingsStore.isChangingToSetting}
                    onClick={handleChangeToSettingClick}
                />
                <ButtonGroup right spacing>
                    <ActionButton
                        label={t("settings.current-setting.delete-setting", { name: selectedSetting.name })}
                        loadingLabel={t("settings.current-setting.deleting-setting", {
                            name: selectedSetting.name,
                        })}
                        icon={faMinus}
                        isVisible={settingsStore.isDeleteButtonVisible}
                        isLoading={settingsStore.isDeletingSetting}
                        onClick={handleDeleteClick}
                    />

                    <LinkedButton
                        label={t("settings.current-setting.add-new-setting")}
                        icon={faPlus}
                        route={RouteName.SettingsNew}
                    />
                </ButtonGroup>
            </Section>

            <Section
                headline={t(isTemporary ? "settings.headline.options-temporary" : "settings.headline.options", {
                    name: selectedSetting.name,
                })}
            >
                <OptionsList>
                    <OptionCombinationId value={settingsStore.selectedCombinationId} />

                    <OptionSettingName
                        value={settingsStore.selectedOptions.name}
                        onChange={(name) => settingsStore.changeSelectedOptions({ name })}
                    />

                    <OptionRecipeMode
                        value={settingsStore.selectedOptions.recipeMode}
                        onChange={(recipeMode) => settingsStore.changeSelectedOptions({ recipeMode })}
                    />

                    <OptionLocale
                        value={settingsStore.selectedOptions.locale}
                        onChange={(locale) => settingsStore.changeSelectedOptions({ locale })}
                    />
                </OptionsList>

                {isTemporary ? (
                    <ActionButton
                        primary
                        spacing
                        label={t("settings.add-temporary")}
                        loadingLabel={t("settings.adding-temporary")}
                        icon={faPlus}
                        isVisible={settingsStore.isSaveButtonVisible}
                        isLoading={settingsStore.isSavingChanges}
                        onClick={handleSaveClick}
                    />
                ) : (
                    <ActionButton
                        primary
                        spacing
                        label={t(areOptionsChanged ? "settings.save-and-change" : "settings.save-options", {
                            name: selectedSetting.name,
                        })}
                        loadingLabel={t(
                            areOptionsChanged ? "settings.saving-and-changing" : "settings.saving-options",
                            {
                                name: selectedSetting.name,
                            },
                        )}
                        icon={faSave}
                        isVisible={settingsStore.isSaveButtonVisible}
                        isLoading={settingsStore.isSavingChanges}
                        onClick={handleSaveClick}
                    />
                )}
            </Section>

            <ModList />
        </>
    );
};

export default observer(SettingsPage);
