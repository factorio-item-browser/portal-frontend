// @flow

import { observer } from "mobx-react-lite";
import React, { createRef } from "react";
import { useSelectClick } from "../../util/hooks";

import "./CopyTemplate.scss";

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
    const handleClick = useSelectClick(templateRef);

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
