import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./store/reducers.js";
import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faTimes,
    faChevronRight,
    faChevronLeft,
    faImages,
    faList,
    faClipboardList,
    faBox,
    faCheckSquare,
    faFileAlt,
    faPlusCircle,
    faBars,
    faSearch,
    faCubes,
    faTimesCircle,
    faCheckCircle,
    faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faTimes,
    faChevronRight,
    faChevronLeft,
    faImages,
    faList,
    faClipboardList,
    faBox,
    faCheckSquare,
    faFileAlt,
    faPlusCircle,
    faBars,
    faSearch,
    faCubes,
    faTimesCircle,
    faCheckCircle,
    faExclamationCircle
);

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
