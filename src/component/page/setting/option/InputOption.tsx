import { observer } from "mobx-react-lite";
import React, { ChangeEvent, FC, useCallback } from "react";
import Option from "./Option";

type Props = {
    label: string;
    description?: string;
    placeholder?: string;
    value: string;
    fullWidth?: boolean;
    error?: boolean;
    onChange: (value: string) => void;
};

/**
 * The component representing an input option.
 */
const InputOption: FC<Props> = ({ label, description, placeholder, value, fullWidth, error, onChange }) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange],
    );

    return (
        <Option label={label} description={description} fullWidth={fullWidth} error={error}>
            <input type="text" value={value} placeholder={placeholder} onChange={handleChange} />
        </Option>
    );
};

export default observer(InputOption);
