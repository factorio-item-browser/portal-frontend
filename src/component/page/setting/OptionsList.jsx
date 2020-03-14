import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { LOCALES, RECIPE_MODES } from "../../../helper/const";
import SettingsStore from "../../../store/SettingsStore";

import Option from "./Option";

import "./OptionsList.scss";

/**
 * Builds the options for the locale element.
 * @return {{label: string, value: string}[]}
 */
function buildLocaleOptions() {
    const options = [];
    for (const [locale, label] of Object.entries(LOCALES)) {
        options.push({
            value: locale,
            label: label,
        });
    }
    options.sort((left, right) => {
        return left.label.localeCompare(right.label);
    });
    return options;
}

/**
 * Builds the options for the recipe mode element.
 * @param {TFunction} t
 * @return {{label: string, value: string}[]}
 */
function buildRecipeModeOptions(t) {
    return RECIPE_MODES.map((recipeMode) => {
        return {
            value: recipeMode,
            label: t(`settings.recipe-mode.option.${recipeMode}`),
        };
    });
}

/**
 * The component representing the list of additional options to a setting.
 * @return {ReactDOM}
 * @constructor
 */
const OptionsList = () => {
    const settingStore = useContext(SettingsStore);
    const { t } = useTranslation();

    return (
        <div className="options-list">
            <Option
                label={t("settings.recipe-mode.label") + ":"}
                description={t("settings.recipe-mode.description")}
                options={buildRecipeModeOptions(t)}
                value={settingStore.selectedRecipeMode}
                onChange={(recipeMode) => settingStore.changeRecipeMode(recipeMode)}
            />

            <Option
                label={t("settings.locale.label") + ":"}
                description={t("settings.locale.description")}
                options={buildLocaleOptions()}
                value={settingStore.selectedLocale}
                onChange={(locale) => settingStore.changeLocale(locale)}
            />
        </div>
    );
};

export default observer(OptionsList);
