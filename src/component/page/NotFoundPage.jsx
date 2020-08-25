// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import { ERROR_PAGE_NOT_FOUND } from "../../const/error";
import { useDocumentTitle } from "../../util/hooks";
import ErrorBox from "../error/ErrorBox";

/**
 * The page shown when no page was found.
 * @constructor
 */
const NotFoundPage = (): React$Node => {
    useDocumentTitle();

    return <ErrorBox type={ERROR_PAGE_NOT_FOUND} />;
};

export default (observer(NotFoundPage): typeof NotFoundPage);
