import React from "react";
import { withRouter } from "react-router-dom";

import "./createOrder.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { InputGroup, FormControl, Button } from "react-bootstrap";

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            boxes: [
                { name: "Box 3", width: 37, height: 25 },
                { name: "Box 4", width: 47, height: 34 },
            ],
            recentOrders: [],
            showAddItems: false,
            showAddBoxes: false,
        };

        this.orderId = React.createRef();
    }

    removeItem = () => {
        console.log("removeItem");
    };

    createOrder = () => {
        console.log("createOrder");
        console.log(this.orderId.current.value);
    };

    getBoxes = () => {
        let { boxes, showAddBoxes } = this.state;

        if ((boxes === undefined || boxes.length === 0) && showAddBoxes === false) {
            return (
                <div className="empty-boxes">
                    <FontAwesomeIcon
                        icon="plus-circle"
                        size="5x"
                        className="icon-color"
                        onClick={() => this.setState({ showAddBoxes: true })}
                    />
                </div>
            );
        } else {
            let ret = [];
            boxes.forEach((box) => {
                console.log(box);
                ret.push(
                    <div className="box">
                        <div className="name">{box.name}</div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>12 IN</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>8 IN</div>
                        </div>
                        <div className="remove-btn">
                            <button type="button" className="btn btn-danger btn-sm">
                                Remove
                            </button>
                        </div>
                    </div>
                );
            });

            if (showAddBoxes) {
                ret.push(<div className="add-box">Add Box</div>);
            }

            return ret;
        }
    };

    getRecentOrders = () => {
        let { recentOrders } = this.state;
        console.log(recentOrders);
        if (recentOrders === undefined || recentOrders.length === 0) {
            return <div className="empty-orders">Nothing appears to be here.</div>;
        } else {
            return <div>2222</div>;
        }
    };

    render() {
        return (
            <div className="create-order-grid create-order-no-select">
                <div className="create-order-id">
                    <div className="order-id">
                        <InputGroup size="lg">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-lg" className="bg-secondary text-white">
                                    Order #
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Large"
                                aria-describedby="inputGroup-sizing-sm"
                                ref={this.orderId}
                                type="number"
                            />
                        </InputGroup>
                    </div>
                    <div className="order-btn">
                        <Button variant="secondary" size="lg" onClick={this.createOrder} block>
                            Create
                        </Button>
                    </div>
                </div>
                <div className="create-order-items">
                    <div className="create-order-header">
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon icon="clipboard-list" size="sm" className="icon-color" />
                            </div>
                            <span>Items</span>
                        </div>
                        <div className="opt-btn">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={this.removeItem}>
                                Add Item
                            </button>
                        </div>
                    </div>
                    <div className="create-order-item">
                        <div className="img">
                            <img src="https://i.imgur.com/j9HWSmS.jpeg" alt=""></img>
                        </div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>24 IN</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>16 IN</div>
                        </div>
                        <div className="remove-btn">
                            <button type="button" className="btn btn-danger btn-sm" onClick={this.removeItem}>
                                Remove
                            </button>
                        </div>
                    </div>
                    <div className="create-order-item">
                        <div className="img">
                            <img src="https://i.imgur.com/ZWGeI3I.jpg" alt=""></img>
                        </div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>36 IN</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>12 IN</div>
                        </div>
                        <div className="remove-btn">
                            <button type="button" className="btn btn-danger btn-sm">
                                Remove
                            </button>
                        </div>
                    </div>
                    <div className="create-order-item">
                        <div className="img">
                            <img src="https://i.imgur.com/4PoTjBe.jpg" alt=""></img>
                        </div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>12 IN</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>8 IN</div>
                        </div>
                        <div className="remove-btn">
                            <button type="button" className="btn btn-danger btn-sm">
                                Remove
                            </button>
                        </div>
                    </div>
                    <div className="create-order-item"></div>
                    <div className="create-order-item"></div>
                </div>
                <div className="create-order-boxes">
                    <div className="create-order-header">
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon icon="box" size="sm" className="icon-color" />
                            </div>
                            <span>Boxes</span>
                        </div>
                        <div className="opt-btn">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => this.setState({ showAddBoxes: true })}
                            >
                                Add Box
                            </button>
                        </div>
                    </div>
                    {this.getBoxes()}
                </div>
                <div className="create-order-recent-orders">
                    <div className="create-order-header">
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon icon="check-square" size="sm" className="icon-color" />
                            </div>
                            <span>Recent Orders</span>
                        </div>
                        <div className="opt-btn">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={this.removeItem}>
                                Clear Orders
                            </button>
                        </div>
                    </div>
                    {this.getRecentOrders()}
                </div>
            </div>
        );
    }
}

export default withRouter(CreateOrder);
