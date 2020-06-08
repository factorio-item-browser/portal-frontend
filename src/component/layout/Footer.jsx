import { observer } from "mobx-react-lite";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

/**
 * The component representing the footer of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Footer = () => {
    const { t } = useTranslation();

    const year = new Date().getFullYear();

    return (
        <footer>
            <div className="copyright">
                © {year} Factorio Item Browser
                <br />
                <Trans i18nKey="footer.copyright-disclaimer">
                    All content and images are owned by
                    <a href="https://www.factorio.com/" target="_blank" rel="noopener noreferrer nofollow">
                        Wube Software
                    </a>
                    and the
                    <a href="https://mods.factorio.com/" target="_blank" rel="noopener noreferrer nofollow">
                        mod authors
                    </a>
                    respectively.
                </Trans>
                <br />
                {t("footer.need-support")} <a href={process.env.DISCORD_LINK}>{t("footer.join-discord")}</a>
            </div>

            <div className="external-links">
                <a href={process.env.DISCORD_LINK} title={t("footer.join-discord")}>
                    <FontAwesomeIcon icon={faDiscord} />
                </a>
            </div>
        </footer>
    );
};

export default observer(Footer);
