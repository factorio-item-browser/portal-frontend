import {observer} from "mobx-react-lite";
import React, {Fragment} from "react";

import Entity from "./entity/Entity";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";

import "./App.scss"

const App = () => {

    const entityData = {
        type: "item",
        name: "electronic-circuit",
        label: "Elektronischer Schaltkreis",
        recipes: [
            {
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        amount: 1,
                    },
                    {
                        type: "item",
                        name: "copper-cable",
                        amount: 3,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "electronic-circuit",
                        amount: 1,
                    },
                ],
                craftingTime: 0.5,
                isExpensive: false,
            },
            {
                ingredients: [
                    {
                        type: "item",
                        name: "iron-plate",
                        amount: 2,
                    },
                    {
                        type: "item",
                        name: "copper-cable",
                        amount: 10,
                    },
                ],
                products: [
                    {
                        type: "item",
                        name: "electronic-circuit",
                        amount: 1,
                    },
                ],
                craftingTime: 0.5,
                isExpensive: true,
            },
        ],
    };


    return (
        <Fragment>
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="content">
                    <Entity entity={entityData} />
                    <Entity entity={entityData} />
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default observer(App);
