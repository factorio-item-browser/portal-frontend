import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../store/SettingsStore";

import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";

import OptionsList from "./setting/OptionsList";
import SettingsList from "./setting/SettingsList";
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
                <SettingsList />
            </Section>

            <Section headline={t("settings.options.headline")}>
                <OptionsList />
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
