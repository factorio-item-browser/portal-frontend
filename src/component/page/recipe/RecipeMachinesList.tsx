import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { PaginatedList } from "../../../class/PaginatedList";
import { MachineData, RecipeMachinesData } from "../../../type/transfer";
import PaginatedListButton from "../../button/PaginatedListButton";
import Section from "../../common/Section";
import CharacterMachineEntity from "../../entity/CharacterMachineEntity";
import EntityList from "../../entity/EntityList";
import MachineEntity from "../../entity/MachineEntity";

type Props = {
    paginatedList: PaginatedList<MachineData, RecipeMachinesData> | null,
};

/**
 * The component representing a list of machines.
 */
const RecipeMachinesList: FC<Props> = ({ paginatedList }) => {
    const { t } = useTranslation();

    if (!paginatedList || paginatedList.numberOfResults === 0) {
        return null;
    }

    return (
        <Section headline={t("recipe-details.machine.headline", { count: paginatedList.numberOfResults })}>
            <EntityList>
                {paginatedList.results.map((machine) => {
                    if (machine.name === "character") {
                        return <CharacterMachineEntity key={machine.name} machine={machine} />;
                    }
                    return <MachineEntity key={machine.name} machine={machine} />;
                })}
            </EntityList>
            <PaginatedListButton paginatedList={paginatedList} localePrefix="recipe-details.machine.more-machines" />
        </Section>
    );
};

export default observer(RecipeMachinesList);
