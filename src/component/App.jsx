import {observer} from "mobx-react-lite";
import React, {Fragment, useContext} from "react";

import {routeSearch} from "../helper/const";
import PageStore from "../store/PageStore";

import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import SearchResultsPage from "./page/SearchResultsPage";

import "./App.scss"

/**
 * The component representing the whole application.
 * @returns {ReactDOM}
 * @constructor
 */
const App = () => {
    const pageStore = useContext(PageStore);

    let page = null;
    switch (pageStore.currentPage) {
        case routeSearch:
            page = (
                <SearchResultsPage />
            );
            break;
    }

    return (
        <Fragment>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">
                    {page}
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default observer(App);
