import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import RouteStore from "../../store/RouteStore";

import "./LoadingCircle.scss";

/**
 * The component representing the loading circle when the next page is loaded.
 * @return {ReactDOM|null}
 * @constructor
 */
const LoadingCircle = () => {
    const routeStore = useContext(RouteStore);

    if (routeStore.loadingCircleTarget === null) {
        return null;
    }

    const target = routeStore.loadingCircleTarget.current;
    const rect = target.getBoundingClientRect();

    return (
        <div
            className="loading-circle"
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
