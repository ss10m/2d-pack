// Libraries & utils
import React from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { setOrder, clearOrder, addNotification } from "store/actions";

// Components
import Order from "./Order";

// Other
import { API_URL } from "config";
import preview from "./preview.jpeg";

class OrderContainer extends React.Component {
    state = {
        isLoaded: false,
        zoomIn: null,
    };

    componentDidMount() {
        this.fetchOrder();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.clearOrder();
            this.setState({
                isLoaded: false,
                zoomIn: null,
            });
            this.fetchOrder();
        }
    }

    setZoomIn = (id) => {
        this.setState({ zoomIn: id });
    };

    fetchOrder = () => {
        let orderId = this.props.match.params.id;
        let url = `${API_URL}/api/order/${orderId}`;
        fetch(url)
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
                            this.props.addNotification(toast);
                            this.props.history.push("/");
                        });
                    }
                    throw Error(response);
                }
                return response.json();
            })
            .then((response) => {
                if (this.props.match.params.id !== orderId) return;
                this.props.setOrder(response);
                this.cacheImages(response.boxes);
            })
            .catch((error) => console.log(error));
    };

    cacheImages = (boxes) => {
        let totalImages = 0;
        boxes.forEach(({ items }) => {
            items.forEach(() => {
                totalImages++;
            });
        });
        if (totalImages === 0) this.setState({ isLoaded: true });

        let cachedImages = 0;
        boxes.forEach(({ items }) => {
            items.forEach((item) => {
                const image = new window.Image();
                image.src = item.url;
                image.onload = () => {
                    item.img = image;
                    cachedImages++;
                    if (cachedImages === totalImages) {
                        this.setState({ isLoaded: true });
                    }
                };
                image.onerror = () => {
                    image.src = preview;
                };
            });
        });
    };

    render() {
        let { isLoaded, zoomIn } = this.state;
        return <Order isLoaded={isLoaded} zoomIn={zoomIn} setZoomIn={this.setZoomIn} />;
    }
}

const mapStateToProps = (state) => ({
    items: state.items,
});

const mapDispatchToProps = (dispatch) => ({
    setOrder: (order) => {
        dispatch(setOrder(order));
    },
    clearOrder: () => {
        dispatch(clearOrder());
    },
    addNotification: (notification) => {
        dispatch(addNotification(notification));
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderContainer));
