import classNames from "classnames";
import { faCheck, faExclamation, faInfo, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import { STATUS_ERROR, STATUS_INFO, STATUS_PENDING, STATUS_SUCCESS, STATUS_WARNING } from "../../helper/const";

import "./Status.scss";

/**
 * The map of the status values to their icon.
 * @type {Object<string, ReactDOM>}
 */
const ICON_MAP = {
    [STATUS_ERROR]: <FontAwesomeIcon icon={faTimes} />,
    [STATUS_INFO]: <FontAwesomeIcon icon={faInfo} />,
    [STATUS_PENDING]: <FontAwesomeIcon icon={faSpinner} spin />,
    [STATUS_SUCCESS]: <FontAwesomeIcon icon={faCheck} />,
    [STATUS_WARNING]: <FontAwesomeIcon icon={faExclamation} />,
};

/**
 * The component representing a status box.
 * @param {string} status
 * @param {ReactDOM} children
 * @param {string} [className]
 * @return {ReactDOM}
 * @constructor
 */
const Status = ({ status, children, className }) => {
    const classes = classNames(className, {
        "status-box": true,
        [status]: true,
    });

    return (
        <div className={classes}>
            <div className="status-icon">{ICON_MAP[status]}</div>
            <div className="status-text">{children}</div>
        </div>
    );
};

Status.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    status: PropTypes.string.isRequired,
};

export default observer(Status);
