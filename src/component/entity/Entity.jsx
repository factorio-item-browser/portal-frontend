import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import EntityHead from "./EntityHead";
import CompactRecipe from "./CompactRecipe";

import "./Entity.scss";

/**
 * The component representing an entity as full box.
 * @param {EntityData} entity
 * @returns {ReactDOM}
 * @constructor
 */
const Entity = ({ entity }) => {
    return (
        <div className="entity">
            <EntityHead type={entity.type} name={entity.name} label={entity.label} />
            {entity.recipes.map((recipe, index) => {
                return <CompactRecipe recipe={recipe} key={index} />;
            })}
        </div>
    );
};

Entity.propTypes = {
    entity: PropTypes.object.isRequired,
};

export default observer(Entity);
