import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext } from "react";
import { sidebarStoreContext } from "../../../store/SidebarStore";

import "./SidebarCloseIcon.scss";

type Props = {
}

/**
 * The component representing the close icon of the sidebar for mobile users.
 */
const SidebarCloseIcon: FC<Props> = () => {
    const sidebarStore = useContext(sidebarStoreContext);
    const handleClick = useCallback((): void => {
        sidebarStore.closeSidebar();
    }, []);

    return (
        <div className="sidebar-close-icon" onClick={handleClick}>
            <FontAwesomeIcon icon={faTimes} />
        </div>
    );
};

export default observer(SidebarCloseIcon);
