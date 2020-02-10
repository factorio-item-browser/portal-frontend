import { observer } from "mobx-react-lite";
import React from "react";

import "./LoadingBox.scss";

/**
 * The component showing the initial loading box.
 * @return {ReactDOM}
 * @constructor
 */
const LoadingBox = () => {
    return (
        <div className="loading-box-wrapper">
            <div className="loading-box">
                <div className="loading-icon" />
                <div className="loading-message">
                    <h2>Loading...</h2>
                    <span>Please wait.</span>
                </div>
            </div>
        </div>
    );
};

export default observer(LoadingBox);
