import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./EntityList.scss";

/**
 * The component representing a list of entity boxes.
 * @param {EntityData[]} entities
 * @returns {ReactDOM}
 * @constructor
 */
const EntityList = ({children}) => {
    return (
        <div className="entity-list">
            {children}
        </div>
    );
};

EntityList.propTypes = {
    children: PropTypes.node,
};

export default observer(EntityList);
