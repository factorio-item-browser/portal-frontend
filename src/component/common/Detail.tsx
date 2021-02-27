import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

type Props = {
    children: ReactNode;
    hidden?: boolean;
};

/**
 * The component representing an additional detail of a details head.
 */
const Detail: FC<Props> = ({ children, hidden }) => {
    if (hidden) {
        return null;
    }

    return <div className="detail">{children}</div>;
};

export default observer(Detail);
