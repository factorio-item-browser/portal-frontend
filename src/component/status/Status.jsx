import classNames from "classnames";
import { faCheck, faExclamation, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import { STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS, STATUS_WARNING } from "../../helper/const";

import "./Status.scss";

/**
 * The map of the status values to their icon.
 * @type {Object<string, ReactDOM>}
 */
const ICON_MAP = {
    [STATUS_ERROR]: <FontAwesomeIcon icon={faTimes} />,
    [STATUS_PENDING]: <FontAwesomeIcon icon={faSpinner} spin />,
    [STATUS_SUCCESS]: <FontAwesomeIcon icon={faCheck} />,
    [STATUS_WARNING]: <FontAwesomeIcon icon={faExclamation} />,
};

/**
 * The component representing a status box.
 * @param {string} status
 * @param {ReactDOM} children
 * @return {ReactDOM}
 * @constructor
 */
const Status = ({ status, children }) => {
    const classes = classNames({
        "status-box": true,
        [status]: true,
    });

    return (
        <div className={classes}>
            <div className="status-icon">{ICON_MAP[status]}</div>
            <div className="status-text">
                {children}
            </div>
        </div>
    );
};

Status.propTypes = {
    children: PropTypes.node.isRequired,
    status: PropTypes.string.isRequired,
};

export default observer(Status);
