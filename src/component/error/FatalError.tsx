import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { PageError } from "../../error/error";
import ErrorBox from "./ErrorBox";

type Props = {
    error: PageError;
};

/**
 * The component representing a fatal error, replacing the whole page including layout.
 */
const FatalError: FC<Props> = ({ error }) => {
    return (
        <div className="error-box-wrapper">
            <ErrorBox error={error} />
        </div>
    );
};

export default observer(FatalError);
