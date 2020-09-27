// @flow

import { observer } from "mobx-react-lite";
import React from "react";

import "./EntityList.scss";

type Props = {
    children: React$Node,
};

/**
 * The component representing a list of entity boxes.
 * @constructor
 */
const EntityList = ({ children }: Props): React$Node => {
    return <div className="entity-list">{children}</div>;
};

export default (observer(EntityList): typeof EntityList);
