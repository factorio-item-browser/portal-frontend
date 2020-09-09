// @flow

import { observer } from "mobx-react-lite";
import React, { createRef, useCallback } from "react";

import "./CopyTemplate.scss";

function selectText(element: Element): void {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}

type Props = {
    label: string,
    template: string,
    description?: string,
};

/**
 * The component representing a template of some text for easy copying.
 * @constructor
 */
const CopyTemplate = ({ label, template, description }: Props): React$Node => {
    const templateRef = createRef();

    const handleClick = useCallback(() => {
        if (templateRef.current) {
            selectText(templateRef.current);
        }
    }, [templateRef]);

    return (
        <div className="copy-template" onClick={handleClick}>
            <span className="label">{label}</span>
            <span className="template" ref={templateRef}>
                {template}
            </span>
            <span className="description">{description}</span>
        </div>
    );
};

export default (observer(CopyTemplate): typeof CopyTemplate);
