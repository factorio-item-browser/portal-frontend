import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactSortable } from "react-sortablejs";
import { sidebarStoreContext } from "../../../store/SidebarStore";
import { tooltipStoreContext } from "../../../store/TooltipStore";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";

/**
 * The component representing the list of unpinned entities in the sidebar, i.e. the last viewed entities.
 */
const UnpinnedEntityList: FC = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(sidebarStoreContext);
    const tooltipStore = useContext(tooltipStoreContext);

    if (sidebarStore.unpinnedEntities.length === 0) {
        return null;
    }

    const items = sidebarStore.unpinnedEntities.map((entity) => {
        return {
            id: sidebarStore.getIdForEntity(entity),
            entity: entity,
        };
    });

    return (
        <div className="sidebar-list">
            <h3>{t("sidebar.headline-last-viewed")}</h3>
            <ReactSortable
                list={items}
                setList={() => {
                    // Nothing to do.
                }}
                group={{ name: "sidebar-entities", pull: true, put: false }}
                sort={false}
                draggable=".sidebar-entity"
                animation={100}
                delay={"ontouchstart" in window ? 100 : 0}
                onStart={() => {
                    tooltipStore.setDisableFlag("sidebar-unpinned", true);
                }}
                onEnd={() => {
                    tooltipStore.setDisableFlag("sidebar-unpinned", false);
                }}
            >
                {items.map((item) => {
                    return <SidebarEntity key={item.id} entity={item.entity} />;
                })}
            </ReactSortable>
        </div>
    );
};

export default observer(UnpinnedEntityList);
