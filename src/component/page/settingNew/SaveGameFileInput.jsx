import { faFileArchive } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { settingsNewStoreContext } from "../../../store/SettingsNewStore";

import "./SaveGameFileInput.scss";

/**
 * The component representing the big fat button to select a savegame file..
 * @return {ReactDOM}
 * @constructor
 */
const SaveGameFileInput = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(settingsNewStoreContext);
    const inputId = "savegame-file-input";

    return (
        <div className="savegame-file-input">
            <label htmlFor={inputId}>
                <FontAwesomeIcon icon={faFileArchive} />
                {t("settings-new.select-savegame-file")}
            </label>

            <input
                id={inputId}
                type="file"
                accept="application/zip,application/octet-stream,.zip"
                hidden={true}
                onChange={async (event) => await settingsNewStore.processSaveGame(event.currentTarget.files[0])}
            />
        </div>
    );
};

export default observer(SaveGameFileInput);
