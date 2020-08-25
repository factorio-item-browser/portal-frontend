import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef } from "react";

import "./CopyTemplate.scss";

function selectText(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

/**
 * The component representing a template of some text for easy copying.
 * @param {string} label
 * @param {string} template
 * @param {string} description
 * @returns {ReactDOM}
 * @constructor
 */
const CopyTemplate = ({ label, template, description }) => {
    const templateRef = createRef();

    return (
        <div
            className="copy-template"
            onClick={() => {
                selectText(templateRef.current);
            }}
        >
            <span className="label">{label}</span>
            <span className="template" ref={templateRef}>
                {template}
            </span>
            <span className="description">{description}</span>
        </div>
    );
};

CopyTemplate.propTypes = {
    label: PropTypes.string.isRequired,
    template: PropTypes.string.isRequired,
    description: PropTypes.string,
};

export default observer(CopyTemplate);
