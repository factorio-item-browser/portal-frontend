import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, {createRef} from "react";

import {selectText} from "../../helper/utils";

import "./CopyTemplate.scss";

/**
 * The component representing a template of some text for easy copying.
 * @param {string} label
 * @param {string} template
 * @param {string} description
 * @returns {ReactDOM}
 * @constructor
 */
const CopyTemplate = ({label, template, description}) => {
    const templateRef = createRef();

    return (
        <div
            className="copy-template"
            title={description}
            onClick={() => {
                selectText(templateRef.current);
            }}
        >
            <span className="label">{label}</span>
            <span className="template" ref={templateRef}>{template}</span>
        </div>
    );
};

CopyTemplate.propTypes = {
    label: PropTypes.string.isRequired,
    template: PropTypes.string.isRequired,
    description: PropTypes.string,
};

export default observer(CopyTemplate);
