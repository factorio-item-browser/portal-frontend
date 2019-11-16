import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Entity from "./Entity";

import "./EntityList.scss";

/**
 * The component representing a list of entity boxes.
 * @param {EntityData[]} entities
 * @returns {ReactDOM}
 * @constructor
 */
const EntityList = ({entities}) => {
    return (
        <div className="entity-list">
            {entities.map((entity, index) => {
                return (
                    <Entity
                        key={index}
                        entity={entity}
                    />
                );
            })}
        </div>
    );
};

EntityList.propTypes = {
    entities: PropTypes.array.isRequired,
};

export default observer(EntityList);
