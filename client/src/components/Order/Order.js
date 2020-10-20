// Libraries & utils
import React from "react";

// Components
import BoxList from "./components/BoxList/BoxListContainer";
import LayoutList from "./components/LayoutList/LayoutListContainer";
import Spinner from "components/Spinner/Spinner";
import ZoomInModal from "./components/ZoomInModal/ZoomInModalContainer";

// SCSS
import "./Order.scss";

function Order(props) {
    if (!props.isLoaded) {
        return <Spinner animation="border" role="status" size="xl" variant="secondary" />;
    } else if (props.zoomIn != null) {
        return <ZoomInModal zoomIn={props.zoomIn} setZoomIn={props.setZoomIn} />;
    } else {
        return (
            <div className="order-container">
                <div className="order">
                    <BoxList />
                    <LayoutList setZoomIn={props.setZoomIn} />
                </div>
            </div>
        );
    }
}

export default Order;
