import { observer } from "mobx-react-lite";
import React, { FC, useRef } from "react";
import { useSelectClick } from "../../util/hooks";

import "./CopyTemplate.scss";

type Props = {
    label: string;
    template: string;
    description: string;
};

/**
 * The component representing a template of some text for easy copying.
 */
const CopyTemplate: FC<Props> = ({ label, template, description }) => {
    const templateRef = useRef<HTMLSpanElement>(null);
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

export default observer(CopyTemplate);
