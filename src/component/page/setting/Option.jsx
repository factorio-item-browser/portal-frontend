import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import "./Option.scss";

/**
 * The component representing one option of the setting.
 * @param {string} label
 * @param {{label: string, value: string}[]} options
 * @param {string} value
 * @param {function(string): void} onChange
 * @param {ReactDOM} children
 * @return {ReactDOM}
 * @constructor
 */
const Option = ({ label, description, options, value, onChange }) => {
    return (
        <div className="option">
            <div className="option-chevron">
                <FontAwesomeIcon icon={faChevronDown} />
            </div>

            <div className="option-head">
                <h3>{label}</h3>
                <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
                    {options.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="option-description">{description}</div>
        </div>
    );
};

Option.propTypes = {
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(Option);
