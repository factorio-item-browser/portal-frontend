import React, { FC, ReactNode } from "react";
import { observer } from "mobx-react-lite";

import "./Section.scss";

type Props = {
    headline: string,
    children: ReactNode,
};

/**
 * The component representing a section with an underlined headline.
 */
const Section: FC<Props> = ({ headline, children, ...props }) => {
    return (
        <section {...props}>
            <h2>{headline}</h2>
            {children}
        </section>
    );
};

export default observer(Section);