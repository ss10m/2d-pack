import React from "react";

import { InputGroup, FormControl, Button } from "react-bootstrap";

import "./OrderId.scss";

const OrderId = ({ orderId, updateOrderId, createOrder }) => {
    return (
        <div className="create-order-id">
            <div className="order-id">
                <OrderIdInput orderId={orderId} updateOrderId={updateOrderId} />
            </div>
            <CreateOrderBtn createOrder={createOrder} />
        </div>
    );
};

const OrderIdInput = ({ orderId, updateOrderId }) => {
    return (
        <InputGroup size="lg">
            <InputGroup.Prepend>
                <InputGroup.Text
                    id="inputGroup-sizing-lg"
                    className="bg-secondary text-white"
                >
                    Order #
                </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                value={orderId}
                onChange={updateOrderId}
                type="number"
            />
        </InputGroup>
    );
};

const CreateOrderBtn = ({ createOrder }) => {
    return (
        <div className="order-btn">
            <Button variant="secondary" size="lg" onClick={createOrder} block>
                Create
            </Button>
        </div>
    );
};

export default OrderId;
