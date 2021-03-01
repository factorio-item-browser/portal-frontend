import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { PageError } from "../../error/page";
import { useDocumentTitle } from "../../util/hooks";
import ErrorBox from "../error/ErrorBox";

type Props = {
    error: PageError;
};

/**
 * The page showing a (non-fatal) error as content.
 */
const ErrorPage: FC<Props> = ({ error }) => {
    useDocumentTitle();

    return <ErrorBox error={error} />;
};

export default observer(ErrorPage);
