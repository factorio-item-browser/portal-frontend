// @flow

import { observer } from "mobx-react-lite";
import React from "react";

/**
 * The component showing the initial loading box.
 * @constructor
 */
const LoadingBox = (): React$Node => {
    // We are not using the translator here, because the loading box is displayed before the language is known.
    return (
        <div className="error-box-wrapper">
            <div className="error-box">
                <div className="error-icon loading" />
                <div className="error-message">
                    <h2>Loading...</h2>
                    <span>Please wait.</span>
                </div>
            </div>
        </div>
    );
};

export default (observer(LoadingBox): typeof LoadingBox);
