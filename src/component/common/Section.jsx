import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./Section.scss";

/**
 * The component representing a section with an underlined headline.
 * @param {string} headline
 * @param {ReactDOM} children
 * @returns {ReactDOM}
 * @constructor
 */
const Section = ({headline, children}) => {
    return (
        <section>
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
