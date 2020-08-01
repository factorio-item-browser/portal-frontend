import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useContext } from "react";
import { routeStoreContext } from "../../store/RouteStore";

/**
 * The component creating a link to another route.
 * @param {string} route
 * @param {Object} params
 * @param {ReactDOM} children
 * @param {any} props
 * @param {React.RefObject<HTMLElement>} ref
 * @returns {ReactDOM}
 * @constructor
 */
const Link = ({ route, params, children, ...props }, ref) => {
    const routeStore = useContext(routeStoreContext);
    const path = routeStore.buildPath(route, params);

    ref = ref || createRef();

    return (
        <a
            ref={ref}
            href={path}
            {...props}
            onClick={(event) => {
                routeStore.showLoadingCircle(ref);

                event.preventDefault();
                event.stopPropagation();
                routeStore.navigateTo(route, params);
                return false;
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

export default observer(Link, { forwardRef: true });
