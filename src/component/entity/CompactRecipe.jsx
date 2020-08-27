// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import type { RecipeData, RecipeItemData } from "../../type/transfer";
import CompactRecipeIcon from "../icon/CompactRecipeIcon";
import CompactRecipeSeparator from "./CompactRecipeSeparator";

import "./CompactRecipe.scss";

function mapItem(item: RecipeItemData, index: number): React$Node {
    return (
        <CompactRecipeIcon
            key={`${item.type}-${item.name}-${index}`}
            type={item.type}
            name={item.name}
            amount={item.amount}
        />
    );
}

type Props = {
    recipe: RecipeData,
};

/**
 * The component representing one compact recipe of an entity.
 * @constructor
 */
const CompactRecipe = ({ recipe }: Props): React$Node => {
    const { t } = useTranslation();
    const classes = classNames({
        "compact-recipe": true,
        "expensive": recipe.isExpensive,
    });

    return (
        <div className={classes}>
            {recipe.ingredients.map(mapItem)}
            <CompactRecipeSeparator craftingTime={recipe.craftingTime} />
            {recipe.products.map(mapItem)}
            {recipe.isExpensive ? <span className="mode">{t("box-label.expensive")}</span> : null}
        </div>
    );
};

export default (observer(CompactRecipe): typeof CompactRecipe);
