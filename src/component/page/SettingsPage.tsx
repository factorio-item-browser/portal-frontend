import { faArrowRight, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ROUTE_SETTINGS_NEW } from "../../const/route";
import { settingsStoreContext } from "../../store/SettingsStore";
import { useDocumentTitle } from "../../util/hooks";
import ActionButton from "../button/ActionButton";
import ButtonGroup from "../button/ButtonGroup";
import LinkedButton from "../button/LinkedButton";
import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";
import ModListSettingStatus from "../status/ModListSettingStatus";
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
    const selectedSettingDetails = settingsStore.selectedSettingDetails;
    const isTemporary = selectedSettingDetails.isTemporary;
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
                        settings={settingsStore.availableSettings}
                        value={settingsStore.selectedCombinationId}
                        onChange={(settingId) => settingsStore.changeCombinationId(settingId)}
                        loading={settingsStore.isLoadingSettingDetails}
                    />
                </OptionsList>

                <ActionButton
                    primary
                    spacing
                    label={t("settings.change-to-setting", { name: selectedSettingDetails.name })}
                    loadingLabel={t("settings.changing-to-setting", { name: selectedSettingDetails.name })}
                    icon={faArrowRight}
                    isVisible={settingsStore.isChangeButtonVisible}
                    isLoading={settingsStore.isChangingToSetting}
                    onClick={handleChangeToSettingClick}
                />
                <ButtonGroup right spacing>
                    <ActionButton
                        label={t("settings.current-setting.delete-setting", { name: selectedSettingDetails.name })}
                        loadingLabel={t("settings.current-setting.deleting-setting", {
                            name: selectedSettingDetails.name,
                        })}
                        icon={faMinus}
                        isVisible={settingsStore.isDeleteButtonVisible}
                        isLoading={settingsStore.isDeletingSetting}
                        onClick={handleDeleteClick}
                    />

                    <LinkedButton
                        label={t("settings.current-setting.add-new-setting")}
                        icon={faPlus}
                        route={ROUTE_SETTINGS_NEW}
                    />
                </ButtonGroup>
            </Section>

            <Section
                headline={t(isTemporary ? "settings.headline.options-temporary" : "settings.headline.options", {
                    name: selectedSettingDetails.name,
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
                            name: selectedSettingDetails.name,
                        })}
                        loadingLabel={t(
                            areOptionsChanged ? "settings.saving-and-changing" : "settings.saving-options",
                            {
                                name: selectedSettingDetails.name,
                            },
                        )}
                        icon={faSave}
                        isVisible={settingsStore.isSaveButtonVisible}
                        isLoading={settingsStore.isSavingChanges}
                        onClick={handleSaveClick}
                    />
                )}
            </Section>

            <Section
                headline={t(isTemporary ? "settings.headline.mod-list-temporary" : "settings.headline.mod-list", {
                    count: selectedSettingDetails.mods.length,
                    name: selectedSettingDetails.name,
                })}
            >
                <ModListSettingStatus setting={selectedSettingDetails} />
                <EntityList>
                    {selectedSettingDetails.mods.map((mod) => {
                        return <Mod key={mod.name} mod={mod} />;
                    })}
                </EntityList>
            </Section>
        </>
    );
};

export default observer(SettingsPage);
