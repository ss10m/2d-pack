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

                    //let order = [{ id: 192162 }, { id: 192163 }];
                    //this.setState({ recentOrders: order });
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

    getItems = () => {
        let { items, showAddItems } = this.state;

        if (
            (items === undefined || items.length === 0) &&
            showAddItems === false
        ) {
            return (
                <div className="empty-items">
                    <FontAwesomeIcon
                        icon="plus-circle"
                        size="5x"
                        className="icon-color"
                        onClick={() => this.setState({ showAddItems: true })}
                    />
                </div>
            );
        } else {
            let ret = [];
            if (showAddItems) ret.push(this.getItemsAddItem());
            items.forEach((box, index) => {
                ret.push(
                    <div className="item" key={index}>
                        <div className="img">
                            <img src={box.url} alt=""></img>
                        </div>
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
                                onClick={() => this.removeItem(box)}
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

    onChange = (name) => {
        return (event) => {
            this.setState({ [name]: event.target.value });
        };
    };

    getItemsAddItem = () => {
        return (
            <div className="add-item" key="addBox">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text className="bg-secondary text-white">
                            Image URL
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="(leave blank for random image)"
                        value={this.state.orderUrl}
                        onChange={this.onChange("orderUrl")}
                    />
                </InputGroup>

                <div className="input-fields">
                    <div>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">
                                    Width
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.itemWidth} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">
                                    in
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">
                                    Height
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.itemHeight} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">
                                    in
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>

                <div className="input-fields">
                    <div>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">
                                    Item ID
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.itemId} />
                        </InputGroup>
                    </div>
                    <div>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-basic"
                                size="sm"
                                block
                            >
                                {this.state.outlineColor
                                    ? this.state.outlineColor
                                    : "Outline Color"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {this.state.colors.map((color, i) => (
                                    <Dropdown.Item
                                        key={i}
                                        onClick={() =>
                                            this.setState({
                                                outlineColor: color,
                                            })
                                        }
                                    >
                                        {color}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <div className="control-btns">
                    <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={this.confirmAddItem}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={this.hideAddItem}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    hideAddItem = () => {
        this.setState({ showAddItems: false, orderUrl: "" });
    };

    confirmAddItem = () => {
        let { orderUrl } = this.state;
        let width = this.itemWidth.current.value;
        let height = this.itemHeight.current.value;
        let id = this.itemId.current.value;
        let { outlineColor } = this.state;

        if (!width || !height || !id || !outlineColor) return;
        if (!isNumeric(width)) return;
        if (!isNumeric(height)) return;

        let newItem = {
            url: orderUrl ? orderUrl : getRandomImg(),
            width: parseInt(width),
            height: parseInt(height),
            id: id,
            product: "",
            color: outlineColor.toLowerCase(),
        };

        const items = [...this.state.items, newItem];
        this.setState({
            showAddItems: false,
            outlineColor: null,
            items,
            orderUrl: "",
        });
    };

    removeItem = (item) => {
        let { items } = this.state;
        let updatedItems = items.filter((currentItem) => currentItem !== item);
        this.setState({ items: updatedItems });
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
                <div className="create-order-items">
                    <div
                        className="create-order-header"
                        style={
                            this.state.showAddItems
                                ? { borderBottomColor: "#f5f5f5" }
                                : {}
                        }
                    >
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon
                                    icon="clipboard-list"
                                    size="sm"
                                    className="icon-color"
                                />
                            </div>
                            <span>Items</span>
                        </div>
                        <div className="opt-btn">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                    this.setState({ showAddItems: true })
                                }
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                    {this.getItems()}
                </div>
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

function getRandomImg() {
    let images = [
        "https://i.imgur.com/SeyV6fG.png",
        "https://i.imgur.com/j9HWSmS.jpeg",
        "https://i.imgur.com/QXhZt0t.jpg",
        "https://i.imgur.com/1lqBCGK.jpg",
        "https://i.imgur.com/GDAStfX.jpg",
        "https://i.imgur.com/qnpBsNw.jpg",
        "https://i.imgur.com/4PoTjBe.jpg",
        "https://i.imgur.com/ZWGeI3I.jpg",
        "https://i.imgur.com/xqWnFok.jpg",
        "https://i.imgur.com/KfQ1qsK.png",
        "https://i.imgur.com/FykFLSM.jpeg",
        "https://i.imgur.com/baPqZXo.jpg",
    ];
    return images[Math.floor(Math.random() * images.length)];
}

export default withRouter(CreateOrder);