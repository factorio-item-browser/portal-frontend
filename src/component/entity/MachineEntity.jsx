import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useContext } from "react";
import { useTranslation } from "react-i18next";

import { formatCraftingSpeed, formatEnergyUsage } from "../../helper/format";
import EntityLink from "../link/EntityLink";
import Icon from "../common/Icon";

import MachineDetail from "./MachineDetail";

import "./MachineEntity.scss";
import TooltipStore from "../../store/TooltipStore";

/**
 * Formats the number.
 * @param {number} number
 * @param {TFunction} t
 * @return string
 */
function formatNumber(number, t) {
    if (number === 0) {
        return t("recipe-details.machine.none");
    }
    if (number === 255) {
        return t("recipe-details.machine.unlimited");
    }
    return `${number}`;
}

/**
 * The component rendering a machine as an entity box.
 * @param {MachineData} machine
 * @returns {ReactDOM}
 * @constructor
 */
const MachineEntity = ({ machine }) => {
    const { t } = useTranslation();
    const tooltipStore = useContext(TooltipStore);

    const iconRef = createRef();

    if (machine.name === "character") {
        return (
            <div className="entity machine-entity">
                <div className="entity-head">
                    <Icon type="machine" name={machine.name} transparent={true} ref={iconRef} />
                    <h3>{machine.label}</h3>
                </div>
                <div className="machine-details">
                    <MachineDetail
                        label={t("recipe-details.machine.crafting-speed")}
                        value={formatCraftingSpeed(machine.craftingSpeed)}
                    />
                    <MachineDetail
                        label={t("recipe-details.machine.items")}
                        value={formatNumber(machine.numberOfItems, t)}
                    />
                    <MachineDetail
                        label={t("recipe-details.machine.fluids")}
                        value={formatNumber(machine.numberOfFluids, t)}
                    />
                </div>
                <div className="machine-details character-notice">{t("recipe-details.machine.character-notice")}</div>
            </div>
        );
    }

    return (
        <div className="entity machine-entity">
            <EntityLink
                type="item"
                name={machine.name}
                className="entity-head"
                onMouseEnter={async () => {
                    await tooltipStore.showTooltip(iconRef, "item", machine.name);
                }}
                onMouseLeave={() => {
                    tooltipStore.hideTooltip();
                }}
            >
                <Icon type="machine" name={machine.name} transparent={true} ref={iconRef} />
                <h3>{machine.label}</h3>
            </EntityLink>
            <div className="machine-details">
                <MachineDetail
                    label={t("recipe-details.machine.crafting-speed")}
                    value={formatCraftingSpeed(machine.craftingSpeed)}
                />
                <MachineDetail
                    label={t("recipe-details.machine.items")}
                    value={formatNumber(machine.numberOfItems, t)}
                />
                <MachineDetail
                    label={t("recipe-details.machine.fluids")}
                    value={formatNumber(machine.numberOfFluids, t)}
                />
                <MachineDetail
                    label={t("recipe-details.machine.modules")}
                    value={formatNumber(machine.numberOfModules, t)}
                />
                <MachineDetail
                    label={t("recipe-details.machine.energy-usage")}
                    value={formatEnergyUsage(machine.energyUsage, machine.energyUsageUnit)}
                />
            </div>
        </div>
    );
};

MachineEntity.propTypes = {
    machine: PropTypes.object.isRequired,
};

export default observer(MachineEntity);
