// @flow

import { observer } from "mobx-react-lite";
import React from "react";

import "./TextBox.scss";

type Props = {
    children: React$Node,
};

/**
 * The component representing a simple text box with some explanatory text.
 * @constructor
 */
const TextBox = ({ children }: Props): React$Node => {
    return <div className="text-box">{children}</div>;
};

export default (observer(TextBox): typeof TextBox);
