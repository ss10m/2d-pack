// Libraries & utils
import React from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { addNotification } from "store/actions";

// Componenets
import CreateOrder from "./CreateOrder.js";

// Helpers
import { items, boxes, isNumeric } from "helpers";
import { API_URL } from "config";

class CreateOrderContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: "",
            items,
            boxes,
        };
    }

    updateState = (key, value) => {
        this.setState({ [key]: value });
    };

    updateOrderId = (event) => {
        let value = event.target.value;
        if (value < 0 || value > 9999999) return;
        if (value) value = parseInt(value);
        this.setState({ orderId: value });
    };

    createOrder = () => {
        const { orderId, items, boxes } = this.state;

        let warningMessage = null;
        if (!orderId || !isNumeric(orderId)) {
            warningMessage = "Missing Order ID";
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            warningMessage = "Add at least one Item";
        }
        if (!boxes || !Array.isArray(boxes) || boxes.length === 0) {
            warningMessage = "Add at least one box";
        }
        if (warningMessage) return this.showNotifications(warningMessage);

        boxes.forEach((box, i) => {
            box.name = `Box #${i + 1}`;
        });

        let order = {
            id: parseInt(orderId),
            products: items,
            boxes: boxes,
        };

        fetch(API_URL + "/api/order/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order }),
        })
            .then((res) => res.json())
            .then((res) => {
                this.props.history.push("/order/" + orderId);
            });
    };

    showNotifications(message) {
        let notification = {
            type: "error",
            message,
            duration: 5000,
        };
        this.props.addNotification(notification);
    }

    render() {
        return (
            <CreateOrder
                {...this.state}
                updateState={this.updateState}
                updateOrderId={this.updateOrderId}
                createOrder={this.createOrder}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    addNotification: (notification) => {
        dispatch(addNotification(notification));
    },
});

export default withRouter(connect(null, mapDispatchToProps)(CreateOrderContainer));
