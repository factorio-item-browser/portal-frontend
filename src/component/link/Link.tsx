import { observer } from "mobx-react-lite";
import React, { createRef, FC, ReactNode, useCallback, useContext } from "react";
import { routeStoreContext } from "../../store/RouteStore";

type Props = {
    route: string;
    params?: { [key: string]: any };
    children?: ReactNode;
    [key: string]: any;
};

/**
 * The component creating a link to another route.
 */
const Link: FC<Props> = ({ route, params, children, ...props }, ref) => {
    const routeStore = useContext(routeStoreContext);
    const path = routeStore.router.buildPath(route, params);

    ref = ref || createRef();

    const handleClick = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!routeStore.router.isActive(route, params)) {
                routeStore.showLoadingCircle(ref);
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
