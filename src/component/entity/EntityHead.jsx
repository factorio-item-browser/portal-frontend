// @flow

import { observer } from "mobx-react-lite";
import React from "react";
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
 * @constructor
 */
const EntityHead = ({ type, name, label }: Props): React$Node => {
    return (
        <EntityLink type={type} name={name} className="entity-head">
            <Icon type={type} name={name} />
            <h3>{label}</h3>
        </EntityLink>
    );
};

export default (observer(EntityHead): typeof EntityHead);
