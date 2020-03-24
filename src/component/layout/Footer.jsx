import { observer } from "mobx-react-lite";
import React from "react";
import { Trans } from "react-i18next";

import "./Footer.scss";

/**
 * The component representing the footer of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Footer = () => {
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
            </div>
        </footer>
    );
};

export default observer(Footer);
