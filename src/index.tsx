import React from "react";
import ReactDOM from "react-dom";
import "./style/partial/normalize.scss";
import "./util/i18n";
import App from "./component/App";

window.onerror = null;
ReactDOM.render(<App />, document.getElementById("app"));

/* eslint-disable no-undef */
if (module.hot) {
    module.hot.accept();
}
/* eslint-enable no-undef */
