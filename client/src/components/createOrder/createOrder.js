import React from "react";
import { withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputGroup, FormControl, Button, Spinner, Dropdown } from "react-bootstrap";

import "./createOrder.scss";

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items3: [],
            items: [
                {
                    url: "https://i.imgur.com/j9HWSmS.jpeg",
                    width: 24,
                    height: 16,
                    id: 200458,
                    color: "red",
                    product: "",
                },
                {
                    url: "https://i.imgur.com/ZWGeI3I.jpg",
                    width: 36,
                    height: 12,
                    id: 200457,
                    color: "blue",
                    product: "",
                },
                {
                    url: "https://i.imgur.com/4PoTjBe.jpg",
                    width: 12,
                    height: 8,
                    id: 200456,
                    color: "yellow",
                    product: "",
                },
            ],
            boxes: [
                { name: "Box 3", width: 37, height: 25, weight: 12 },
                { name: "Box 4", width: 47, height: 34, weight: 14 },
            ],
            recentOrders: null,
            showAddItems: false,
            showAddBoxes: false,
            colors: ["Red", "Yellow", "Blue", "Purple", "Green"],
            outlineColor: null,
        };

        this.orderId = React.createRef();
        this.boxName = React.createRef();
        this.boxWidth = React.createRef();
        this.boxHeight = React.createRef();

        this.itemUrl = React.createRef();
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

        if ((items === undefined || items.length === 0) && showAddItems === false) {
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

    getItemsAddItem = () => {
        return (
            <div className="add-item" key="addBox">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text className="bg-secondary text-white">Image URL</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="(leave blank for random image)" ref={this.itemUrl} />
                </InputGroup>

                <div className="input-fields">
                    <div>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">Width</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.itemWidth} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">in</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup size="sm">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">Height</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.itemHeight} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">in</InputGroup.Text>
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
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm" block>
                                {this.state.outlineColor ? this.state.outlineColor : "Outline Color"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {this.state.colors.map((color, i) => (
                                    <Dropdown.Item key={i} onClick={() => this.setState({ outlineColor: color })}>
                                        {color}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <div className="control-btns">
                    <button type="button" className="btn btn-success btn-sm" onClick={this.confirmAddItem}>
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => this.setState({ showAddItems: false })}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    confirmAddItem = () => {
        let url = this.itemUrl.current.value;
        let width = this.itemWidth.current.value;
        let height = this.itemHeight.current.value;
        let id = this.itemId.current.value;
        let { outlineColor } = this.state;

        if (!width || !height || !id || !outlineColor) return;
        if (!isNumeric(width)) return;
        if (!isNumeric(height)) return;

        let newItem = {
            url: url ? url : getRandomImg(),
            width: parseInt(width),
            height: parseInt(height),
            id: id,
            product: "",
            color: outlineColor,
        };

        console.log(newItem);

        const items = [...this.state.items, newItem];
        this.setState({ showAddItems: false, outlineColor: null, items });
    };

    removeItem = (item) => {
        let { items } = this.state;
        let updatedItems = items.filter((currentItem) => currentItem !== item);
        this.setState({ items: updatedItems });
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
            if (showAddBoxes) ret.push(this.getBoxesAddBox());
            boxes.forEach((box, index) => {
                ret.push(
                    <div className="box" key={index}>
                        <div className="name">{box.name}</div>
                        <div className="dimensions">
                            <div>WIDTH</div>
                            <div>{box.width + " IN"}</div>
                        </div>
                        <div className="dimensions">
                            <div>HEIGHT</div>
                            <div>{box.height + " IN"}</div>
                        </div>
                        <div className="remove-btn">
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => this.removeBox(box)}>
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
        return (
            <div className="add-box" key="addBox">
                <InputGroup size="sm">
                    <InputGroup.Prepend>
                        <InputGroup.Text className="bg-secondary text-white">Box Name</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl ref={this.boxName} />
                </InputGroup>

                <div className="input-fields">
                    <div>
                        <InputGroup size="sm" className="width">
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">Width</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.boxWidth} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">in</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup size="sm" className="width" style={{ float: "right" }}>
                            <InputGroup.Prepend>
                                <InputGroup.Text className="bg-secondary text-white text-field">Height</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl ref={this.boxHeight} />
                            <InputGroup.Append>
                                <InputGroup.Text className="bg-white">in</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>

                <div className="control-btns">
                    <button type="button" className="btn btn-success btn-sm" onClick={this.confirmAddBox}>
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
        let boxName = this.boxName.current.value;
        let width = this.boxWidth.current.value;
        let height = this.boxHeight.current.value;

        if (!boxName || !width || !height) return;
        if (!isNumeric(width)) return;
        if (!isNumeric(height)) return;

        let newBox = { name: boxName, width: parseInt(width), height: parseInt(height) };
        const boxes = [...this.state.boxes, newBox];

        this.setState({ showAddBoxes: false, boxes });
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
                    <Spinner animation="border" role="status" variant="secondary">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            );
        } else if (Array.isArray(recentOrders) && recentOrders.length === 0) {
            return <div className="empty-orders">Nothing appears to be here.</div>;
        } else {
            let ret = [];
            recentOrders.forEach((order) => {
                ret.push(
                    <div className="recent-order" key={order.id} onClick={() => this.viewOrder(order.id)}>
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

        let order = {
            id: parseInt(orderId),
            optimize: 0,
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
                    <div
                        className="create-order-header"
                        style={this.state.showAddItems ? { borderBottomColor: "#f5f5f5" } : {}}
                    >
                        <div className="header-title">
                            <div>
                                <FontAwesomeIcon icon="clipboard-list" size="sm" className="icon-color" />
                            </div>
                            <span>Items</span>
                        </div>
                        <div className="opt-btn">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => this.setState({ showAddItems: true })}
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
                        style={this.state.showAddBoxes ? { borderBottomColor: "#f5f5f5" } : {}}
                    >
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
getRandomImg();
export default withRouter(CreateOrder);
