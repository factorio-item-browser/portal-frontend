import { faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../store/SettingsStore";
import { ROUTE_SETTINGS_NEW } from "../../helper/const";

import ButtonLink from "../link/ButtonLink";
import ButtonList from "./setting/ButtonList";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";
import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingId from "./setting/option/SettingOptionId";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";
import Section from "../common/Section";
import ModListSettingStatus from "../status/ModListSettingStatus";
import ActionButton from "../common/ActionButton";

/**
 * The component representing the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsPage = () => {
    const settingsStore = useContext(SettingsStore);
    const { t } = useTranslation();

    const selectedSettingDetails = settingsStore.selectedSettingDetails;

    useEffect(() => {
        document.title = t("settings.title");
    }, []);

    return (
        <Fragment>
            <Section headline={t("settings.headline.settings")}>
                <OptionsList>
                    <OptionSettingId
                        settings={settingsStore.availableSettings}
                        value={settingsStore.selectedSettingId}
                        onChange={(settingId) => settingsStore.changeSettingId(settingId)}
                        isLoading={settingsStore.isLoadingSettingDetails}
                    />
                </OptionsList>

                <ButtonList right>
                    <ActionButton
                        label={t("settings.current-setting.delete-setting", { name: selectedSettingDetails.name })}
                        loadingLabel={t("settings.current-setting.deleting-setting", {
                            name: selectedSettingDetails.name,
                        })}
                        icon={faMinus}
                        isVisible={settingsStore.isDeleteButtonVisible}
                        isLoading={settingsStore.isDeletingSetting}
                        onClick={async () => {
                            await settingsStore.deleteSelectedSetting();
                        }}
                    />
                    <ButtonLink primary route={ROUTE_SETTINGS_NEW}>
                        <FontAwesomeIcon icon={faPlus} />
                        {t("settings.current-setting.add-new-setting")}
                    </ButtonLink>
                </ButtonList>
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
                spacing
                sticky
                label={t("settings.save-changes")}
                loadingLabel={t("settings.saving-changes")}
                icon={faSave}
                isVisible={settingsStore.isSaveButtonVisible}
                isLoading={settingsStore.isSavingChanges}
                onClick={async () => {
                    await settingsStore.saveOptions();
                }}
            />
        </Fragment>
    );
};

export default observer(SettingsPage);
