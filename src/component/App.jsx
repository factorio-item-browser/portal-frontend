import React, {Fragment} from "react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import CompactRecipe from "./entity/CompactRecipe";

import "./App.scss"

const App = () => {
    const recipe = {
        craftingTime: 12.3,
        ingredients: [
            {
                type: "item",
                name: "iron-plate",
                amount: 12,
            },
            {
                type: "fluid",
                name: "light-oil",
                amount: 13.5,
            },
            {
                type: "item",
                name: "light-oil-barrel",
                amount: 1234,
            }
        ],
        products: [
            {
                type: "item",
                name: "rocket-fuel",
                amount: 1,
            }
        ]
    };


    return (
        <Fragment>
            <Header />
            <div id="content-wrapper">
                <div id="content" style={{padding: 200}}>
                    <CompactRecipe recipe={recipe} />
                    <CompactRecipe recipe={recipe} isExpensive={true} />
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default App;
