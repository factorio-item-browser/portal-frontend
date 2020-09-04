// @flow

import { faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
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
import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";
import OptionSettingId from "./setting/option/SettingOptionId";

/**
 * The component representing the settings page.
 * @constructor
 */
const SettingsPage = (): React$Node => {
    const settingsStore = useContext(settingsStoreContext);
    const { t } = useTranslation();
    const selectedSettingDetails = settingsStore.selectedSettingDetails;

    useDocumentTitle("settings.title");

    const handleSaveClick = useCallback(async (): Promise<void> => {
        await settingsStore.saveOptions();
    }, []);
    const handleDeleteClick = useCallback(async (): Promise<void> => {
        await settingsStore.deleteSelectedSetting();
    }, []);

    return (
        <>
            <Section headline={t("settings.headline.settings")}>
                <OptionsList>
                    <OptionSettingId
                        settings={settingsStore.availableSettings}
                        value={settingsStore.selectedSettingId}
                        onChange={(settingId) => settingsStore.changeSettingId(settingId)}
                        isLoading={settingsStore.isLoadingSettingDetails}
                    />
                </OptionsList>

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
                        primary
                        label={t("settings.current-setting.add-new-setting")}
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        route={ROUTE_SETTINGS_NEW}
                    />
                </ButtonGroup>
            </Section>

            <Section headline={t("settings.headline.options")}>
                <OptionsList>
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
            </Section>

            <Section headline={t("settings.headline.mod-list", { count: selectedSettingDetails.mods.length })}>
                <ModListSettingStatus setting={selectedSettingDetails} />
                <EntityList>
                    {selectedSettingDetails.mods.map((mod) => {
                        return <Mod key={mod.name} mod={mod} />;
                    })}
                </EntityList>
            </Section>

            <ActionButton
                primary
                label={t("settings.save-changes")}
                loadingLabel={t("settings.saving-changes")}
                icon={faSave}
                isVisible={settingsStore.isSaveButtonVisible}
                isLoading={settingsStore.isSavingChanges}
                onClick={handleSaveClick}
            />
        </>
    );
};

export default (observer(SettingsPage): typeof SettingsPage);
