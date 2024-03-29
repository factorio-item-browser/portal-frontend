import { faThumbtack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC, ReactNode, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SidebarEntityData } from "../../../api/transfer";
import { iconStoreContext } from "../../../store/IconStore";
import { sidebarStoreContext } from "../../../store/SidebarStore";
import { tooltipStoreContext } from "../../../store/TooltipStore";
import Icon from "../../icon/Icon";
import EntityLink from "../../link/EntityLink";

import "./SidebarEntity.scss";

function renderPinAction(entity: SidebarEntityData): ReactNode {
    const { t } = useTranslation();
    const sidebarStore = useContext(sidebarStoreContext);

    return (
        <div
            className="action"
            title={t("sidebar.action-pin")}
            onClick={(event) => {
                sidebarStore.pinEntity(entity);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }}
        >
            <FontAwesomeIcon icon={faThumbtack} />
        </div>
    );
}

function renderUnpinAction(entity: SidebarEntityData): ReactNode {
    const { t } = useTranslation();
    const sidebarStore = useContext(sidebarStoreContext);

    return (
        <div
            className="action"
            title={t("sidebar.action-unpin")}
            onClick={(event) => {
                sidebarStore.unpinEntity(entity);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </div>
    );
}

type Props = {
    entity: SidebarEntityData;
};

/**
 * The component representing a single entity in the sidebar.
 */
const SidebarEntity: FC<Props> = ({ entity }) => {
    const { t } = useTranslation();
    const iconStore = useContext(iconStoreContext);
    const sidebarStore = useContext(sidebarStoreContext);
    const tooltipStore = useContext(tooltipStoreContext);

    const iconRef = useRef<HTMLDivElement>(null);
    const entityId = sidebarStore.buildIdForEntity(entity);
    const highlightedEntity = iconStore.highlightedEntity;
    const classes = classNames({
        "sidebar-entity": true,
        "highlighted": entity.type === highlightedEntity.type && entity.name === highlightedEntity.name,
    });

    return (
        <EntityLink
            type={entity.type}
            name={entity.name}
            className={classes}
            draggable={true}
            data-id={entityId}
            onMouseEnter={async () => {
                await tooltipStore.showTooltip(iconRef, entity.type, entity.name);
            }}
            onMouseLeave={() => {
                tooltipStore.hideTooltip();
            }}
        >
            <Icon type={entity.type} name={entity.name} ref={iconRef} />
            <span className="label">{entity.label || entity.name}</span>

            {entity.pinnedPosition > 0 ? renderUnpinAction(entity) : renderPinAction(entity)}
            <div className="type">{t(`box-label.${entity.type}`)}</div>
        </EntityLink>
    );
};

export default observer(SidebarEntity);
