import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { MachineData } from "../../type/transfer";
import { formatCraftingSpeed, formatMachineSlots } from "../../util/format";
import Icon from "../icon/Icon";

type Props = {
    machine: MachineData;
};

/**
 * The component representing the character as a special-case machine.
 */
const CharacterMachineEntity: FC<Props> = ({ machine }) => {
    const { t } = useTranslation();

    return (
        <div className="entity machine-entity">
            <div className="entity-head">
                <Icon type="machine" name={machine.name} />
                <h3>{machine.label}</h3>
            </div>

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
            </div>
            <div className="machine-details character-notice">{t("recipe-details.machine.character-notice")}</div>
        </div>
    );
};

export default observer(CharacterMachineEntity);
