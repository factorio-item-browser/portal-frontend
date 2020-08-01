import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { indexStoreContext } from "../../store/IndexStore";
import EntityList from "../entity/EntityList";
import Entity from "../entity/Entity";

import "./IndexPage.scss";

/**
 * The component representing the index page.
 * @return {ReactDOM}
 * @constructor
 */
const IndexPage = () => {
    const indexStore = useContext(indexStoreContext);
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("index.title");
    }, []);

    return (
        <section className="random-items">
            <h2>
                {t("index.random-items.headline")}
                <div className="randomize" onClick={async () => await indexStore.randomizeItems()}>
                    <FontAwesomeIcon icon={faSyncAlt} spin={indexStore.isRandomizing} />
                    {t("index.random-items.randomize")}
                </div>
            </h2>
            <EntityList>
                {indexStore.randomItems.map((entity) => {
                    return <Entity key={`${entity.type}.${entity.name}`} entity={entity} />;
                })}
            </EntityList>
        </section>
    );
};

export default observer(IndexPage);
