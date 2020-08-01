import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import Option from "./Option";

/**
 * The component representing an input option.
 * @param {string} label
 * @param {string} value
 * @param {function(string): void} onChange
 * @param {ReactDOM} [children]
 * @param {boolean} [useFullWidth]
 * @return {ReactDOM}
 * @constructor
 */
const InputOption = ({ label, value, onChange, children, useFullWidth = false }) => {
    return (
        <Option label={label} description={children} useFullWidth={useFullWidth}>
            <input type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
        </Option>
    );
};

InputOption.propTypes = {
    children: PropTypes.any,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    useFullWidth: PropTypes.bool,
    value: PropTypes.string.isRequired,
};

export default observer(InputOption);
