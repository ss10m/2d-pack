import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import missingImg from "./missingImg.jpeg";

import { addBoxes, clearBoxes, addItems, clearItems, addNotification } from "store/actions";

import BoxList from "components/boxList/boxList.js";
import LayoutContainer from "components/layoutContainer/layoutContainer.js";

import Spinner from "components/Spinner/Spinner.js";

import "./order.scss";

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            imgCount: 0,
            totalImages: 0,
            availableBoxes: [],
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
                isLoaded: false,
                imgCount: 0,
                totalImages: 0,
                availableBoxes: [],
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
                            let toast = {
                                type: "error",
                                title: "Error",
                                message: error.message,
                                duration: 5000,
                            };

                            // TODO NOTIFICATION
                            this.props.dispatch(addNotification(toast));
                            this.props.history.push("/");
                        });
                    }
                    throw Error(response);
                }
                return response.json();
            })
            .then((response) => {
                console.log(response);
                if (this.props.match.params.id !== orderId) return;
                let boxes = [];
                for (let obj of response.boxes) {
                    boxes.push(obj.box);
                }
                this.props.dispatch(addBoxes(boxes));
                this.props.dispatch(addItems(response.boxes));
                this.setState({
                    isLoaded: true,
                    availableBoxes: response.original,
                });
                this.cacheImages(response.boxes);
            })
            .catch((error) => console.log(error));
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
                //if (Math.random() < 0.2) image.src = "35252";
                image.onload = () => {
                    console.log("LOADED");
                    item.img = image;
                    this.setState((prevState) => ({
                        imgCount: prevState.imgCount + 1,
                    }));
                };
                image.onerror = () => {
                    console.log("ERROR");
                    image.src = missingImg;
                };
            });
        });
    };

    render() {
        const { isLoaded, imgCount, totalImages, availableBoxes } = this.state;

        if (!isLoaded || imgCount !== totalImages) {
            return (
                <div className="order-spinner">
                    <Spinner animation="border" role="status" size="xl" variant="secondary">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            );
        } else {
            return (
                <div className="order-container">
                    <div className="order">
                        <BoxList availableBoxes={availableBoxes} />
                        <LayoutContainer />
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(connect()(Order));
