import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./ExternalLinkIcons.scss";

const EXTERNAL_LINKS = {
    discord: process.env.DISCORD_LINK,
};
const EXTERNAL_LINK_ICONS = {
    discord: faDiscord,
};

/**
 * The component representing the icons to external pages in the footer.
 * @return {ReactDOM}
 * @constructor
 */
const ExternalLinkIcons = () => {
    const { t } = useTranslation();
    const [currentLabel, setCurrentLabel] = useState(null);

    const links = [];
    for (const [name, url] of Object.entries(EXTERNAL_LINKS)) {
        links.push(
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onMouseEnter={() => {
                    setCurrentLabel(name);
                }}
                onMouseLeave={() => {
                    setCurrentLabel(null);
                }}
            >
                <FontAwesomeIcon icon={EXTERNAL_LINK_ICONS[name]} />
            </a>
        );
    }

    return (
        <div className="external-link-icons">
            <div className="label">{currentLabel ? t(`footer.external-link.${currentLabel}`) : null}</div>
            {links}
        </div>
    );
};

export default observer(ExternalLinkIcons);
