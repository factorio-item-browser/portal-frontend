import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { numberOfRecipesPerEntity } from "../../helper/const";
import EntityLink from "../link/EntityLink";

import EntityHead from "./EntityHead";
import CompactRecipe from "./CompactRecipe";

import "./Entity.scss";

/**
 * The component representing an entity as full box.
 * @param {EntityData} entity
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {ReactDOM}
 * @constructor
 */
const Entity = ({ entity }, ref) => {
    const { t } = useTranslation();

    let moreRecipes = null;
    if (entity.numberOfRecipes > numberOfRecipesPerEntity) {
        moreRecipes = (
            <EntityLink className="more-recipes" type={entity.type} name={entity.name}>
                {t("entity.more-recipes", { count: entity.numberOfRecipes - numberOfRecipesPerEntity })}
            </EntityLink>
        );
    }

    return (
        <div className="entity" ref={ref}>
            <EntityHead type={entity.type} name={entity.name} label={entity.label} />
            {entity.recipes.map((recipe, index) => {
                return <CompactRecipe recipe={recipe} key={index} />;
            })}
            {moreRecipes}
        </div>
    );
};

Entity.propTypes = {
    entity: PropTypes.object.isRequired,
};

export default observer(Entity, { forwardRef: true });
