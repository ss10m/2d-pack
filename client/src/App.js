// Libraries & utils
import React from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { setNavbar } from "./store/actions";

// Components
import NavBar from "./components/NavBar/NavBarContainer.js";
import ZoomInModal from "./components/ZoomInModal/ZoomInModalContainer";
import Order from "./components/Order/OrderContainer.js";
import CreateOrder from "./components/CreateOrder/CreateOrderContainer";
import WindowSize from "./components/WindowSize/WindowSize.js";
import Notificatons from "./components/Notifications/NotificationsContainer";

// SCSS
import "./App.scss";

class App extends React.Component {
    hideNavbar = (event) => {
        event.preventDefault();
        if (this.props.navbarExpanded) this.props.setNavbar(false);
    };

    render() {
        return (
            <div className="app no-select">
                <WindowSize />
                <NavBar />
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
