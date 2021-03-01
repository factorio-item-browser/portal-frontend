import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { RecipeMode } from "../../../../util/const";
import SelectOption, { Item } from "./SelectOption";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

/**
 * The component representing the recipe mode option.
 */
const OptionRecipeMode: FC<Props> = ({ value, onChange }) => {
    const { t } = useTranslation();

    const items: Item[] = [];
    for (const recipeMode of Object.values(RecipeMode)) {
        items.push({
            value: recipeMode,
            label: t(`settings.recipe-mode.option.${recipeMode}`),
        });
    }

    return (
        <SelectOption
            label={t("settings.recipe-mode.label")}
            description={t("settings.recipe-mode.description")}
            items={items}
            value={value}
            onChange={onChange}
        />
    );
};

export default observer(OptionRecipeMode);
