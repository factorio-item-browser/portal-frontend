import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import Sortable from "react-sortablejs";
import { useTranslation } from "react-i18next";

import SidebarStore from "../../../store/SidebarStore";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";
import TooltipStore from "../../../store/TooltipStore";

/**
 * The component representing the list of unpinned entities in the sidebar, i.e. the last viewed entities.
 * @returns {ReactDOM|null}
 * @constructor
 */
const UnpinnedEntityList = () => {
    const { t } = useTranslation();
    const sidebarStore = useContext(SidebarStore);
    const tooltipStore = useContext(TooltipStore);

    const sortableOptions = {
        group: {
            name: "sidebar-entities",
            pull: true,
            put: false,
        },
        sort: false,
        draggable: ".sidebar-entity",
        animation: 100,
        onStart: () => {
            tooltipStore.setDisableFlag("sidebar-unpinned", true);
        },
        onEnd: () => {
            tooltipStore.setDisableFlag("sidebar-unpinned", false);
        },
    };
    const entities = sidebarStore.unpinnedEntities;

    if (entities.length === 0) {
        return null;
    }

    return (
        <Sortable className="sidebar-list" options={sortableOptions} onChange={() => {}}>
            <h3>{t("sidebar.headline-last-viewed")}</h3>
            {sidebarStore.unpinnedEntities.map((entity) => {
                return <SidebarEntity key={sidebarStore.getIdForEntity(entity)} entity={entity} />;
            })}
        </Sortable>
    );
};

export default observer(UnpinnedEntityList);
