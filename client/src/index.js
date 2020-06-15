import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./store/reducers.js";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./app";

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
} from "@fortawesome/free-solid-svg-icons";

//mport { faFile } from "@fortawesome/free-regular-svg-icons";

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
    faPlusCircle
);

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);
