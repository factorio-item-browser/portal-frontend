import { faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, FC, useCallback } from "react";
import Option from "./Option";

export type Item = {
    value: string;
    label: string;
};

type Props = {
    label: string;
    description?: string;
    items: Item[];
    value: string;
    onChange: (value: string) => void | Promise<void>;
    fullWidth?: boolean;
    error?: boolean;
    loading?: boolean;
};

/**
 * The component representing a select input as an option.
 */
const SelectOption: FC<Props> = (props) => {
    const handleChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>): void => {
            props.onChange(event.target.value);
        },
        [props.onChange],
    );

    return (
        <Option
            label={props.label}
            description={props.description}
            icon={props.loading ? faSpinner : faChevronDown}
            error={props.error}
            fullWidth={props.fullWidth}
        >
            <select value={props.value} onChange={handleChange}>
                {props.items.map(({ value, label }: Item) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </Option>
    );
};

export default observer(SelectOption);
