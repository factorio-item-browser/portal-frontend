import {observer} from "mobx-react-lite";
import React, {useContext} from "react";

import SidebarStore from "../../../store/SidebarStore";

import "./SidebarCloseOverlay.scss";

/**
 * The components representing the overlay to easily close the sidebar.
 * @returns {ReactDOM|null}
 * @constructor
 */
const SidebarCloseOverlay = () => {
    const sidebarStore = useContext(SidebarStore);

    if (!sidebarStore.isSidebarOpened) {
        return null;
    }

    return (
        <div
            className="sidebar-close-overlay"
            onClick={() => {
                sidebarStore.closeSidebar()
            }}
        />
    );
};

export default observer(SidebarCloseOverlay);
