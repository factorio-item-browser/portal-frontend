import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
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
 * @param {boolean} [withChevron]
 * @param {boolean} [isLoading]
 * @return {ReactDOM}
 * @constructor
 */
const Option = ({ label, children, description, useFullWidth = false, withChevron = false, isLoading = false }) => {
    const classes = classNames({
        "option": true,
        "full-width": useFullWidth,
    });

    let chevron = null;
    if (isLoading) {
        chevron = (
            <div className="option-chevron">
                <FontAwesomeIcon icon={faSpinner} spin />
            </div>
        );
    } else if (withChevron) {
        chevron = (
            <div className="option-chevron">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        );
    }

    return (
        <div className={classes}>
            <div className="option-head">
                <h3>{label}</h3>
                <div className="option-element">
                    {children}
                    {chevron}
                </div>
            </div>
            {description ? <div className="option-description">{description}</div> : null}
        </div>
    );
};

Option.propTypes = {
    children: PropTypes.any.isRequired,
    description: PropTypes.any,
    isLoading: PropTypes.bool,
    label: PropTypes.string.isRequired,
    useFullWidth: PropTypes.bool,
    withChevron: PropTypes.bool,
};

export default observer(Option);
