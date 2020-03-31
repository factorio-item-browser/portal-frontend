import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Option from "./Option";

/**
 * The component representing a select option.
 * @param {string} label
 * @param {{label: string, value: string}[]} options
 * @param {string} value
 * @param {function(string): void} onChange
 * @param {ReactDOM} children
 * @param {boolean} useFullWidth
 * @return {*}
 * @constructor
 */
const SelectOption = ({ label, options, value, onChange, children, useFullWidth }) => {
    return (
        <Option label={label} description={children} useFullWidth={useFullWidth}>
            <div className="option-chevron">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>

            <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </Option>
    );
};

SelectOption.propTypes = {
    children: PropTypes.any,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    useFullWidth: PropTypes.bool,
    value: PropTypes.string.isRequired,
};

export default observer(SelectOption);
