import React, {Fragment} from "react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Entity from "./entity/Entity";

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
            <div id="content-wrapper">
                <div id="content" style={{padding: 200}}>
                    <Entity entity={entityData} />
                    <Entity entity={entityData} />
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default App;
