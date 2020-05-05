import classNames from "classnames";
import { faArrowDown, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import SettingsNewStore from "../../../store/SettingsNewStore";

import "./ModListUpload.scss";

/**
 * The component representing the big fat button to upload the mod-list.json file.
 * @return {ReactDOM}
 * @constructor
 */
const ModListUpload = () => {
    const { t } = useTranslation();
    const settingsNewStore = useContext(SettingsNewStore);
    const [dragCount, setDragCount] = useState(0);

    const inputId = "mod-list-upload-input";
    const classes = classNames({
        "mod-list-upload": true,
        "is-dragged-over": dragCount > 0,
    });

    let label;
    let icon = <FontAwesomeIcon icon={faFileUpload} />;
    if (dragCount > 0) {
        label = t("settings-new.upload-file.button.drop");
        icon = <FontAwesomeIcon icon={faArrowDown} />;
    } else if (settingsNewStore.isDropSupported) {
        label = (
            <Trans i18nKey="settings-new.upload-file.button.select-or-drag">
                Select your <span className="file">mod-list.json</span> file or drag it here.
            </Trans>
        );
    } else {
        label = (
            <Trans i18nKey="settings-new.upload-file.button.select">
                Select your <span className="file">mod-list.json</span> file.
            </Trans>
        );
    }

    return (
        <div
            className={classes}
            onDragEnter={() => setDragCount(dragCount + 1)}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setDragCount(dragCount - 1)}
            onDrop={(event) => {
                settingsNewStore.uploadFile(event.dataTransfer.files[0]);
                setDragCount(0);
                event.preventDefault();
            }}
        >
            <label htmlFor={inputId}>
                {icon} {label}
            </label>

            <input
                id={inputId}
                type="file"
                accept="application/json,.json"
                hidden={true}
                onChange={(event) => settingsNewStore.uploadFile(event.currentTarget.files[0])}
            />
        </div>
    );
};

export default observer(ModListUpload);
