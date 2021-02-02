// @flow

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FOOTER_ICONS } from "../../../const/config";
import ExternalLink from "../../link/ExternalLink";

import "./ExternalLinkIcons.scss";

/**
 * The component representing the icons to external pages in the footer.
 * @constructor
 */
const ExternalLinkIcons = (): React$Node => {
    const { t } = useTranslation();
    const [currentLabel, setCurrentLabel] = useState(null);

    const handleMouseLeave = useCallback(() => {
        setCurrentLabel(null);
    }, []);

    const links = [];
    for (const { name, url, icon } of FOOTER_ICONS) {
        const handleMouseEnter = useCallback(() => {
            setCurrentLabel(name);
        }, [name]);

        links.push(
            <ExternalLink key={name} url={url} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={icon} />
            </ExternalLink>
        );
    }

    return (
        <div className="external-link-icons">
            <div className="label">{currentLabel ? t(`footer.external-link.${currentLabel}`) : null}</div>
            {links}
        </div>
    );
};

export default (observer(ExternalLinkIcons): typeof ExternalLinkIcons);
