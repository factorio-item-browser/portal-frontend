// @flow

import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import {
    ROUTE_INDEX,
    ROUTE_ITEM_DETAILS,
    ROUTE_SETTINGS_NEW,
    ROUTE_RECIPE_DETAILS,
    ROUTE_SEARCH,
    ROUTE_SETTINGS,
} from "../const/route";
import { RouteStore, routeStoreContext } from "../store/RouteStore";
import LoadingCircle from "./common/LoadingCircle";
import Tooltip from "./common/Tooltip";
import ErrorBoundary from "./error/ErrorBoundary";
import FatalError from "./error/FatalError";
import LoadingBox from "./error/LoadingBox";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import IndexPage from "./page/IndexPage";
import ItemDetailsPage from "./page/ItemDetailsPage";
import NotFoundPage from "./page/NotFoundPage";
import RecipeDetailsPage from "./page/RecipeDetailsPage";
import SearchResultsPage from "./page/SearchResultsPage";
import SettingsNewPage from "./page/SettingsNewPage";
import SettingsPage from "./page/SettingsPage";
import GlobalSettingStatus from "./status/GlobalSettingStatus";
import TemporarySettingStatus from "./status/TemporarySettingStatus";

import "./App.scss";

const PAGE_BY_ROUTES = {
    [ROUTE_INDEX]: <IndexPage />,
    [ROUTE_ITEM_DETAILS]: <ItemDetailsPage />,
    [ROUTE_RECIPE_DETAILS]: <RecipeDetailsPage />,
    [ROUTE_SEARCH]: <SearchResultsPage />,
    [ROUTE_SETTINGS]: <SettingsPage />,
    [ROUTE_SETTINGS_NEW]: <SettingsNewPage />,
};

/**
 * The component representing the whole application.
 * @constructor
 */
const App = (): React$Node => {
    const routeStore = useContext<RouteStore>(routeStoreContext);

    useEffect(() => {
        (async () => {
            await routeStore.initializeSession();
        })();
    }, []);

    if (routeStore.fatalError) {
        return <FatalError type={routeStore.fatalError} />;
    }

    if (routeStore.isInitiallyLoading) {
        return <LoadingBox />;
    }

    let page;
    if (routeStore.hasUnknownRoute) {
        page = <NotFoundPage />;
    } else {
        page = PAGE_BY_ROUTES[routeStore.currentRoute];
    }

    return (
        <ErrorBoundary>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">
                    {routeStore.showGlobalSettingStatus ? (
                        <>
                            <TemporarySettingStatus
                                setting={routeStore.setting}
                                lastUsedSetting={routeStore.lastUsedSetting}
                            />
                            <GlobalSettingStatus />
                        </>
                    ) : null}
                    {page}
                </div>
            </div>
            <Footer />

            <LoadingCircle target={routeStore.loadingCircleTarget} />
            <Tooltip />
        </ErrorBoundary>
    );
};

export default (observer(App): typeof App);
