// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import Icon from "./Icon";

import "./DetailsHead.scss";

type Props = {
    type: string,
    name: string,
    title: string,
    children?: React$Node,
};

/**
 * The component representing the head of a details page.
 * @constructor
 */
const DetailsHead = ({ type, name, title, children }: Props): React$Node => {
    return (
        <div className="details-head">
            <div className="head">
                <Icon type={type} name={name} transparent={true} />
                <h1>{title}</h1>
            </div>
            {children}
        </div>
    );
};

export default (observer(DetailsHead): typeof DetailsHead);
