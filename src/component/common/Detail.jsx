// @flow

import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
    children: React$Node,
    hidden?: boolean,
};

/**
 * The component representing an additional detail of a details head.
 * @constructor
 */
const Detail = ({ children, hidden }: Props): React$Node => {
    if (hidden) {
        return null;
    }

    return <div className="detail">{children}</div>;
};

export default (observer(Detail): typeof Detail);
