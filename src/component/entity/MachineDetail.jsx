import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

/**
 * The component displaying one detail of a machine.
 * @param {string} label
 * @param {string} value
 * @returns {ReactDOM}
 * @constructor
 */
const MachineDetail = ({ label, value }) => {
    return (
        <div className="machine-detail">
            <span className="label">{label}:</span>
            <span className="value">{value}</span>
        </div>
    );
};

MachineDetail.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default observer(MachineDetail);
