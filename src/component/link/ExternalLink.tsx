import { observer } from "mobx-react-lite";
import React, { FC, ReactNode } from "react";

type Props = {
    url: string,
    children: ReactNode,
    [key: string]: any,
};

/**
 * The component representing a link to an external page, opening in a new tab.
 */
const ExternalLink: FC<Props> = ({ url, children, ...props }) => {
    return (
        <a {...props} href={url} target="_blank" rel="noopener noreferrer nofollow">
            {children}
        </a>
    );
};

export default observer(ExternalLink);
