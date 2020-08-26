// @flow

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { sidebarStoreContext } from "../../../store/SidebarStore";

import "./HeaderIcon.scss";

/**
 * The component representing the icon for opening the sidebar on mobile devices.
 * @constructor
 */
const SidebarIcon = (): React$Node => {
    const sidebarStore = useContext(sidebarStoreContext);
    const handleClick = useCallback((): void => {
        sidebarStore.openSidebar();
    }, []);

    return (
        <div className="header-icon" onClick={handleClick}>
            <FontAwesomeIcon icon={faBars} />
        </div>
    );
};

export default (observer(SidebarIcon): typeof SidebarIcon);
