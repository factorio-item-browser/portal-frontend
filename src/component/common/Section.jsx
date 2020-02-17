import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./Section.scss";

/**
 * The component representing a section with an underlined headline.
 * @param {string} headline
 * @param {ReactDOM} children
 * @param {any} props
 * @returns {ReactDOM}
 * @constructor
 */
const Section = ({ headline, children, ...props }) => {
    return (
        <section {...props}>
            <h2>{headline}</h2>
            {children}
        </section>
    );
};

Section.propTypes = {
    headline: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default observer(Section);
