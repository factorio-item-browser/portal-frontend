import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { RECIPE_MODES } from "../../../../helper/const";
import Option from "./Option";

/**
 * The component representing the recipe mode option.
 * @param {string} value
 * @param {function (string): void} onChange
 * @return {ReactDOM}
 * @constructor
 */
const OptionRecipeMode = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <Option
            label={t("settings.recipe-mode.label")}
            description={t("settings.recipe-mode.description")}
            withChevron={true}
        >
            <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
                {RECIPE_MODES.map((recipeMode) => {
                    return (
                        <option key={recipeMode} value={recipeMode}>
                            {t(`settings.recipe-mode.option.${recipeMode}`)}
                        </option>
                    );
                })}
            </select>
        </Option>
    );
};

OptionRecipeMode.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(OptionRecipeMode);
