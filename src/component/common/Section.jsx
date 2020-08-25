// @flow

import { observer } from "mobx-react-lite";
import React from "react";

import "./Section.scss";

type Props = {
    headline: string,
    children: React$Node,
    ...
};

/**
 * The component representing a section with an underlined headline.
 * @constructor
 */
const Section = ({ headline, children, ...props }: Props): React$Node => {
    return (
        <section {...props}>
            <h2>{headline}</h2>
            {children}
        </section>
    );
};

export default (observer(Section): typeof Section);
