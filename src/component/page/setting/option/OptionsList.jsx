// @flow

import { observer } from "mobx-react-lite";
import React from "react";

import "./OptionsList.scss";

type Props = {
    children: React$Node,
};

/**
 * The component representing the list of additional options to a setting.
 * @constructor
 */
const OptionsList = ({ children }: Props): React$Node => {
    return <div className="options-list">{children}</div>;
};

export default (observer(OptionsList): typeof OptionsList);
