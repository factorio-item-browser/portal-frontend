// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { Trans } from "react-i18next";
import ExternalLink from "../link/ExternalLink";
import ExternalLinkIcons from "./footer/ExternalLinkIcons";

import "./Footer.scss";

const year = new Date().getFullYear();

/**
 * The component representing the footer of the page.
 * @constructor
 */
const Footer = (): React$Node => {
    return (
        <footer>
            <div className="copyright">
                © {year} Factorio Item Browser
                <br />
                <Trans i18nKey="footer.copyright-disclaimer">
                    All content and images are owned by
                    <ExternalLink url="https://www.factorio.com/">Wube Software</ExternalLink>
                    and the
                    <ExternalLink url="https://mods.factorio.com/">mod authors</ExternalLink>
                    respectively.
                </Trans>
            </div>

            <ExternalLinkIcons />
        </footer>
    );
};

export default (observer(Footer): typeof Footer);
