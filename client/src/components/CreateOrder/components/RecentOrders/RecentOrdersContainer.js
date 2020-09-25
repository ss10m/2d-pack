import React from "react";
import { withRouter } from "react-router-dom";

import RecentOrders from "./RecentOrders";

class RecentOrdersContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { recentOrders: null };
    }
    componentDidMount() {
        this.fetchRecentOrders();
    }

    fetchRecentOrders = () => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result.error) {
                        console.log(result.error);
                        return;
                    }
                    this.setState({ recentOrders: result.recent_orders });
                },
                (error) => {
                    return;
                }
            );
    };

    refreshRecentOrders = () => {
        this.setState({ recentOrders: null });
        this.fetchRecentOrders();
    };

    viewOrder = (orderId) => {
        this.props.history.push("/order/" + orderId);
    };

    render() {
        return (
            <RecentOrders
                recentOrders={this.state.recentOrders}
                viewOrder={this.viewOrder}
                refreshRecentOrders={this.refreshRecentOrders}
            />
        );
    }
}

export default withRouter(RecentOrdersContainer);
