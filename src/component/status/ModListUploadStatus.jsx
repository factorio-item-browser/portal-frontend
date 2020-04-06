import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

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
    if (error.length > 0) {
        return (
            <Status status={STATUS_ERROR}>
                <h3>Unable to extract mods:</h3>
                An error occurred.
            </Status>
        );
    }

    if (modNames.length > 0) {
        return (
            <Status status={STATUS_SUCCESS}>
                <h3>{modNames.length} mods have been detected:</h3>
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
