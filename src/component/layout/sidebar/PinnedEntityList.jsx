import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import Sortable from "react-sortablejs";

import SidebarStore from "../../../store/SidebarStore";
import TooltipStore from "../../../store/TooltipStore";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";

/**
 * The component representing the list of pinned entities in the sidebar.
 * @returns {ReactDOM|null}
 * @constructor
 */
const PinnedEntityList = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);
    const tooltipStore = useContext(TooltipStore);

    if (sidebarStore.pinnedEntities.length === 0) {
        return null;
    }

    const sortableOptions = {
        group: {
            name: "sidebar-entities",
            pull: false,
            put: true,
        },
        draggable: ".sidebar-entity",
        animation: 100,
        delay: 50,
        onStart: () => {
            tooltipStore.setDisableFlag("sidebar-pinned", true);
        },
        onEnd: () => {
            tooltipStore.setDisableFlag("sidebar-pinned", false);
        },
    };

    return (
        <Sortable
            className="sidebar-list"
            options={sortableOptions}
            onChange={(order) => {
                sidebarStore.updatePinnedOrder(order);
            }}
        >
            <h3>{t("sidebar.headline-pinned")}</h3>
            {sidebarStore.pinnedEntities.map((entity) => {
                return <SidebarEntity key={sidebarStore.getIdForEntity(entity)} entity={entity} />;
            })}
        </Sortable>
    );
};

export default observer(PinnedEntityList);
