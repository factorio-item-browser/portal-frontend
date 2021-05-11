import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";
import { RouteName } from "../../util/const";
import Link from "./Link";

type Props = {
    children: ReactNode;
    [key: string]: unknown;
};

/**
 * The component representing a link to the index page.
 */
const IndexLink: FC<Props> = ({ children, ...props }) => {
    return (
        <Link {...props} route={RouteName.Index}>
            {children}
        </Link>
    );
};

export default observer(IndexLink);
