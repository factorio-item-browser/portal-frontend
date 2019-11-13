import {observer} from "mobx-react-lite";
import React, {useContext} from "react";

import PinnedEntityList from "./sidebar/PinnedEntityList";
import SidebarStore from "../../store/SidebarStore";
import UnpinnedEntityList from "./sidebar/UnpinnedEntityList";

import "./Sidebar.scss";

const Sidebar = () => {
    const sidebarStore = useContext(SidebarStore);

    return (
        <div className="sidebar">
            <PinnedEntityList />
            <UnpinnedEntityList />

            <button
                onClick={() => {
                    sidebarStore.addViewedEntity("fluid", "heavy-oil", "Schweröl");
                }}
            >Press me</button>
        </div>
    );
};

export default observer(Sidebar);
