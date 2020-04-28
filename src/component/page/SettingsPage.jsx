import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../store/SettingsStore";
import { ROUTE_SETTINGS_NEW } from "../../helper/const";

import ButtonLink from "../link/ButtonLink";
import ButtonList from "./setting/ButtonList";
import Button from "../common/Button";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";
import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingId from "./setting/option/SettingOptionId";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";
import SaveButton from "./setting/SaveButton";
import Section from "../common/Section";
import ModListSettingStatus from "../status/ModListSettingStatus";

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

    let deleteButton = null;
    if (settingsStore.isDeleteButtonVisible) {
        deleteButton = (
            <Button
                onClick={async () => {
                    await settingsStore.deleteSelectedSetting();
                }}
            >
                <FontAwesomeIcon icon={faMinus} />
                Delete setting &quot;{selectedSettingDetails.name}&quot;
            </Button>
        );
    }

    return (
        <Fragment>
            <Section headline="Settings">
                <OptionsList>
                    <OptionSettingId
                        settings={settingsStore.availableSettings}
                        value={settingsStore.selectedSettingId}
                        onChange={(settingId) => settingsStore.changeSettingId(settingId)}
                    />
                </OptionsList>

                <ButtonList right>
                    {deleteButton}
                    <ButtonLink primary route={ROUTE_SETTINGS_NEW}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add new setting
                    </ButtonLink>
                </ButtonList>
            </Section>

            <Section headline={t("settings.options.headline")}>
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

            <Section headline={t("settings.mod-list.headline", { count: selectedSettingDetails.mods.length })}>
                <ModListSettingStatus setting={selectedSettingDetails} />
                <EntityList>
                    {selectedSettingDetails.mods.map((mod) => {
                        return <Mod key={mod.name} mod={mod} />;
                    })}
                </EntityList>
            </Section>

            <SaveButton />
        </Fragment>
    );
};

export default observer(SettingsPage);
