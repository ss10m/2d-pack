import React from "react";
import { withRouter } from "react-router-dom";

import { items, boxes, isNumeric } from "helpers";

import CreateOrder from "./CreateOrder.js";

import "./CreateOrder.scss";

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

        if (!orderId || !items || !boxes) return;
        if (!isNumeric(orderId)) return;
        if (!Array.isArray(items) || items.length === 0) return;
        if (!Array.isArray(boxes) || boxes.length === 0) return;

        boxes.forEach((box, i) => {
            box.name = `Box #${i + 1}`;
        });

        let order = {
            id: parseInt(orderId),
            products: items,
            boxes: boxes,
        };

        fetch("/api/order/create", {
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

export default withRouter(CreateOrderContainer);
