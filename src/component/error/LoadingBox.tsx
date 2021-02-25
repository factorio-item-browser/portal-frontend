import { observer } from "mobx-react-lite";
import React, { FC } from "react";

type Props = {
};

/**
 * The component showing the initial loading box.
 */
const LoadingBox: FC<Props> = () => {
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

export default observer(LoadingBox);
