// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { ROUTE_INDEX } from "../../const/route";
import Link from "./Link";

type Props = {
    children: React$Node,
    ...
};

/**
 * The component representing a link to the index page.
 * @constructor
 */
const IndexLink = ({ children, ...props }: Props): React$Node => {
    return (
        <Link {...props} route={ROUTE_INDEX}>
            {children}
        </Link>
    );
};

export default (observer(IndexLink): typeof IndexLink);
