// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";
import type { LoadingCircleRef } from "../../store/RouteStore";

import "./LoadingCircle.scss";

type Props = {
    target: ?LoadingCircleRef,
};

/**
 * The component representing a loading circle above the target element.
 * @constructor
 */
const LoadingCircle = ({ target }: Props): React$Node => {
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

export default (observer(LoadingCircle): typeof LoadingCircle);
