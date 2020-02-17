import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import RouteStore from "../../store/RouteStore";
import Section from "../common/Section";
import EntityList from "../entity/EntityList";
import Entity from "../entity/Entity";

import "./IndexPage.scss";

/**
 * The component representing the index page.
 * @return {ReactDOM}
 * @constructor
 */
const IndexPage = () => {
    const routeStore = useContext(RouteStore);
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("index.title");
    }, []);

    return (
        <Section className="random-items" headline={t("index.random-items.headline")}>
            <EntityList>
                {routeStore.randomItems.map((entity) => {
                    return <Entity key={`${entity.type}.${entity.name}`} entity={entity} />;
                })}
            </EntityList>
        </Section>
    );
};

export default observer(IndexPage);
