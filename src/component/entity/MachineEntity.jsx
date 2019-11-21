import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import EntityHead from "./EntityHead";

/**
 * The component rendering a machine as an entity box.
 * @param {MachineData} machine
 * @returns {ReactDOM}
 * @constructor
 */
const MachineEntity = ({machine}) => {
    return (
        <div className="entity entity-machine">
            <EntityHead type="machine" name={machine.name} label={machine.label} />

        </div>
    )
};

MachineEntity.propTypes = {
    machine: PropTypes.object.isRequired,
};

export default observer(MachineEntity);
