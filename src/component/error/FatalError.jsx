// @flow

import { observer } from "mobx-react-lite";
import React from "react";
import ErrorBox from "./ErrorBox";

type Props = {
    type: string,
};

/**
 * The component representing a fatal error, replacing the whole page including layout.
 * @constructor
 */
const FatalError = ({ type }: Props): React$Node => {
    return (
        <div className="error-box-wrapper">
            <ErrorBox type={type} />
        </div>
    );
};

export default (observer(FatalError): typeof FatalError);
