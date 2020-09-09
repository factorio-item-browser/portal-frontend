// @flow

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { sidebarStoreContext } from "../../../store/SidebarStore";

import "./SidebarCloseIcon.scss";

/**
 * The component representing the close icon of the sidebar for mobile users.
 * @constructor
 */
const SidebarCloseIcon = (): React$Node => {
    const sidebarStore = useContext(sidebarStoreContext);
    const handleClick = useCallback((): void => {
        sidebarStore.closeSidebar();
    }, []);

    return (
        <div
            className="sidebar-close-icon"
            onClick={handleClick}
        >
            <FontAwesomeIcon icon={faTimes} />
        </div>
    );
};

export default (observer(SidebarCloseIcon): typeof SidebarCloseIcon);
