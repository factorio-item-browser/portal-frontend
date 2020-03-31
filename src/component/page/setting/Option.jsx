import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./Option.scss";

/**
 * The component representing an option of the setting.
 * @param {string} label
 * @param {ReactDOM} children
 * @param {ReactDOM} [description]
 * @param {boolean} [useFullWidth]
 * @return {ReactDOM}
 * @constructor
 */
const Option = ({ label, children, description, useFullWidth = false }) => {
    const classes = classNames({
        "option": true,
        "full-width": useFullWidth,
    });

    return (
        <div className={classes}>
            <div className="option-head">
                <h3>{label}</h3>
                {children}
            </div>
            {description ? <div className="option-description">{description}</div> : null}
        </div>
    );
};

Option.propTypes = {
    children: PropTypes.any.isRequired,
    description: PropTypes.any,
    label: PropTypes.string.isRequired,
    useFullWidth: PropTypes.bool,
};

export default observer(Option);
