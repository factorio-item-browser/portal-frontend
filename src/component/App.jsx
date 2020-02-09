import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";

import { routeItemDetails, routeRecipeDetails, routeSearch } from "../helper/const";
import RouteStore from "../store/RouteStore";

import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import ItemDetailsPage from "./page/ItemDetailsPage";
import RecipeDetailsPage from "./page/RecipeDetailsPage";
import SearchResultsPage from "./page/SearchResultsPage";

import "./App.scss";
import LoadingCircle from "./common/LoadingCircle";

/**
 * The component representing the whole application.
 * @returns {ReactDOM}
 * @constructor
 */
const App = () => {
    const routeStore = useContext(RouteStore);

    useEffect(() => {
        (async () => {
            await routeStore.initializeSession();
        })();
    }, []);

    let page = null;
    switch (routeStore.currentRoute) {
        case routeItemDetails:
            page = <ItemDetailsPage />;
            break;

        case routeRecipeDetails:
            page = <RecipeDetailsPage />;
            break;

        case routeSearch:
            page = <SearchResultsPage />;
            break;
    }

    return (
        <Fragment>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">{page}</div>
            </div>
            <Footer />
            <LoadingCircle />
        </Fragment>
    );
};

export default observer(App);
