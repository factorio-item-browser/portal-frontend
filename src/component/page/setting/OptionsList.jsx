import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { LOCALES, RECIPE_MODES } from "../../../helper/const";
import SettingsStore from "../../../store/SettingsStore";

import InputOption from "./InputOption";
import SelectOption from "./SelectOption";

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
            <InputOption
                label={t("settings.name.label")}
                value={settingStore.selectedOptions.name}
                onChange={(name) => settingStore.changeSettingName(name)}
                useFullWidth={true}
            />

            <SelectOption
                label={t("settings.recipe-mode.label")}
                options={buildRecipeModeOptions(t)}
                value={settingStore.selectedOptions.recipeMode}
                onChange={(recipeMode) => settingStore.changeRecipeMode(recipeMode)}
            >
                {t("settings.recipe-mode.description")}
            </SelectOption>

            <SelectOption
                label={t("settings.locale.label")}
                options={buildLocaleOptions()}
                value={settingStore.selectedOptions.locale}
                onChange={(locale) => settingStore.changeLocale(locale)}
            >
                {t("settings.locale.description")}
            </SelectOption>
        </div>
    );
};

export default observer(OptionsList);
