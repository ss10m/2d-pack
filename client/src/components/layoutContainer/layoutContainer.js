import React from "react";
import { withRouter } from "react-router-dom";
import { Stage, Layer } from "react-konva";
import { connect } from "react-redux";

import { showZoom } from "../../store/actions";

import Layout from "../layout/layout.js";
import "./layoutContainer.css";

class LayoutContainer extends React.Component {
    zoomIn = (index) => {
        this.props.dispatch(showZoom(index));
    };

    getBoxes = () => {
        let canvasWidth = Math.max(370, Math.min(450, window.innerWidth - 50));
        let canvasHeight = 0;
        let ret = [];

        this.props.items.forEach((items, i) => {
            canvasHeight =
                (items["box"].height / items["box"].width) * canvasWidth;
            ret.push(
                <div className="order-box" key={items["box_index"]}>
                    <div className="order-box-title">
                        Box {items["box"]["name"]} [{items["box"]["width"]} in x{" "}
                        {items["box"]["height"]} in] 1 of 1
                    </div>
                    <div
                        className="order-wrapper"
                        onClick={() => this.zoomIn(i)}
                    >
                        <Stage width={canvasWidth} height={canvasHeight}>
                            <Layer>
                                <Layout
                                    items={items}
                                    canvasWidth={canvasWidth}
                                    canvasHeight={canvasHeight}
                                    zoomEnabled={true}
                                />
                            </Layer>
                        </Stage>
                    </div>
                </div>
            );
        });
        return ret;
    };

    render() {
        return (
            <div className="order-boxes  order-no-select">
                {this.getBoxes()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        items: state.items,
        windowSize: state.windowSize,
    };
};

export default withRouter(connect(mapStateToProps)(LayoutContainer));
