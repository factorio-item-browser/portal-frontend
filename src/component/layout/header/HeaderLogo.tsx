import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import IndexLink from "../../link/IndexLink";

// @ts-ignore
import logo from "../../../image/logo.png";

import "./HeaderLogo.scss";

type Props = {
}

/**
 * The component representing the main header logo.
 */
const HeaderLogo: FC<Props> = () => {
    return (
        <IndexLink className="header-logo">
            <img src={logo} alt="Factorio Item Browser" />
        </IndexLink>
    );
};

export default observer(HeaderLogo);
