import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import SidebarEntity from "./SidebarEntity";

import "./SidebarList.scss";

/**
 * The component representing a list of entities in the sidebar.
 * @param {string} label
 * @param {SidebarEntityData[]} entities
 * @returns {ReactDOM}
 * @constructor
 */
const SidebarList = ({label, entities}) => {
    if (entities.length === 0) {
        return null;
    }

    return (
        <div className="sidebar-list">
            <h3>{label}</h3>
            {entities.map((entity) => {
                return (
                    <SidebarEntity
                        key={`${entity.type}-${entity.name}`}
                        entity={entity}
                    />
                );
            })}
        </div>
    );
};

SidebarList.propTypes = {
    label: PropTypes.string.isRequired,
    entities: PropTypes.array.isRequired,
};

export default observer(SidebarList);
