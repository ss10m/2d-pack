import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";

import { addBox, removeBox, showToast } from "../../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./boxList.css";

class BoxList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carrier: "auto",
            showAddBox: false,
            boxSize: null,
            boxQuantity: null,
            boxQuantityField: null,
            showDetailsIndex: -1,
            fetchingLabels: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.hideAddBox();
            this.setState({ showDetailsIndex: -1 });
        }
    }

    hideAddBox = () => {
        console.log("hideAddBox");
        this.setState({ showAddBox: false, boxSize: null, boxQuantity: null, boxQuantityField: null });
    };

    confirmAddBox = () => {
        if (!this.state.boxSize || !this.state.boxQuantityField) return;
        var last_id = 0;
        if (this.props.boxes.length > 0) {
            last_id = this.props.boxes[this.props.boxes.length - 1].id + 1;
        }

        var box = mapBoxNameToObject(this.state.boxSize["text"]);
        box["weight"] = 10;
        box["quantity"] = this.state.boxQuantityField;
        box["id"] = last_id;

        this.props.dispatch(addBox(box));
        this.hideAddBox();
    };

    removeBox = (event, id) => {
        event.stopPropagation();
        if (id < 0 || id >= this.props.boxes.length) return;

        if (id < this.state.showDetailsIndex) {
            this.setState({ showDetailsIndex: this.state.showDetailsIndex - 1 });
        } else if (id === this.state.showDetailsIndex) {
            this.setState({ showDetailsIndex: -1 });
        }

        var idToBeRemoved = this.props.boxes[id]["id"];
        this.props.dispatch(removeBox(idToBeRemoved));
    };

    printLabels = () => {
        console.log(this.props.boxes);
        this.setState({ fetchingLabels: true });
        var url = "/api/order/" + this.props.match.params.id + "/labels";

        fetch(url, {
            method: "POST",
            body: JSON.stringify({ boxes: this.props.boxes }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((res) => {
                var toast = {
                    type: "success",
                    title: "Order " + this.props.match.params.id,
                    msg: "Printed " + res["labels"] + " labels",
                    timeout: 5000,
                };
                showToast(this.props.dispatch, toast);
                this.setState({ fetchingLabels: false });
                //this.props.history.push('/');
            })
            .catch((err) => {
                console.log(err);
                this.setState({ fetchingLabels: false });
            });
    };

    showBoxDetails = (index) => {
        console.log(index);
        if (this.state.showDetailsIndex === index) {
            this.setState({ showDetailsIndex: -1 });
            return;
        }
        this.setState({ showDetailsIndex: index });
    };

    getBoxes = () => {
        return (
            <div>
                {this.props.boxes.map((box, index) => (
                    <div
                        key={index}
                        className="order-list-box grow"
                        style={{ height: this.state.showDetailsIndex === index ? "120px" : "50px" }}
                        onClick={() => this.showBoxDetails(index)}
                    >
                        <div className="order-list-box-bar" style={{ backgroundColor: mapBoxToColor(box["name"]) }}>
                            {index + 1}
                        </div>

                        <div className="order-list-box-rows ">
                            <div
                                className="order-list-box-top-row"
                                style={{ height: this.state.showDetailsIndex !== index ? "100%" : "50%" }}
                            >
                                <div className="order-list-box-info">
                                    {"BOX " + box.name}
                                    {box.quantity > 1 && (
                                        <span style={{ color: "red", marginLeft: "15px", fontWeight: "500" }}>
                                            {"x" + box.quantity}
                                        </span>
                                    )}
                                </div>
                                <div className="order-list-box-btn">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={(e) => this.removeBox(e, index)}
                                    >
                                        <FontAwesomeIcon icon="times" size="lg" />
                                    </button>
                                </div>
                            </div>
                            {this.state.showDetailsIndex === index && (
                                <div className="order-list-box-details ">
                                    <div className="order-list-box-details-info">
                                        <div className="order-list-box-details-info-top">Width</div>
                                        <div className="order-list-box-details-info-bottom">{box["width"] + " in"}</div>
                                    </div>
                                    <div className="order-list-box-details-info">
                                        <div className="order-list-box-details-info-top">Height</div>
                                        <div className="order-list-box-details-info-bottom">
                                            {box["height"] + " in"}
                                        </div>
                                    </div>
                                    <div className="order-list-box-details-info">
                                        <div className="order-list-box-details-info-top">Weight</div>
                                        <div className="order-list-box-details-info-bottom">
                                            {box["weight"] + " lb"}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    updateDropdown = (boxSize) => {
        var boxSizeToQuantity = { "1": 5, "2": 5, "3": 3, "4": 2, "5": 3 };
        var boxQuantity = 0;
        if (boxSize["val"] === "CUSTOM") {
            boxQuantity = 2;
        } else {
            boxQuantity = boxSizeToQuantity[boxSize["val"]];
        }
        this.setState({ boxSize: boxSize, boxQuantity: boxQuantity, boxQuantityField: null });
    };

    getAddNewBox = () => {
        var color = this.state.boxSize ? mapBoxToColor(this.state.boxSize["text"]) : "#808080";
        return (
            <div className="order-list-add-new-box">
                <div className="order-list-box-bar" style={{ backgroundColor: color }}>
                    {this.props.boxes.length + 1}
                </div>
                <div className="order-list-add-new-box-inside">
                    {this.getBoxSizes()}
                    {this.getBoxQuantity()}
                </div>
                <div className="order-list-add-new-box-btn">
                    <button type="button" className="btn btn-success btn-sm btn-block" onClick={this.confirmAddBox}>
                        Confirm
                    </button>
                    <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => this.hideAddBox()}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    getBoxSizes = () => {
        var boxSizes = [
            { val: "1", text: "#1" },
            { val: "2", text: "#2" },
            { val: "3", text: "#3" },
            { val: "4", text: "#4" },
            { val: "5", text: "#5" },
            { val: "CUSTOM", text: "CUSTOM" },
        ];

        return (
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm" className="test1111">
                    {this.state.boxSize ? "Box " + this.state.boxSize["text"] : "Box Size"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {boxSizes.map((boxSize, i) => (
                        <Dropdown.Item key={i} onClick={() => this.updateDropdown(boxSize)}>
                            {"Box " + boxSize["text"]}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    getBoxQuantity = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm" className="test1111">
                    {this.state.boxQuantityField ? "Quantity " + this.state.boxQuantityField : "Box Quantity"}
                </Dropdown.Toggle>

                {this.state.boxQuantity && (
                    <Dropdown.Menu>
                        {[...Array(this.state.boxQuantity).keys()].map((i) => (
                            <Dropdown.Item key={i} onClick={() => this.updateBoxQuantity(i + 1)}>
                                {"Quantity " + (i + 1)}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
            </Dropdown>
        );
    };

    updateBoxQuantity = (boxQuantity) => {
        this.setState({ boxQuantityField: boxQuantity });
    };

    onCarrierChange = (option) => {
        this.setState({
            carrier: option,
        });
    };

    render() {
        return (
            <div className="order-list order-list-noselect">
                <div className="order-list-boxes">
                    <div className="order-list-id-container">
                        <div className="order-list-id-icon">
                            <FontAwesomeIcon icon="file-alt" size="sm" />
                        </div>
                        {"Order " + this.props.match.params.id}
                    </div>

                    <div className="order-list-boxes-header">
                        <div className="order-list-boxes-header-icon">
                            <FontAwesomeIcon icon="box" size="sm" />
                        </div>
                        <div className="order-list-boxes-title">Boxes</div>
                        <div className="order-list-box-btn">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm btn-block"
                                onClick={() => this.setState({ showAddBox: true })}
                            >
                                Add Box
                            </button>
                        </div>
                    </div>
                    {this.getBoxes()}
                    {this.state.showAddBox && this.getAddNewBox()}
                </div>

                <ButtonGroup className="order-group-toggle">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.onCarrierChange("auto");
                        }}
                        active={this.state.carrier === "auto"}
                    >
                        Auto
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.onCarrierChange("purolator");
                        }}
                        active={this.state.carrier === "purolator"}
                    >
                        Purolator
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.onCarrierChange("fedEx");
                        }}
                        active={this.state.carrier === "fedEx"}
                    >
                        FedEx
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.onCarrierChange("canadapost");
                        }}
                        active={this.state.carrier === "canadapost"}
                    >
                        Canada Post
                    </Button>
                </ButtonGroup>

                <div className="order-list-print-btn">
                    <Button variant="secondary" onClick={this.printLabels} block>
                        {this.state.fetchingLabels && (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="order-btn-spinner"
                            />
                        )}
                        {this.state.fetchingLabels ? "Loading" : "Print Labels"}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(BoxList));

function mapBoxToColor(boxSize) {
    switch (boxSize) {
        case "#1":
            return "#ffff00";
        case "#2":
            return "#ff0000"; //red
        case "#3":
            return "#0000ff"; //blue
        case "#4":
            return "#008000"; //green
        case "#5":
            return "#eb4596"; //purple
        case "CUSTOM":
            return "orange"; //orange
        default:
            return "#808080"; //grey
    }
}

function mapBoxNameToObject(boxName) {
    var boxObjects = {
        "#1": {
            width: 18,
            height: 13,
            name: "#1",
            quantity: 1,
            weight: 0,
        },
        "#2": {
            width: 25,
            height: 19,
            name: "#2",
            quantity: 1,
            weight: 0,
        },
        "#3": {
            width: 37,
            height: 25,
            name: "#3",
            quantity: 1,
            weight: 0,
        },
        "#4": {
            width: 47,
            height: 34,
            name: "#4",
            quantity: 1,
            weight: 0,
        },
        "#5": {
            width: 52,
            height: 42,
            name: "#5",
            quantity: 1,
            weight: 0,
        },
        CUSTOM: {
            width: 0,
            height: 0,
            name: "CUSTOM",
            quantity: 1,
            weight: 0,
        },
    };

    return boxObjects[boxName];
}

function mapStateToProps(state) {
    return {
        boxes: state.boxes,
    };
}
