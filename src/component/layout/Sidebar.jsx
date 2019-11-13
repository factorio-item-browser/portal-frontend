import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";

import SidebarStore from "../../store/SidebarStore";
import SidebarList from "./sidebar/SidebarList";

import "./Sidebar.scss";

const Sidebar = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);

    return (
        <div className="sidebar">
            <SidebarList
                label={t("sidebar.headline-pinned")}
                entities={sidebarStore.pinnedEntities}
            />
            <SidebarList
                label={t("sidebar.headline-last-viewed")}
                entities={sidebarStore.unpinnedEntities}
            />

            <button
                onClick={() => {
                    sidebarStore.addViewedEntity("fluid", "heavy-oil", "Schweröl");
                }}
            >Press me</button>
        </div>
    );
};

export default observer(Sidebar);
