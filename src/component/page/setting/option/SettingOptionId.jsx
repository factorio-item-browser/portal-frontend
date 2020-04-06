import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Option from "./Option";
import { useTranslation } from "react-i18next";

/**
 * The component representing the settings as option.
 * @param {SettingMetaData[]} settings
 * @param {string} value
 * @param {function (string): void} onChange
 * @return {ReactDOM}
 * @constructor
 */
const OptionSettingId = ({ settings, value, onChange }) => {
    const { t } = useTranslation();

    settings.slice().sort((left, right) => left.name.localeCompare(right.name));

    return (
        <Option label={t("settings.current-setting.label")} useFullWidth={true}>
            <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
                {settings.map((setting) => {
                    return (
                        <option key={setting.id} value={setting.id}>
                            {setting.name}
                        </option>
                    );
                })}
            </select>
        </Option>
    );
};

OptionSettingId.propTypes = {
    onChange: PropTypes.func.isRequired,
    settings: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(OptionSettingId);
