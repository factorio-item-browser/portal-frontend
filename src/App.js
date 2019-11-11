import React, {Fragment} from "react";
import Footer from "./component/layout/Footer";
import "./App.scss"

const App = () => {
    return (
        <Fragment>
            <div id="content-wrapper">
                <div id="content">Hello World!</div>
            </div>
            <Footer />
        </Fragment>
    );
};

export default App;
