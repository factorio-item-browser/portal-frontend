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

    if (!sidebarStore.isOpened) {
        return null;
    }

    return (
        <div
            className="sidebar-close-overlay"
            onClick={() => {
                sidebarStore.close()
            }}
        />
    );
};

export default observer(SidebarCloseOverlay);
