import classNames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { PageError } from "../../error/page";

import "./ErrorBox.scss";

type Props = {
    error: PageError;
};

/**
 * The component representing an error as box.
 */
const ErrorBox: FC<Props> = ({ error }) => {
    const { t } = useTranslation();

    const iconClasses = classNames({
        "error-icon": true,
        [error.severity]: true,
    });

    return (
        <div className="error-box">
            <div className={iconClasses} />
            <div className="error-message">
                <h2>{t(`error.${error.name}.title`)}</h2>
                <span>{t(`error.${error.name}.description`)}</span>
            </div>
        </div>
    );
};

export default observer(ErrorBox);
