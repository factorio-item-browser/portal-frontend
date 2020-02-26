import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { BREAKPOINT_LARGE } from "../../helper/const";
import RouteStore from "../../store/RouteStore";
import SidebarStore from "../../store/SidebarStore";

import PinnedEntityList from "./sidebar/PinnedEntityList";
import SidebarCloseIcon from "./sidebar/SidebarCloseIcon";
import SidebarCloseOverlay from "./sidebar/SidebarCloseOverlay";
import UnpinnedEntityList from "./sidebar/UnpinnedEntityList";

import "./Sidebar.scss";

/**
 * The component representing the sidebar of the page.
 * @returns {ReactDOM}
 * @constructor
 */
const Sidebar = () => {
    const routeStore = useContext(RouteStore);
    const sidebarStore = useContext(SidebarStore);
    const isLarge = useMediaQuery({ minWidth: BREAKPOINT_LARGE });

    const classes = classNames({
        "sidebar": true,
        "is-open": sidebarStore.isSidebarOpened,
    });

    if (routeStore.useBigHeader) {
        return null;
    }

    return (
        <Fragment>
            <div className={classes}>
                {isLarge ? null : <SidebarCloseIcon />}
                <PinnedEntityList />
                <UnpinnedEntityList />
            </div>
            {isLarge ? null : <SidebarCloseOverlay />}
        </Fragment>
    );
};

export default observer(Sidebar);
