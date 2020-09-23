// @flow

import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import Option from "./Option";

type Props = {
    label: string,
    description?: string,
    placeholder?: string,
    value: string,
    fullWidth?: boolean,
    error?: boolean,
    onChange: (string) => void,
};

/**
 * The component representing an input option.
 * @constructor
 */
const InputOption = ({ label, description, placeholder, value, fullWidth, error, onChange }: Props): React$Node => {
    const handleChange = useCallback(
        (event: SyntheticInputEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange]
    );

    return (
        <Option label={label} description={description} fullWidth={fullWidth} error={error}>
            <input type="text" value={value} placeholder={placeholder} onChange={handleChange} />
        </Option>
    );
};

export default (observer(InputOption): typeof InputOption);
