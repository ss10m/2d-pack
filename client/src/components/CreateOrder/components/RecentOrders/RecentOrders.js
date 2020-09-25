import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Spinner } from "react-bootstrap";

import "./RecentOrders.scss";

const RecentOrders = (props) => {
    let { recentOrders, viewOrder, refreshRecentOrders } = props;
    return (
        <div className="create-order-recent-orders">
            <RecentOrdersHeader refreshRecentOrders={refreshRecentOrders} />
            <RecentOrderList
                recentOrders={recentOrders}
                viewOrder={viewOrder}
            />
        </div>
    );
};

const RecentOrdersHeader = ({ refreshRecentOrders }) => {
    return (
        <div className="create-order-header">
            <div className="header-title">
                <div>
                    <FontAwesomeIcon
                        icon="check-square"
                        size="sm"
                        className="icon-color"
                    />
                </div>
                <span>Recent Orders</span>
            </div>
            <div className="opt-btn">
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={refreshRecentOrders}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

const RecentOrderList = ({ recentOrders, viewOrder }) => {
    if (recentOrders === null) {
        return (
            <div className="empty-orders">
                <Spinner animation="border" role="status" variant="dark">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    } else if (Array.isArray(recentOrders) && recentOrders.length === 0) {
        return <div className="empty-orders">Nothing appears to be here.</div>;
    } else {
        let ret = [];
        recentOrders.forEach((order) => {
            ret.push(<RecentOrder order={order} viewOrder={viewOrder} />);
        });
        return <div className="orders">{ret}</div>;
    }
};

const RecentOrder = ({ order, viewOrder }) => {
    return (
        <div
            className="recent-order"
            key={order.id}
            onClick={() => viewOrder(order.id)}
        >
            <div className="id">{order.id}</div>
            <div className="date">{order.created_at}</div>
        </div>
    );
};

export default RecentOrders;
