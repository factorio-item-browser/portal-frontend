// @flow

import { observer } from "mobx-react-lite";
import React, { createRef } from "react";
import { useTranslation } from "react-i18next";
import type { MachineData } from "../../type/transfer";
import { formatCraftingSpeed, formatEnergyUsage, formatMachineSlots } from "../../util/format";
import { useTooltip } from "../../util/hooks";
import Icon from "../common/Icon";
import EntityLink from "../link/EntityLink";

import "./MachineEntity.scss";

type Props = {
    machine: MachineData,
};

/**
 * The component rendering a machine as an entity box.
 * @constructor
 */
const MachineEntity = ({ machine }: Props): React$Node => {
    const { t } = useTranslation();
    const iconRef = createRef();

    const { showTooltip, hideTooltip } = useTooltip("item", machine.name, iconRef);

    return (
        <div className="entity machine-entity">
            <EntityLink
                type="item"
                name={machine.name}
                className="entity-head"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
            >
                <Icon type="machine" name={machine.name} transparent={true} ref={iconRef} />
                <h3>{machine.label}</h3>
            </EntityLink>

            <div className="machine-details">
                <div className="machine-detail">
                    <span className="label">{t("recipe-details.machine.crafting-speed")}</span>
                    <span className="value">{formatCraftingSpeed(machine.craftingSpeed)}</span>
                </div>
                <div className="machine-detail">
                    <span className="label">{t("recipe-details.machine.items")}</span>
                    <span className="value">{formatMachineSlots(machine.numberOfItems)}</span>
                </div>
                <div className="machine-detail">
                    <span className="label">{t("recipe-details.machine.fluids")}</span>
                    <span className="value">{formatMachineSlots(machine.numberOfFluids)}</span>
                </div>
                <div className="machine-detail">
                    <span className="label">{t("recipe-details.machine.modules")}</span>
                    <span className="value">{formatMachineSlots(machine.numberOfModules)}</span>
                </div>
                <div className="machine-detail">
                    <span className="label">{t("recipe-details.machine.energy-usage")}</span>
                    <span className="value">{formatEnergyUsage(machine.energyUsage, machine.energyUsageUnit)}</span>
                </div>
            </div>
        </div>
    );
};

export default (observer(MachineEntity): typeof MachineEntity);
