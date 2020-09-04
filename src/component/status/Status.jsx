// @flow

import { faCheck, faExclamation, faInfo, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React from "react";
import { STATUS_ERROR, STATUS_INFO, STATUS_PENDING, STATUS_SUCCESS, STATUS_WARNING } from "../../const/status";

import "./Status.scss";

const ICON_MAP = {
    [STATUS_ERROR]: <FontAwesomeIcon icon={faTimes} />,
    [STATUS_INFO]: <FontAwesomeIcon icon={faInfo} />,
    [STATUS_PENDING]: <FontAwesomeIcon icon={faSpinner} spin />,
    [STATUS_SUCCESS]: <FontAwesomeIcon icon={faCheck} />,
    [STATUS_WARNING]: <FontAwesomeIcon icon={faExclamation} />,
};

type Props = {
    status: string,
    className?: string,
    children: React$Node,
};

/**
 * The component representing a status box.
 * @constructor
 */
const Status = ({ status, children, className }: Props): React$Node => {
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

export default (observer(Status): typeof Status);
