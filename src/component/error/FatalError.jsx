import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import ErrorBox from "./ErrorBox";

/**
 * The component representing a fatal error, replacing the whole page including layout.
 * @param {string} type
 * @return {ReactDOM}
 * @constructor
 */
const FatalError = ({ type }) => {
    return (
        <div className="error-box-wrapper">
            <ErrorBox type={type} />
        </div>
    );
};

FatalError.propTypes = {
    type: PropTypes.string.isRequired,
};

export default observer(FatalError);
