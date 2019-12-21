import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { useContext } from "react";

import RouteStore from "../../store/RouteStore";

/**
 * The component creating a link to another route.
 * @param {string} route
 * @param {Object} params
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const Link = ({ route, params, children, ...props }) => {
    const routeStore = useContext(RouteStore);
    const path = routeStore.buildPath(route, params);

    return (
        <a
            href={path}
            {...props}
            onClick={(event) => {
                event.preventDefault();
                routeStore.navigateTo(route, params);
            }}
        >
            {children}
        </a>
    );
};

Link.propTypes = {
    route: PropTypes.string.isRequired,
    params: PropTypes.object,
    children: PropTypes.node.isRequired,
};

export default observer(Link);