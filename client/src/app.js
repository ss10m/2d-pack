import React from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./app.css";

import NavBar from "./components/navbar/navbar.js";
import ToastCustom from "./components/toast/toast.js";
import ZoomModal from "./components/zoomModal/zoomModal.js";
import Order from "./components/order/order.js";
import CreateOrder from "./components/createOrder/createOrder.js";

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

    btnClick = () => {
        console.log("btn was clicked");
        console.log(this.props.zoomIn);
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
                <div className="App">
                    <NavBar setOrderId={this.setOrderId} />

                    <div className="body">
                        <ToastCustom />
                        {this.props.zoomIn != null && <ZoomModal />}

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

function mapStateToProps(state) {
    return {
        zoomIn: state.zoomIn,
    };
}

export default withRouter(connect(mapStateToProps)(App));
