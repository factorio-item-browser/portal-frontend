import "mobx-react-lite/batchingForReactDom";
import React from "react";
import ReactDOM from "react-dom";
import "./style/partial/normalize.scss";
import "./helper/i18n";
import App from "./component/App.jsx";

window.onerror = null;
ReactDOM.render(<App />, document.getElementById("app"));

/* eslint-disable no-undef */
module.hot.accept();
/* eslint-enable no-undef */
