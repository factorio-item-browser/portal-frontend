import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import Option from "./Option";

/**
 * The component representing the setting name as option.
 * @param {string} value
 * @param {function (string): void} onChange
 * @return {ReactDOM}
 * @constructor
 */
const OptionSettingName = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <Option label={t("settings.name.label")} useFullWidth={true}>
            <input type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
        </Option>
    );
};

OptionSettingName.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(OptionSettingName);
