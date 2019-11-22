import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Icon from "./Icon";

import "./DetailsHead.scss";

/**
 * The component representing the head of a details page.
 * @param {string} type
 * @param {string} name
 * @param {string} title
 * @param {ReactDOM} [children]
 * @returns {ReactDOM}
 * @constructor
 */
const DetailsHead = ({ type, name, title, children }) => {
    return (
        <div className="details-head">
            <div className="head">
                <Icon type={type} name={name} transparent={true} />
                <h1>{title}</h1>
            </div>
            {children}
        </div>
    );
};

DetailsHead.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default observer(DetailsHead);
