// @flow

import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_LARGE } from "../../const/breakpoint";
import { routeStoreContext } from "../../store/RouteStore";
import { sidebarStoreContext } from "../../store/SidebarStore";
import PinnedEntityList from "./sidebar/PinnedEntityList";
import SettingsButton from "./sidebar/SettingsButton";
import SidebarCloseIcon from "./sidebar/SidebarCloseIcon";
import SidebarCloseOverlay from "./sidebar/SidebarCloseOverlay";
import UnpinnedEntityList from "./sidebar/UnpinnedEntityList";

import "./Sidebar.scss";

/**
 * The component representing the sidebar of the page.
 * @returns {ReactDOM}
 * @constructor
 */
const Sidebar = (): React$Node => {
    const routeStore = useContext(routeStoreContext);
    const sidebarStore = useContext(sidebarStoreContext);
    const isLarge = useMediaQuery({ minWidth: BREAKPOINT_LARGE });

    const classes = classNames({
        "sidebar": true,
        "is-open": sidebarStore.isSidebarOpened,
    });

    if (routeStore.useBigHeader) {
        return null;
    }

    return (
        <>
            <div className={classes}>
                {isLarge ? null : <SidebarCloseIcon />}
                <SettingsButton />

                <PinnedEntityList />
                <UnpinnedEntityList />
            </div>
            {isLarge ? null : <SidebarCloseOverlay />}
        </>
    );
};

export default (observer(Sidebar): typeof Sidebar);
