import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import PaginatedListButton from "../../common/PaginatedListButton";
import Section from "../../common/Section";
import EntityList from "../../entity/EntityList";
import MachineEntity from "../../entity/MachineEntity";

/**
 * The component representing a list of machines.
 * @param {PaginatedList<RecipeMachinesData,MachineData>}paginatedList
 * @returns {ReactDOM|null}
 * @constructor
 */
const RecipeMachinesList = ({ paginatedList }) => {
    const { t } = useTranslation();

    if (paginatedList.numberOfResults === 0) {
        return null;
    }

    return (
        <Section headline={t("recipe-details.machine.headline", { count: paginatedList.numberOfResults })}>
            <EntityList>
                {paginatedList.results.map((machine) => {
                    return <MachineEntity key={machine.name} machine={machine} />;
                })}
            </EntityList>
            <PaginatedListButton paginatedList={paginatedList} localePrefix="recipe-details.machine.more-machines" />
        </Section>
    );
};

RecipeMachinesList.propTypes = {
    paginatedList: PropTypes.object.isRequired,
};

export default observer(RecipeMachinesList);
