import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { addBox, removeBox, addNotification } from "store/actions";
import { Button, ButtonGroup, Dropdown, Spinner } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import BoxList from "./BoxList";

import "./BoxList.scss";

class BoxListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carrier: "Auto",
            showAddBox: false,
            boxSize: null,
            boxQuantity: null,
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
        this.setState({
            showAddBox: false,
            boxSize: null,
            boxQuantity: null,
        });
    };

    confirmAddBox = () => {
        if (!this.state.boxSize || !this.state.boxQuantity) return;
        let last_id = 0;
        let boxes = this.props.boxes.current;
        if (boxes.length > 0) {
            last_id = boxes[boxes.length - 1].id + 1;
        }

        let box = this.state.boxSize;
        box["weight"] = 10;
        box["quantity"] = this.state.boxQuantity;
        box["id"] = last_id;

        console.log(box);

        this.props.addBox(box);
        this.hideAddBox();
    };

    removeBox = (event, id) => {
        event.stopPropagation();
        if (id < 0 || id >= this.props.boxes.current.length) return;

        if (id < this.state.showDetailsIndex) {
            this.setState({
                showDetailsIndex: this.state.showDetailsIndex - 1,
            });
        } else if (id === this.state.showDetailsIndex) {
            this.setState({ showDetailsIndex: -1 });
        }

        this.props.removeBox(id);
    };

    printLabels = () => {
        this.setState({ fetchingLabels: true });
        let url = "/api/order/" + this.props.match.params.id + "/labels";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boxes: this.props.boxes.current }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((res) => {
                let toast = {
                    type: "success",
                    title: "Order " + this.props.match.params.id,
                    message: `Printed ${res["labels"]} ${this.state.carrier} label${
                        res["labels"] > 1 ? "s" : ""
                    }`,
                    duration: 5000,
                };

                this.props.addNotification(toast);
                this.setState({ fetchingLabels: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ fetchingLabels: false });
            });
    };

    showBoxDetails = (index) => {
        if (this.state.showDetailsIndex === index) {
            this.setState({ showDetailsIndex: -1 });
            return;
        }
        this.setState({ showDetailsIndex: index });
    };

    getBoxes = () => {
        return (
            <div>
                {this.props.boxes.current.map((box, index) => (
                    <div
                        key={index}
                        className="order-list-box grow"
                        style={{
                            height: this.state.showDetailsIndex === index ? "120px" : "50px",
                        }}
                        onClick={() => this.showBoxDetails(index)}
                    >
                        <div
                            className="order-list-box-bar"
                            style={{
                                backgroundColor: box.color,
                            }}
                        >
                            {index + 1}
                        </div>

                        <div className="order-list-box-rows ">
                            <div
                                className="order-list-box-top-row"
                                style={{
                                    height:
                                        this.state.showDetailsIndex !== index
                                            ? "100%"
                                            : "50%",
                                }}
                            >
                                <div className="order-list-box-info">
                                    {box.name}
                                    {box.quantity > 1 && (
                                        <span
                                            style={{
                                                color: "red",
                                                marginLeft: "15px",
                                                fontWeight: "500",
                                            }}
                                        >
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
                                        <div className="order-list-box-details-info-top">
                                            Width
                                        </div>
                                        <div className="order-list-box-details-info-bottom">
                                            {box["width"] + " in"}
                                        </div>
                                    </div>
                                    <div className="order-list-box-details-info">
                                        <div className="order-list-box-details-info-top">
                                            Height
                                        </div>
                                        <div className="order-list-box-details-info-bottom">
                                            {box["height"] + " in"}
                                        </div>
                                    </div>
                                    <div className="order-list-box-details-info">
                                        <div className="order-list-box-details-info-top">
                                            Weight
                                        </div>
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
        this.setState({
            boxSize,
        });
    };

    getAddNewBox = () => {
        console.log(this.state.boxSize);
        let color = this.state.boxSize ? this.state.boxSize.color : "#808080";
        return (
            <div className="order-list-add-new-box">
                <div className="order-list-box-bar" style={{ backgroundColor: color }}>
                    {this.props.boxes.current.length + 1}
                </div>
                <div className="order-list-add-new-box-inside">
                    {this.getBoxSizes()}
                    {this.getBoxQuantity()}
                </div>
                <div className="order-list-add-new-box-btn">
                    <button
                        type="button"
                        className="btn btn-success btn-sm btn-block"
                        onClick={this.confirmAddBox}
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger btn-sm btn-block"
                        onClick={this.hideAddBox}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    getBoxSizes = () => {
        let { choices } = this.props.boxes;
        return (
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                    {this.state.boxSize ? this.state.boxSize.name : "Box Size"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {choices.map((boxSize, i) => (
                        <Dropdown.Item key={i} onClick={() => this.updateDropdown(boxSize)}>
                            {boxSize.name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    getBoxQuantity = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    size="sm"
                    className="test1111"
                >
                    {this.state.boxQuantity
                        ? "Quantity " + this.state.boxQuantity
                        : "Box Quantity"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {[...Array(10).keys()].map((i) => (
                        <Dropdown.Item
                            key={i + 1}
                            onClick={() => this.updateBoxQuantity(i + 1)}
                        >
                            {"Quantity " + (i + 1)}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    updateBoxQuantity = (boxQuantity) => {
        this.setState({ boxQuantity: boxQuantity });
    };

    onCarrierChange = (option) => {
        this.setState({
            carrier: option,
        });
    };

    updateState = (state) => {
        this.setState(state);
    };

    render() {
        return (
            <BoxList
                {...this.state}
                boxes={this.props.boxes.current}
                choices={this.props.boxes.choices}
                updateState={this.updateState}
                orderId={this.props.match.params.id}
                showBoxDetails={this.showBoxDetails}
                removeBox={this.removeBox}
                printLabels={this.printLabels}
                confirmAddBox={this.confirmAddBox}
                hideAddBox={this.hideAddBox}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        boxes: state.boxes,
    };
};

const mapDispatchToProps = (dispatch) => ({
    addNotification: (notification) => {
        dispatch(addNotification(notification));
    },
    addBox: (box) => {
        dispatch(addBox(box));
    },
    removeBox: (id) => {
        dispatch(removeBox(id));
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxListContainer));
