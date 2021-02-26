import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

import "./EntityList.scss";

type Props = {
    children: ReactNode;
};

/**
 * The component representing a list of entity boxes.
 */
const EntityList: FC<Props> = ({ children }) => {
    return <div className="entity-list">{children}</div>;
};

export default observer(EntityList);
