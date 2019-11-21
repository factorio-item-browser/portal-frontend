import {observer} from "mobx-react-lite";
import React, {Fragment, useContext} from "react";
import {useTranslation} from "react-i18next";

import RecipeStore from "../../store/RecipeStore";
import DetailsHead from "../common/DetailsHead";
import Detail from "../common/Detail";
import CopyTemplate from "../common/CopyTemplate";
import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import MachineEntity from "../entity/MachineEntity";

/**
 * The component representing the details page of a recipe.
 * @returns {ReactDOM}
 * @constructor
 */
const RecipeDetailsPage = () => {
    const { t } = useTranslation();
    const recipeStore = useContext(RecipeStore);
    const data = recipeStore.currentRecipeDetails;

    return (
        <Fragment>
            <DetailsHead
                type="recipe"
                name={data.name}
                title={data.label}
            >
                <Detail hidden={!data.description}>{data.description}</Detail>
                <Detail>
                    <CopyTemplate
                        label={t("copy-template.rich-text-icon.label")}
                        template={`[img=recipe/${data.name}]`}
                        description={t("copy-template.rich-text-icon.description")}
                    />
                </Detail>
            </DetailsHead>

            <Section
                headline={t("recipe-details.machine.headline", {count: data.machines.length})}
            >
                <EntityList>
                    {data.machines.map((machine) => {
                        return <MachineEntity key={machine.name} machine={machine} />
                    })}
                </EntityList>
            </Section>
        </Fragment>
    );
};

export default observer(RecipeDetailsPage);
