// Libraries & utils
import React from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { addBox, removeBox, addNotification } from "store/actions";

// Components
import BoxList from "./BoxList";

import { API_URL } from "config";

class BoxListContainer extends React.Component {
    state = {
        carrier: "Auto",
        showAddBox: false,
        boxSize: null,
        boxQuantity: null,
        showDetailsIndex: null,
        fetchingLabels: false,
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.hideAddBox();
            this.setState({ showDetailsIndex: null });
        }
    }

    updateState = (state) => {
        this.setState(state);
    };

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
        box.weight = 10;
        box.quantity = this.state.boxQuantity;
        box.id = last_id;

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
            this.setState({ showDetailsIndex: null });
        }

        this.props.removeBox(id);
    };

    showBoxDetails = (index) => {
        if (this.state.showDetailsIndex === index) {
            this.setState({ showDetailsIndex: null });
            return;
        }
        this.setState({ showDetailsIndex: index });
    };

    printLabels = () => {
        let boxes = this.props.boxes.current;
        if (!boxes.length) {
            let toast = {
                type: "error",
                message: "There is nothing to print",
                duration: 5000,
            };
            this.props.addNotification(toast);
            return;
        }
        this.setState({ fetchingLabels: true });
        let carrier = this.state.carrier;
        if (carrier === "Auto") {
            let options = ["Purolator", "FedEx", "Canada Post"];
            carrier = options[Math.floor(Math.random() * options.length)];
        }
        let url = `${API_URL}/api/order/${this.props.match.params.id}/labels`;
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boxes }),
        };
        fetch(url, options)
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
                    message: `Printed ${res["labels"]} ${carrier} label${
                        res["labels"] > 1 ? "s" : ""
                    }`,
                    duration: 5000,
                };
                this.props.addNotification(toast);
                this.setState({ fetchingLabels: false });
            })
            .catch((err) => {
                this.setState({ fetchingLabels: false });
            });
    };

    render() {
        let { current, choices, oversized } = this.props.boxes;
        return (
            <BoxList
                {...this.state}
                boxes={current}
                choices={choices}
                oversized={oversized}
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
