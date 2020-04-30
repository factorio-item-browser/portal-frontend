import classNames from "classnames";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    ERROR_CLIENT_FAILURE,
    ERROR_PAGE_NOT_FOUND,
    ERROR_SERVER_FAILURE,
    ERROR_SERVICE_NOT_AVAILABLE,
} from "../../helper/const";

import "./ErrorBox.scss";

/**
 * The classes of the icons to use for the different error types.
 * @type {Object<string, string>}
 */
const ICON_CLASSES = {
    [ERROR_CLIENT_FAILURE]: "fatal",
    [ERROR_PAGE_NOT_FOUND]: "warning",
    [ERROR_SERVER_FAILURE]: "fatal",
    [ERROR_SERVICE_NOT_AVAILABLE]: "danger",
};

/**
 * The component representing an error as box.
 * @param {string} type
 * @return {ReactDOM}
 * @constructor
 */
const ErrorBox = ({ type }) => {
    const { t } = useTranslation();

    const iconClasses = classNames({
        "error-icon": true,
        [ICON_CLASSES[type] ?? "fatal"]: true,
    });

    return (
        <div className="error-box">
            <div className={iconClasses} />
            <div className="error-message">
                <h2>{t(`error.${type}.title`)}</h2>
                <span>{t(`error.${type}.description`)}</span>
            </div>
        </div>
    );
};

ErrorBox.propTypes = {
    type: PropTypes.string.isRequired,
};

export default observer(ErrorBox);
