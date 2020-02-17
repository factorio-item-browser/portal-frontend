import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";

import { routeIndex, routeItemDetails, routeRecipeDetails, routeSearch } from "../helper/const";

import RouteStore from "../store/RouteStore";

import Tooltip from "./common/Tooltip";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import LoadingBox from "./layout/LoadingBox";
import LoadingCircle from "./common/LoadingCircle";
import Sidebar from "./layout/Sidebar";
import IndexPage from "./page/IndexPage";
import ItemDetailsPage from "./page/ItemDetailsPage";
import RecipeDetailsPage from "./page/RecipeDetailsPage";
import SearchResultsPage from "./page/SearchResultsPage";

import "./App.scss";

const PAGE_BY_ROUTES = {
    [routeIndex]: <IndexPage />,
    [routeItemDetails]: <ItemDetailsPage />,
    [routeRecipeDetails]: <RecipeDetailsPage />,
    [routeSearch]: <SearchResultsPage />,
};

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

    if (routeStore.isInitiallyLoading) {
        return <LoadingBox />;
    }

    const page = PAGE_BY_ROUTES[routeStore.currentRoute];

    return (
        <Fragment>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">{page}</div>
            </div>
            <Footer />

            <LoadingCircle />
            <Tooltip />
        </Fragment>
    );
};

export default observer(App);
