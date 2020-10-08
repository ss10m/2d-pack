// Libraries & utils
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./store/reducers.js";

// Icons
import "./icons";

// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.min.css";

// Componenets
import App from "./App";

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
