import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { hideZoom, showZoom } from "../../store/actions";
import { Stage, Layer } from "react-konva";

import Layout from "../layout/layout.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./zoomModal.css";

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const PREV_BOX = "prev";
const NEXT_BOX = "next";

class ZoomModal extends React.Component {
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        switch (event.keyCode) {
            case LEFT_KEY:
                this.changeItems(PREV_BOX);
                break;
            case RIGHT_KEY:
                this.changeItems(NEXT_BOX);
                break;
            default:
                break;
        }
    };

    changeItems = (direction) => {
        var { zoomIn, items } = this.props;

        if (items.length <= 1 || zoomIn === null) return;

        let nextIndex = null;
        switch (direction) {
            case PREV_BOX:
                if (zoomIn - 1 >= 0) nextIndex = zoomIn - 1;
                else if (zoomIn === 0) nextIndex = items.length - 1;
                break;
            case NEXT_BOX:
                if (zoomIn + 1 < items.length) nextIndex = zoomIn + 1;
                else if (zoomIn + 1 === items.length) nextIndex = 0;
                break;
            default:
                return;
        }

        if (nextIndex !== null) this.props.showZoom(nextIndex);
    };

    onOutsideClick = (event) => {
        event.preventDefault();

        if (event.target.className === "zoom-modal" || event.target.className === "zoom-modal-box") {
            this.props.hideZoom();
        }
    };

    render() {
        const index = this.props.zoomIn;
        const items = this.props.items[index];

        let canvasWidth = Math.min(window.innerWidth, 800);
        let canvasHeight = (items["box"].height / items["box"].width) * canvasWidth;

        if (window.innerHeight - 100 < canvasHeight) {
            canvasHeight = window.innerHeight - 100;
            canvasWidth = (items["box"].width / items["box"].height) * canvasHeight;
        }

        const showArrows = this.props.items.length > 1;

        return (
            <div className="zoom-modal-custom zoom-modal-noselect">
                <div className="zoom-modal" onClick={this.onOutsideClick}>
                    <div className="zoom-modal-btn zoom-modal-btn-close" onClick={this.props.hideZoom}>
                        <FontAwesomeIcon icon="times" size="2x" />
                    </div>

                    {showArrows && (
                        <>
                            <div
                                className="zoom-modal-btn zoom-modal-btn-next"
                                onClick={() => this.changeItems(NEXT_BOX)}
                            >
                                <FontAwesomeIcon icon="chevron-right" size="2x" />
                            </div>

                            <div
                                className="zoom-modal-btn zoom-modal-btn-previous"
                                onClick={() => this.changeItems(PREV_BOX)}
                            >
                                <FontAwesomeIcon icon="chevron-left" size="2x" />
                            </div>
                        </>
                    )}

                    <div className="order-box-title">
                        Box {items["box"]["name"]} [{items["box"]["width"]} in x {items["box"]["height"]} in] 1 of 1
                    </div>
                    <div className="zoom-modal-box">
                        <div className="test2">
                            <Stage width={canvasWidth} height={canvasHeight}>
                                <Layer>
                                    <Layout items={items} canvasWidth={canvasWidth} />
                                </Layer>
                            </Stage>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zoomIn: state.zoomIn,
        items: state.items,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hideZoom: () => {
            dispatch(hideZoom());
        },
        showZoom: (index) => {
            dispatch(showZoom(index));
        },
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ZoomModal));
