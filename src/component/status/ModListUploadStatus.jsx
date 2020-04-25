import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import { STATUS_ERROR, STATUS_SUCCESS } from "../../helper/const";

import Status from "./Status";

/**
 * The component representing the status of the mod-list upload.
 * @param {string[]} modNames
 * @param {string} error
 * @return {ReactDOM|null}
 * @constructor
 */
const ModListUploadStatus = ({ modNames, error }) => {
    const { t } = useTranslation();

    if (error.length > 0) {
        return (
            <Status status={STATUS_ERROR}>
                <h3>{t("settings-new.upload-file.status.error.headline")}</h3>
                {t(`settings-new.upload-file.status.error.message.${error}`)}
            </Status>
        );
    }

    if (modNames.length > 0) {
        return (
            <Status status={STATUS_SUCCESS}>
                <h3>{t("settings-new.upload-file.status.success.headline", { count: modNames.length })}</h3>
                {modNames.join(", ")}
            </Status>
        );
    }

    return null;
};

ModListUploadStatus.propTypes = {
    error: PropTypes.string.isRequired,
    modNames: PropTypes.array.isRequired,
};

export default observer(ModListUploadStatus);
