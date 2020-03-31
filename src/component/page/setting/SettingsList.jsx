import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import SettingsStore from "../../../store/SettingsStore";
import SelectOption from "./SelectOption";

import "./SettingsList.scss";

/**
 * Builds the settings options.
 * @param {SettingMetaData[]} settings
 * @return {{label: string, value: string}[]}
 */
function buildSettingsOptions(settings) {
    return settings.map((setting) => {
        return {
            value: setting.id,
            label: setting.name,
        };
    });
}

/**
 * The component representing the list of available settings and options to manage those.
 * @return {ReactDOM}
 * @constructor
 */
const SettingsList = () => {
    const settingsStore = useContext(SettingsStore);
    const { t } = useTranslation();

    return (
        <div className="settings-list">
            <SelectOption
                label={t("settings.current-setting.label")}
                options={buildSettingsOptions(settingsStore.availableSettings)}
                value={settingsStore.selectedOptions.settingId}
                onChange={async (settingId) => await settingsStore.changeSettingId(settingId)}
            />
        </div>
    );
};

export default observer(SettingsList);
