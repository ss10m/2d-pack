import React from "react";

import OrderID from "./components/OrderId/OrderId";
import Items from "./components/Items/ItemsContainer";
import Boxes from "./components/Boxes/BoxesContainer";
import RecentOrders from "./components/RecentOrders/RecentOrdersContainer";

const CreateOrder = (props) => {
    return (
        <div className="create-order-grid">
            <OrderID
                orderId={props.orderId}
                updateOrderId={props.updateOrderId}
                createOrder={props.createOrder}
            />
            <Items items={props.items} updateState={props.updateState} />
            <Boxes boxes={props.boxes} updateState={props.updateState} />
            <RecentOrders />
        </div>
    );
};

export default CreateOrder;
