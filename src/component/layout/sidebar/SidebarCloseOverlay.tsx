import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext } from "react";
import { sidebarStoreContext } from "../../../store/SidebarStore";

import "./SidebarCloseOverlay.scss";

/**
 * The components representing the overlay to easily close the sidebar.
 */
const SidebarCloseOverlay: FC = () => {
    const sidebarStore = useContext(sidebarStoreContext);
    const handleClick = useCallback((): void => {
        sidebarStore.closeSidebar();
    }, []);

    if (!sidebarStore.isSidebarOpened) {
        return null;
    }

    return <div className="sidebar-close-overlay" onClick={handleClick} />;
};

export default observer(SidebarCloseOverlay);
