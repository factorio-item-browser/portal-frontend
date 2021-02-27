import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

import "./OptionsList.scss";

type Props = {
    children: ReactNode;
};

/**
 * The component representing the list of additional options to a setting.
 */
const OptionsList: FC<Props> = ({ children }) => {
    return <div className="options-list">{children}</div>;
};

export default observer(OptionsList);
