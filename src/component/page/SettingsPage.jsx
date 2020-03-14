import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../store/SettingsStore";

import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import Mod from "../entity/Mod";

/**
 * The component representing the settings page.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsPage = () => {
    const settingsStore = useContext(SettingsStore);
    const { t } = useTranslation();

    return (
        <Fragment>
            <Section headline={t("settings.mod-list.headline", { count: settingsStore.settingDetails.mods.length })}>
                <EntityList>
                    {settingsStore.settingDetails.mods.map((mod) => {
                        return <Mod key={mod.name} mod={mod} />;
                    })}
                </EntityList>
            </Section>
        </Fragment>
    );
};

export default observer(SettingsPage);
