import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import Icon from "../common/Icon";

import "./EntityHead.scss";
import EntityLink from "../link/EntityLink";

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
        <EntityLink type={type} name={name} className="entity-head">
            <Icon type={type} name={name} transparent={true} />
            <h3>{label}</h3>
        </EntityLink>
    );
};

EntityHead.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default observer(EntityHead);
