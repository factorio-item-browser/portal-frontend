import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { ERROR_PAGE_NOT_FOUND } from "../../const/error";
import { useDocumentTitle } from "../../util/hooks";
import ErrorBox from "../error/ErrorBox";

/**
 * The page shown when no page was found.
 */
const NotFoundPage: FC = () => {
    useDocumentTitle();

    return <ErrorBox type={ERROR_PAGE_NOT_FOUND} />;
};

export default observer(NotFoundPage);
