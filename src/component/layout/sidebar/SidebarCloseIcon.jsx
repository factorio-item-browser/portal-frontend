import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {observer} from "mobx-react-lite";
import React, {useContext} from "react";

import SidebarStore from "../../../store/SidebarStore";

import "./SidebarCloseIcon.scss";

/**
 * The component representing the close icon of the sidebar for mobile users.
 * @returns {ReactDOM}
 * @constructor
 */
const SidebarCloseIcon = () => {
    const sidebarStore = useContext(SidebarStore);

    return (
        <div className="sidebar-close-icon" onClick={() => {
            sidebarStore.setIsOpened(false);
        }}>
            <FontAwesomeIcon icon={faTimes} />
        </div>
    );
};

export default observer(SidebarCloseIcon);
