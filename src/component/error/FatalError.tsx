import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import ErrorBox from "./ErrorBox";

type Props = {
    type: string,
};

/**
 * The component representing a fatal error, replacing the whole page including layout.
 */
const FatalError: FC<Props> = ({ type }) => {
    return (
        <div className="error-box-wrapper">
            <ErrorBox type={type} />
        </div>
    );
};

export default observer(FatalError);
