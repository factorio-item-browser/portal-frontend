import React, {Fragment} from "react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Icon from "./common/Icon";

import "./App.scss"

const App = () => {
    return (
        <Fragment>
            <Header />
            <div id="content-wrapper">
                <div id="content" style={{padding: 200}}>
                    <Icon type="item" name="iron-plate" />
                    <Icon type="fluid" name="light-oil" transparent={false} amount={3.5} />
                </div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default App;
