import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { globalStoreContext } from "../../../store/GlobalStore";
import { RouteName } from "../../../util/const";
import { getTranslatedSettingName } from "../../../util/setting";
import Link from "../../link/Link";

import "./SettingsLink.scss";

/**
 * The component representing the link to the settings in the big header.
 */
const SettingsLink: FC = () => {
    const globalStore = useContext(globalStoreContext);
    const { t } = useTranslation();

    return (
        <Link className="settings-link" route={RouteName.Settings}>
            <div className="link-icon">
                <FontAwesomeIcon icon={faCogs} />
            </div>
            <div className="label">{t("sidebar.setting", { name: getTranslatedSettingName(globalStore.setting) })}</div>
        </Link>
    );
};

export default observer(SettingsLink);
