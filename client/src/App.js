import React from "react";
import { Route, Switch } from "react-router-dom";

import { connect } from "react-redux";

import { setNavbar } from "./store/actions";

import "./App.css";

import "animate.css";

import NavBar from "./components/NavBar/NavBarContainer.js";
import ZoomInModal from "./components/ZoomInModal/ZoomInModalContainer";
import Order from "./components/order/order.js";
import CreateOrder from "./components/CreateOrder/CreateOrderContainer";
import WindowSize from "./components/WindowSize/WindowSize.js";
import Notificatons from "./components/Notification/NotificationsContainer";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            id: 0,
            isLoaded: true,
            toasts: [],
        };
    }

    hideNavbar = (event) => {
        event.preventDefault();
        if (this.props.navbarExpanded) this.props.setNavbar(false);
    };

    setOrderId = (orderId) => {
        console.log("in main " + orderId);
    };

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="app no-select">
                    <WindowSize />
                    <NavBar setOrderId={this.setOrderId} />

                    <div className="body" onClick={this.hideNavbar}>
                        <Notificatons />
                        {this.props.zoomIn != null && <ZoomInModal />}

                        <Switch>
                            <Route exact path="/">
                                <CreateOrder />
                            </Route>
                            <Route exact path="/order/:id">
                                <Order />
                            </Route>
                            <Route render={() => <h1>404</h1>} />
                        </Switch>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        zoomIn: state.zoomIn,
        navbarExpanded: state.navbarExpanded,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setNavbar: (state) => {
        dispatch(setNavbar(state));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
