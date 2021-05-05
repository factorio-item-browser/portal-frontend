import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCheck, faExclamation, faInfo, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";
import { BoxStatus } from "../../util/const";

import "./Status.scss";

const ICON_MAP: { [key: string]: ReactNode } = {
    [BoxStatus.Discord]: <FontAwesomeIcon icon={faDiscord} />,
    [BoxStatus.Error]: <FontAwesomeIcon icon={faTimes} />,
    [BoxStatus.Info]: <FontAwesomeIcon icon={faInfo} />,
    [BoxStatus.Pending]: <FontAwesomeIcon icon={faSpinner} spin />,
    [BoxStatus.Success]: <FontAwesomeIcon icon={faCheck} />,
    [BoxStatus.Warning]: <FontAwesomeIcon icon={faExclamation} />,
};

type Props = {
    status: BoxStatus;
    className?: string;
    children: ReactNode;
};

/**
 * The component representing a status box.
 */
const Status: FC<Props> = ({ status, children, className }) => {
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

export default observer(Status);
