import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, RefObject } from "react";

import "./LoadingCircle.scss";

type Props = {
    target: RefObject<Element> | null;
};

/**
 * The component representing a loading circle above the target element.
 */
const LoadingCircle: FC<Props> = ({ target }) => {
    if (!target || !target.current) {
        return null;
    }

    const rect = target.current.getBoundingClientRect();
    return (
        <div
            className={"loading-circle"}
            style={{
                height: rect.height,
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                width: rect.width,
            }}
        >
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    );
};

export default observer(LoadingCircle);
