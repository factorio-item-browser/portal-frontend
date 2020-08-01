import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ERROR_PAGE_NOT_FOUND } from "../../const/error";
import ErrorBox from "../error/ErrorBox";

/**
 * The page shown when no page was found.
 * @return {ReactDOM}
 * @constructor
 */
const NotFoundPage = () => {
    const { t } = useTranslation();
    useEffect(() => {
        document.title = t("index.title");
    }, []);

    return <ErrorBox type={ERROR_PAGE_NOT_FOUND} />;
};

export default observer(NotFoundPage);
