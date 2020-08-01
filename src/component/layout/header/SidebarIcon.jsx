import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";

import { sidebarStoreContext } from "../../../store/SidebarStore";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the sidebar on mobile devices.
 * @returns {ReactDOM}
 * @constructor
 */
const SidebarIcon = () => {
    const sidebarStore = useContext(sidebarStoreContext);

    return (
        <div
            className="header-icon"
            onClick={() => {
                sidebarStore.openSidebar();
            }}
        >
            <FontAwesomeIcon icon={faBars} />
        </div>
    );
};

export default observer(SidebarIcon);
