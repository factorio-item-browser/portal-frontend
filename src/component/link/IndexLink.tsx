import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";
import { ROUTE_INDEX } from "../../const/route";
import Link from "./Link";

type Props = {
    children: ReactNode,
    [key: string]: any,
};

/**
 * The component representing a link to the index page.
 */
const IndexLink: FC<Props> = ({ children, ...props }) => {
    return (
        <Link {...props} route={ROUTE_INDEX}>
            {children}
        </Link>
    );
};

export default observer(IndexLink);
