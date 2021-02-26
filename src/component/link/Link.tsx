import { observer } from "mobx-react-lite";
import React, { ForwardRefRenderFunction, ReactNode, useCallback, useContext, useRef } from "react";
import { routeStoreContext } from "../../store/RouteStore";

type Props = {
    route: string;
    params?: { [key: string]: any };
    children?: ReactNode;
    [key: string]: unknown;
};

/**
 * The component creating a link to another route.
 */
const Link: ForwardRefRenderFunction<HTMLAnchorElement, Props> = ({ route, params, children, ...props }, ref) => {
    const routeStore = useContext(routeStoreContext);
    const path = routeStore.router.buildPath(route, params);

    ref = ref || useRef<HTMLAnchorElement>(null);

    const handleClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!routeStore.router.isActive(route, params)) {
                if (ref && "current" in ref) {
                    routeStore.showLoadingCircle(ref);
                }
                routeStore.router.navigateTo(route, params);
            }
            return false;
        },
        [route, params, ref],
    );

    return (
        <a {...props} ref={ref} href={path} onClick={handleClick}>
            {children}
        </a>
    );
};

export default observer(Link, { forwardRef: true });
