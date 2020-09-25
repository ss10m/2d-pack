import React from "react";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    InputGroup,
    FormControl,
    Button,
    Spinner,
    Dropdown,
} from "react-bootstrap";

import { boxColors, items, boxes } from "../../helpers";

import Items from "./Items/ItemsContainer";
import Boxes from "./Boxes/BoxesContainer";

import "./CreateOrder.scss";

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items,
            boxes,
            recentOrders: null,
            showAddItems: false,
            showAddBoxes: false,
            colors: ["Red", "Yellow", "Blue", "Purple", "Green"],
            outlineColor: null,
            orderUrl: "",
        };

        this.orderId = React.createRef();
        this.boxWidth = React.createRef();
        this.boxHeight = React.createRef();

        this.itemWidth = React.createRef();
        this.itemHeight = React.createRef();
        this.itemId = React.createRef();
    }

    componentDidMount() {
        this.fetchRecentOrders();
    }

    updateState = (key, value) => {
        this.setState({ [key]: value });
    };

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
                    console.log(error);
                }
            );
    };

    refreshRecentOrders = () => {
        this.setState({ recentOrders: null });
        this.fetchRecentOrders();
    };

    onChange = (name) => {
        return (event) => {
            this.setState({ [name]: event.target.value });
        };
    };

    getBoxes = () => {
        let { boxes, showAddBoxes } = this.state;

        if (
            (boxes === undefined || boxes.length === 0) &&
            showAddBoxes === false
        ) {
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
            if (showAddBoxes) ret.push(this.getBoxesAddBox());
            boxes.forEach((box, index) => {
                ret.push(
                    <div className="box" key={index}>
                        <div
                            className="indicator"
                            style={{ backgroundColor: box.color }}
                        />
                        <div className="name">{`Box #${index + 1}`}</div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>{box.width + " IN"}</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>{box.height + " IN"}</div>
                        </div>
                        <div className="remove-btn">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => this.removeBox(box)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                );
            });

            return ret;
        }
    };

    getBoxesAddBox = () => {
        let { boxes } = this.state;
        if (boxes.length >= 7) return;
        return (
            <div className="add-box" key="addBox">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text className="bg-secondary text-white">
                            Box Name
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder={`Box #${boxes.length + 1}`}
                        disabled
                    />
                </InputGroup>

                <div className="input-fields">
                    <div>
                        <InputGroup size="sm" className="width">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">
                                    Width
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.boxWidth} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">
                                    in
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup
                            size="sm"
                            className="width"
                            style={{ float: "right" }}
                        >
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">
                                    Height
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.boxHeight} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">
                                    in
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>

                <div className="control-btns">
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={this.confirmAddBox}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => this.setState({ showAddBoxes: false })}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    confirmAddBox = () => {
        let width = this.boxWidth.current.value;
        let height = this.boxHeight.current.value;
        if (!width || !height) return;
        if (!isNumeric(width)) return;
        if (!isNumeric(height)) return;

        let newBox = {
            width: parseInt(width),
            height: parseInt(height),
            color: this.getUniqueBoxColor(),
            weight: 10,
        };
        const boxes = [...this.state.boxes, newBox];
        this.setState({ showAddBoxes: false, boxes });
    };

    getUniqueBoxColor = () => {
        let current = new Set();
        this.state.boxes.forEach((box) => current.add(box.color));
        let unique = boxColors.filter((color) => !current.has(color));
        return unique[Math.floor(Math.random() * unique.length)];
    };

    removeBox = (box) => {
        const { boxes } = this.state;
        let updatedBoxes = boxes.filter((currentBox) => currentBox !== box);
        this.setState({ boxes: updatedBoxes });
    };

    getRecentOrders = () => {
        let { recentOrders } = this.state;
        if (recentOrders === null) {
            return (
                <div className="empty-orders">
                    <Spinner animation="border" role="status" variant="dark">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            );
        } else if (Array.isArray(recentOrders) && recentOrders.length === 0) {
            return (
                <div className="empty-orders">Nothing appears to be here.</div>
            );
        } else {
            let ret = [];
            recentOrders.forEach((order) => {
                ret.push(
                    <div
                        className="recent-order"
                        key={order.id}
                        onClick={() => this.viewOrder(order.id)}
                    >
                        <div className="id">{order.id}</div>
                        <div className="date">{order.created_at}</div>
                    </div>
                );
            });
            return <div className="orders">{ret}</div>;
        }
    };

    viewOrder = (orderId) => {
        this.props.history.push("/order/" + orderId);
    };

    createOrder = () => {
        const orderId = this.orderId.current.value;
        const { items, boxes } = this.state;

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
                console.log(res);
                this.props.history.push("/order/" + orderId);
            });
    };

    render() {
        return (
            <div className="create-order-grid create-order-no-select">
                <div className="create-order-id">
                    <div className="order-id">
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
                                ref={this.orderId}
                                type="number"
                            />
                        </InputGroup>
                    </div>
                    <div className="order-btn">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={this.createOrder}
                            block
                        >
                            Create
                        </Button>
                    </div>
                </div>
                <Items
                    items={this.state.items}
                    updateState={this.updateState}
                />
                <Boxes
                    boxes={this.state.boxes}
                    updateState={this.updateState}
                />
                {/*
                <div className="create-order-boxes">
                    <div
                        className="create-order-header"
                        style={
                            this.state.showAddBoxes
                                ? { borderBottomColor: "#f5f5f5" }
                                : {}
                        }
                    >
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon
                                    icon="box"
                                    size="sm"
                                    className="icon-color"
                                />
                            </div>
                            <span>Boxes</span>
                        </div>
                        <div className="opt-btn">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                    this.setState({ showAddBoxes: true })
                                }
                            >
                                Add Box
                            </button>
                        </div>
                    </div>
                    {this.getBoxes()}
                </div>
                            */}
                <div className="create-order-recent-orders">
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
                                onClick={this.refreshRecentOrders}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                    {this.getRecentOrders()}
                </div>
            </div>
        );
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export default withRouter(CreateOrder);
