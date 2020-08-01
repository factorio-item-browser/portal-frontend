import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactSortable } from "react-sortablejs";
import { sidebarStoreContext } from "../../../store/SidebarStore";
import { tooltipStoreContext } from "../../../store/TooltipStore";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";

/**
 * The component representing the list of pinned entities in the sidebar.
 * @returns {ReactDOM|null}
 * @constructor
 */
const PinnedEntityList = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(sidebarStoreContext);
    const tooltipStore = useContext(tooltipStoreContext);

    if (sidebarStore.pinnedEntities.length === 0) {
        return null;
    }

    const items = sidebarStore.pinnedEntities.map((entity) => {
        return {
            id: sidebarStore.getIdForEntity(entity),
            entity: entity,
        };
    });
    let orderedItemIds = [];

    return (
        <div className="sidebar-list">
            <h3>{t("sidebar.headline-pinned")}</h3>
            <ReactSortable
                list={items}
                setList={(items) => {
                    orderedItemIds = items.map((item) => item.id);
                }}
                group={{ name: "sidebar-entities", pull: false, put: true }}
                draggable=".sidebar-entity"
                animation={100}
                delay={"ontouchstart" in window ? 100 : 0}
                onStart={() => {
                    tooltipStore.setDisableFlag("sidebar-pinned", true);
                }}
                onEnd={() => {
                    tooltipStore.setDisableFlag("sidebar-pinned", false);
                }}
                onSort={() => {
                    sidebarStore.updatePinnedOrder(orderedItemIds);
                }}
            >
                {items.map((item) => {
                    return <SidebarEntity key={item.id} entity={item.entity} />;
                })}
            </ReactSortable>
        </div>
    );
};

export default observer(PinnedEntityList);
