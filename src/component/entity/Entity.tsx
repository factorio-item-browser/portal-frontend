import { observer } from "mobx-react-lite";
import React, { ForwardRefRenderFunction } from "react";
import { useTranslation } from "react-i18next";
import { NUMBER_OF_RECIPES_PER_ENTITY } from "../../const/config";
import { EntityData, RecipeData } from "../../type/transfer";
import EntityLink from "../link/EntityLink";
import CompactRecipe from "./CompactRecipe";
import EntityHead from "./EntityHead";

import "./Entity.scss";

type Props = {
    entity: EntityData;
};

/**
 * The component representing an entity as full box.
 */
const Entity: ForwardRefRenderFunction<HTMLDivElement, Props> = ({ entity }, ref) => {
    const { t } = useTranslation();

    let moreRecipes = null;
    if (entity.numberOfRecipes > NUMBER_OF_RECIPES_PER_ENTITY) {
        moreRecipes = (
            <EntityLink className="more-recipes" type={entity.type} name={entity.name}>
                {t("entity.more-recipes", { count: entity.numberOfRecipes - NUMBER_OF_RECIPES_PER_ENTITY })}
            </EntityLink>
        );
    }

    return (
        <div className="entity" ref={ref}>
            <EntityHead type={entity.type} name={entity.name} label={entity.label} />
            {entity.recipes.map((recipe: RecipeData, index: number) => {
                return <CompactRecipe recipe={recipe} key={index} />;
            })}
            {moreRecipes}
        </div>
    );
};

export default observer(Entity, { forwardRef: true });
