import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { RECIPE_MODES } from "../../../../const/recipeMode";
import SelectOption from "./SelectOption";
import type { Item } from "./SelectOption";

type Props = {
    value: string,
    onChange: (value: string) => void,
};

/**
 * The component representing the recipe mode option.
 */
const OptionRecipeMode: FC<Props> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <SelectOption
            label={t("settings.recipe-mode.label")}
            description={t("settings.recipe-mode.description")}
            items={RECIPE_MODES.map((recipeMode: string): Item => ({
                value: recipeMode,
                label: t(`settings.recipe-mode.option.${recipeMode}`),
            }))}
            value={value}
            onChange={onChange}
        />
    );
};

export default observer(OptionRecipeMode);
