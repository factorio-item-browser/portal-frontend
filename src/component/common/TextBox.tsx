import React, { FC, ReactNode } from "react";
import { observer } from "mobx-react-lite";

import "./TextBox.scss";

type Props = {
    children: ReactNode,
};

/**
 * The component representing a simple text box with some explanatory text.
 */
const TextBox: FC<Props> = ({ children }) => {
    return <div className={"text-box"}>{children}</div>
};

export default observer(TextBox);