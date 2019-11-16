import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import Icon from "../common/Icon";

import "./EntityHead.scss";

/**
 * The component representing the head of an entity box.
 * @param {string} type
 * @param {string} name
 * @param {string} label
 * @returns {ReactDOM}
 * @constructor
 */
const EntityHead = ({type, name, label}) => {
    return (
        <div className="entity-head">
            <Icon type={type} name={name} transparent={true} />
            <h3>{label}</h3>
        </div>
    );
};

EntityHead.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default observer(EntityHead);
