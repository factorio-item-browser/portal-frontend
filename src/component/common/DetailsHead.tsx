import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";
import Icon from "../icon/Icon";

import "./DetailsHead.scss";

type Props = {
    type: string,
    name: string,
    title: string,
    children?: ReactNode,
};

/**
 * The component representing the head of a details page.
 */
const DetailsHead: FC<Props> = ({ type, name, title, children }) => {
    return (
        <div className="details-head">
            <div className="head">
                <Icon type={type} name={name} />
                <h1>{title}</h1>
            </div>
            {children}
        </div>
    );
};

export default observer(DetailsHead);
