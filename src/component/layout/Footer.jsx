import {observer} from "mobx-react-lite";
import React from "react";

import "./Footer.scss";
import {Trans} from "react-i18next";

/**
 * The component representing the footer of the page.
 * @returns {ReactNode}
 * @constructor
 */
const Footer = () => {
    return (
        <footer>
            <div className="copyright">
                © 2019 Factorio Item Browser<br />
                <Trans i18nKey="footer.copyright-disclaimer">
                    All images are owned by
                    <a href="https://www.factorio.com/" target="_blank" rel="noopener noreferrer nofollow">Wube Software</a>
                    and the
                    <a href="https://mods.factorio.com/" target="_blank" rel="noopener noreferrer nofollow">mod authors</a>
                    respectively.
                </Trans>
            </div>
        </footer>
    );
};

export default observer(Footer);
