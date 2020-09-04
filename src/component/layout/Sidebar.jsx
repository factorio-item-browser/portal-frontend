// @flow

import { faCogs } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_LARGE } from "../../const/breakpoint";
import { ROUTE_SETTINGS } from "../../const/route";
import { routeStoreContext } from "../../store/RouteStore";
import { sidebarStoreContext } from "../../store/SidebarStore";
import SidebarButton from "../button/SidebarButton";
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
const Sidebar = (): React$Node => {
    const { t } = useTranslation();
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
                <SidebarButton
                    primary
                    route={ROUTE_SETTINGS}
                    icon={faCogs}
                    label={t("sidebar.setting", { name: routeStore.setting.name })}
                />

                <PinnedEntityList />
                <UnpinnedEntityList />
            </div>
            {isLarge ? null : <SidebarCloseOverlay />}
        </>
    );
};

export default (observer(Sidebar): typeof Sidebar);
