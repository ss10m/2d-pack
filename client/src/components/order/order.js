import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Spinner } from "react-bootstrap";

import {
    addBoxes,
    clearBoxes,
    addItems,
    clearItems,
} from "../../store/actions";

import BoxList from "../boxList/boxList.js";
import LayoutContainer from "../layoutContainer/layoutContainer.js";

import "./order.css";

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            imgCount: 0,
            totalImages: 0,
        };
    }

    componentDidMount() {
        this.fetchBoxes();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            console.log("ids dont match");
            this.props.dispatch(clearBoxes());
            this.props.dispatch(clearItems());
            this.setState({
                error: null,
                isLoaded: false,
                imgCount: 0,
                totalImages: 0,
            });
            this.fetchBoxes();
        }
    }

    fetchBoxes = () => {
        let orderId = this.props.match.params.id;

        console.log("FETCHING: " + orderId);

        fetch("/api/order/" + orderId)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        response.json().then((error) => {
                            this.setState({ error: error.message });
                            return;
                        });
                    }
                    throw Error(response);
                }
                return response.json();
            })
            .then((response) => {
                if (this.props.match.params.id !== orderId) return;
                let boxes = [];
                for (let obj of response.boxes) {
                    boxes.push(obj.box);
                }
                this.props.dispatch(addBoxes(boxes));
                this.props.dispatch(addItems(response.boxes));
                this.setState({
                    isLoaded: true,
                });
                this.cacheImages(response.boxes);
            })
            .catch((error) => this.setState({ error: "unknown error" }));
    };

    cacheImages = (boxes) => {
        let imgCounter = 0;
        boxes.forEach((box) => {
            box["items"].forEach((item) => {
                imgCounter++;
            });
        });

        this.setState({ totalImages: imgCounter });

        boxes.forEach((box) => {
            box["items"].forEach((item) => {
                const image = new window.Image();
                image.src = item["url"];
                image.onload = () => {
                    item.img = image;
                    this.setState({
                        imgCount: this.state.imgCount + 1,
                    });
                };
            });
        });
    };

    render() {
        const { error, isLoaded, imgCount, totalImages } = this.state;
        if (error) {
            return <div>{error}</div>;
        } else if (!isLoaded) {
            return (
                <div className="order-spinner">
                    <Spinner
                        animation="border"
                        role="status"
                        size="xl"
                        variant="secondary"
                    >
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            );
        } else if (imgCount !== totalImages) {
            return <div>Loading... 2</div>;
        } else {
            return (
                <div className="order-container">
                    <div className="order">
                        <BoxList />
                        <LayoutContainer />
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(connect()(Order));
