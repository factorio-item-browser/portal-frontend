import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../store/SettingsStore";

import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";

import OptionLocale from "./setting/option/OptionLocale";
import OptionRecipeMode from "./setting/option/OptionRecipeMode";
import OptionSettingId from "./setting/option/SettingOptionId";
import OptionSettingName from "./setting/option/OptionSettingName";
import OptionsList from "./setting/option/OptionsList";
import SaveButton from "./setting/SaveButton";

/**
 * The component representing the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsPage = () => {
    const settingsStore = useContext(SettingsStore);
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("settings.title");
    }, []);

    return (
        <Fragment>
            <Section headline="Settings">
                <OptionsList>
                    <OptionSettingId
                        settings={settingsStore.availableSettings}
                        value={settingsStore.selectedOptions.settingId}
                        onChange={(settingId) => settingsStore.changeSettingId(settingId)}
                    />
                </OptionsList>
            </Section>

            <Section headline={t("settings.options.headline")}>
                <OptionsList>
                    <OptionSettingName
                        value={settingsStore.selectedOptions.name}
                        onChange={(settingName) => settingsStore.changeSettingName(settingName)}
                    />

                    <OptionRecipeMode
                        value={settingsStore.selectedOptions.recipeMode}
                        onChange={(recipeMode) => settingsStore.changeRecipeMode(recipeMode)}
                    />

                    <OptionLocale
                        value={settingsStore.selectedOptions.locale}
                        onChange={(locale) => settingsStore.changeLocale(locale)}
                    />
                </OptionsList>
            </Section>

            <Section headline={t("settings.mod-list.headline", { count: settingsStore.settingDetails.mods.length })}>
                <EntityList>
                    {settingsStore.settingDetails.mods.map((mod) => {
                        return <Mod key={mod.name} mod={mod} />;
                    })}
                </EntityList>
            </Section>

            <SaveButton />
        </Fragment>
    );
};

export default observer(SettingsPage);
