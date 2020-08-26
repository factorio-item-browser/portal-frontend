// @flow

import { observer } from "mobx-react-lite";
import React from "react";

type Props = {
    url: string,
    children: React$Node,
    ...
};

/**
 * The component representing a link to an external page, opening in a new tab.
 * @constructor
 */
const ExternalLink = ({ url, children, ...props }: Props): React$Node => {
    return (
        <a {...props} href={url} target="_blank" rel="noopener noreferrer nofollow">
            {children}
        </a>
    );
};

export default (observer(ExternalLink): typeof ExternalLink);
