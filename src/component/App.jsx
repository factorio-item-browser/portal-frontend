import {observer} from "mobx-react-lite";
import React, {Fragment} from "react";

import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import SearchResultsPage from "./page/SearchResultsPage";

import "./App.scss"

const App = () => {
    return (
        <Fragment>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">

                    <SearchResultsPage />

                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default observer(App);
