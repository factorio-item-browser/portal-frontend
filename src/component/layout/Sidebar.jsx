import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { useMediaQuery } from "react-responsive";

import { breakpointLarge, routeFluidDetails, routeItemDetails, routeRecipeDetails } from "../../helper/const";
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
    const isMobile = useMediaQuery({ maxWidth: breakpointLarge });

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
                {isMobile ? <SidebarCloseIcon /> : null}
                <PinnedEntityList />
                <UnpinnedEntityList />

                <button
                    onClick={() => {
                        sidebarStore.addViewedEntity("fluid", "heavy-oil", "Schweröl");
                    }}
                >
                    Press me
                </button>
                <button
                    onClick={() => {
                        sidebarStore.addViewedEntity("item", "stone-brick", "Steine-Dinger");
                    }}
                >
                    Press me too
                </button>
                <button
                    onClick={async () => {
                        await routeStore.navigateTo(routeItemDetails, { name: "copper-cable" });
                    }}
                >
                    Item Details
                </button>
                <button
                    onClick={async () => {
                        await routeStore.navigateTo(routeFluidDetails, { name: "light-oil" });
                    }}
                >
                    Item Details 2
                </button>
                <button
                    onClick={async () => {
                        await routeStore.navigateTo(routeRecipeDetails, { name: "advanced-oil-processing" });
                    }}
                >
                    Recipe Details
                </button>
            </div>
            {isMobile ? <SidebarCloseOverlay /> : null}
        </Fragment>
    );
};

export default observer(Sidebar);
