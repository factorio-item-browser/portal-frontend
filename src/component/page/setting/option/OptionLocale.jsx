import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { LOCALES } from "../../../../helper/const";
import Option from "./Option";

/**
 * The component representing the locale as option.
 * @param {string} value
 * @param {function (string): void} onChange
 * @return {ReactDOM}
 * @constructor
 */
const OptionLocale = ({ value, onChange }) => {
    const { t } = useTranslation();

    const locales = Object.entries(LOCALES);
    locales.sort(([, leftLabel], [, rightLabel]) => leftLabel.localeCompare(rightLabel));

    return (
        <Option label={t("settings.locale.label")} description={t("settings.locale.description")} withChevron={true}>
            <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
                {locales.map(([locale, label]) => {
                    return (
                        <option key={locale} value={locale}>
                            {label}
                        </option>
                    );
                })}
            </select>
        </Option>
    );
};

OptionLocale.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(OptionLocale);
