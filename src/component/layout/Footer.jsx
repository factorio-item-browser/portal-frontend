import React from "react";

import "./Footer.scss";

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
                All images are owned by <a href="https://www.factorio.com/" target="_blank" rel="nofollow">Wube Software</a>
                and the <a href="https://mods.factorio.com/" target="_blank" rel="nofollow">mod authors</a> respectively.
            </div>
        </footer>
    );
};

export default Footer;
