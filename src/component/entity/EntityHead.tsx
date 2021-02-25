import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import Icon from "../icon/Icon";
import EntityLink from "../link/EntityLink";

import "./EntityHead.scss";

type Props = {
    type: string,
    name: string,
    label: string,
};

/**
 * The component representing the head of an entity box.
 */
const EntityHead: FC<Props> = ({ type, name, label }) => {
    return (
        <EntityLink type={type} name={name} className="entity-head">
            <Icon type={type} name={name} />
            <h3>{label}</h3>
        </EntityLink>
    );
};

export default observer(EntityHead);
